# Konfiguracja Vercel - GEMINI_API_KEY

## Krok 1: Dodaj zmienną środowiskową w Vercel

1. Przejdź do swojego projektu na [Vercel Dashboard](https://vercel.com/dashboard)
2. Kliknij **Settings** → **Environment Variables**
3. Dodaj nową zmienną:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Twój klucz API Gemini
   - **Environment**: Wybierz wszystkie (Production, Preview, Development)

## Krok 2: Jak to działa

1. **Development** (`npm run dev`):
   - Używa `src/environments/environment.ts` z fallbackowym kluczem
   - Bezpieczne dla lokalnego developmentu

2. **Production Build** (`npm run build` lub `npm run build:prod`):
   - Automatycznie uruchamia `prebuild` script
   - Generuje `src/environments/environment.prod.ts` z `GEMINI_API_KEY` z Vercel
   - Angular używa `environment.prod.ts` zamiast `environment.ts` w production build

## Krok 3: Użycie w kodzie

```typescript
import { environment } from '../../src/environments/environment';

// W serwisie lub komponencie
const apiKey = environment.geminiApiKey;
```

## Bezpieczeństwo

✅ `environment.ts` (dev) - commitowany, zawiera fallback  
✅ `environment.prod.ts` - **NIE** commitowany (w .gitignore)  
✅ `GEMINI_API_KEY` - tylko w Vercel Environment Variables  
✅ Brak `process.env` w kodzie frontendowym (nie powoduje ReferenceError)

## Testowanie lokalnie

Aby przetestować production build lokalnie:

```bash
# Ustaw zmienną środowiskową
$env:GEMINI_API_KEY="twoj-klucz-api"

# Uruchom build
npm run build:prod
```
