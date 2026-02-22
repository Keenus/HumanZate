import { Injectable, signal, computed } from '@angular/core';

interface UsageRecord {
    count: number;
    resetAt: number; // timestamp
}

interface RateLimitConfig {
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
}

@Injectable({
    providedIn: 'root'
})
export class RateLimitService {
    private readonly STORAGE_KEY = 'humanzate_usage';
    private readonly CONFIG_KEY = 'humanzate_rate_config';
    
    // Domyślne limity - można zmienić
    private readonly DEFAULT_CONFIG: RateLimitConfig = {
        dailyLimit: 10,      // 10 użyć dziennie
        weeklyLimit: 50,     // 50 użyć tygodniowo
        monthlyLimit: 200    // 200 użyć miesięcznie
    };

    private usage = signal<UsageRecord[]>(this.loadUsage());
    private config = signal<RateLimitConfig>(this.loadConfig());

    // Oblicz pozostałe użycia
    remainingDaily = computed(() => {
        const daily = this.getDailyUsage();
        return Math.max(0, this.config().dailyLimit - daily);
    });

    remainingWeekly = computed(() => {
        const weekly = this.getWeeklyUsage();
        return Math.max(0, this.config().weeklyLimit - weekly);
    });

    remainingMonthly = computed(() => {
        const monthly = this.getMonthlyUsage();
        return Math.max(0, this.config().monthlyLimit - monthly);
    });

    // Sprawdź czy można użyć
    canUse = computed(() => {
        return this.remainingDaily() > 0 && 
               this.remainingWeekly() > 0 && 
               this.remainingMonthly() > 0;
    });

    constructor() {
        // Cleanup starych rekordów przy starcie
        this.cleanupOldRecords();
    }

    /**
     * Próbuje zarejestrować użycie. Zwraca true jeśli udało się, false jeśli limit przekroczony.
     */
    tryUse(): { success: boolean; reason?: string } {
        if (!this.canUse()) {
            const reasons: string[] = [];
            if (this.remainingDaily() === 0) {
                const resetTime = this.getNextDailyReset();
                const hoursUntilReset = Math.ceil((resetTime - Date.now()) / (1000 * 60 * 60));
                reasons.push(`Dzienny limit (${this.config().dailyLimit}) przekroczony. Reset za ~${hoursUntilReset}h`);
            }
            if (this.remainingWeekly() === 0) {
                const resetTime = this.getNextWeeklyReset();
                const daysUntilReset = Math.ceil((resetTime - Date.now()) / (1000 * 60 * 60 * 24));
                reasons.push(`Tygodniowy limit (${this.config().weeklyLimit}) przekroczony. Reset za ~${daysUntilReset}d`);
            }
            if (this.remainingMonthly() === 0) {
                const resetTime = this.getNextMonthlyReset();
                const daysUntilReset = Math.ceil((resetTime - Date.now()) / (1000 * 60 * 60 * 24));
                reasons.push(`Miesięczny limit (${this.config().monthlyLimit}) przekroczony. Reset za ~${daysUntilReset}d`);
            }
            return { success: false, reason: reasons.join('. ') };
        }

        // Dodaj nowe użycie
        const records = this.usage();
        records.push({
            count: 1,
            resetAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 dni w przyszłości
        });
        
        this.usage.set(records);
        this.saveUsage();
        this.cleanupOldRecords();

        return { success: true };
    }

    /**
     * Pobierz statystyki użycia
     */
    getStats() {
        return {
            daily: {
                used: this.getDailyUsage(),
                limit: this.config().dailyLimit,
                remaining: this.remainingDaily()
            },
            weekly: {
                used: this.getWeeklyUsage(),
                limit: this.config().weeklyLimit,
                remaining: this.remainingWeekly()
            },
            monthly: {
                used: this.getMonthlyUsage(),
                limit: this.config().monthlyLimit,
                remaining: this.remainingMonthly()
            },
            nextDailyReset: this.getNextDailyReset(),
            nextWeeklyReset: this.getNextWeeklyReset(),
            nextMonthlyReset: this.getNextMonthlyReset()
        };
    }

    /**
     * Reset wszystkich limitów (dla testów/admina)
     */
    resetLimits() {
        this.usage.set([]);
        this.saveUsage();
    }

    /**
     * Zmień konfigurację limitów
     */
    updateConfig(config: Partial<RateLimitConfig>) {
        this.config.set({ ...this.config(), ...config });
        this.saveConfig();
    }

    // Prywatne metody pomocnicze

    private getDailyUsage(): number {
        const now = Date.now();
        const dayStart = this.getDayStart(now);
        return this.usage()
            .filter(r => r.resetAt >= dayStart)
            .reduce((sum, r) => sum + r.count, 0);
    }

    private getWeeklyUsage(): number {
        const now = Date.now();
        const weekStart = this.getWeekStart(now);
        return this.usage()
            .filter(r => r.resetAt >= weekStart)
            .reduce((sum, r) => sum + r.count, 0);
    }

    private getMonthlyUsage(): number {
        const now = Date.now();
        const monthStart = this.getMonthStart(now);
        return this.usage()
            .filter(r => r.resetAt >= monthStart)
            .reduce((sum, r) => sum + r.count, 0);
    }

    private getDayStart(timestamp: number): number {
        const date = new Date(timestamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    private getWeekStart(timestamp: number): number {
        const date = new Date(timestamp);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    private getMonthStart(timestamp: number): number {
        const date = new Date(timestamp);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    private getNextDailyReset(): number {
        const now = Date.now();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.getTime();
    }

    private getNextWeeklyReset(): number {
        const now = Date.now();
        const date = new Date(now);
        const day = date.getDay();
        const diff = 8 - day; // Dni do poniedziałku
        date.setDate(date.getDate() + diff);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    private getNextMonthlyReset(): number {
        const now = Date.now();
        const date = new Date(now);
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    private cleanupOldRecords() {
        const now = Date.now();
        const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
        const cleaned = this.usage().filter(r => r.resetAt > monthAgo);
        if (cleaned.length !== this.usage().length) {
            this.usage.set(cleaned);
            this.saveUsage();
        }
    }

    private loadUsage(): UsageRecord[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return [];
            const parsed = JSON.parse(stored);
            // Walidacja - usuń nieprawidłowe rekordy
            return Array.isArray(parsed) ? parsed.filter((r: any) => 
                r && typeof r.count === 'number' && typeof r.resetAt === 'number'
            ) : [];
        } catch {
            return [];
        }
    }

    private saveUsage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usage()));
        } catch (error) {
            console.error('Failed to save usage:', error);
        }
    }

    private loadConfig(): RateLimitConfig {
        try {
            const stored = localStorage.getItem(this.CONFIG_KEY);
            if (stored) {
                return { ...this.DEFAULT_CONFIG, ...JSON.parse(stored) };
            }
        } catch {
            // Ignore
        }
        return { ...this.DEFAULT_CONFIG };
    }

    private saveConfig() {
        try {
            localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config()));
        } catch (error) {
            console.error('Failed to save config:', error);
        }
    }
}
