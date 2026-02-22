import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pobierz GEMINI_API_KEY z zmiennych środowiskowych Vercel
const geminiApiKey = process.env.GEMINI_API_KEY || '';

if (!geminiApiKey) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY nie jest ustawiona. Użyję pustego stringa.');
}

// Ścieżka do pliku environment.prod.ts
const envProdPath = join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

// Zawartość pliku environment.prod.ts
const envProdContent = `export const environment = {
    production: true,
    geminiApiKey: '${geminiApiKey}',
};
`;

// Upewnij się, że katalog istnieje
const envDir = dirname(envProdPath);
try {
    mkdirSync(envDir, { recursive: true });
} catch (error) {
    // Katalog już istnieje, to OK
}

// Zapisz plik
try {
    writeFileSync(envProdPath, envProdContent, 'utf8');
    console.log('✅ Wygenerowano environment.prod.ts');
    console.log(`   Ścieżka: ${envProdPath}`);
    if (geminiApiKey) {
        console.log(`   API Key: ${geminiApiKey.substring(0, 8)}...${geminiApiKey.substring(geminiApiKey.length - 4)}`);
    } else {
        console.log('   ⚠️  API Key: PUSTY');
    }
} catch (error) {
    console.error('❌ Błąd podczas generowania environment.prod.ts:', error);
    process.exit(1);
}
