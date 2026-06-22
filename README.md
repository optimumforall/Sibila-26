# Sibila 26 — App Analizadora de Contenido

App privada para Juana (Sibila 26). Analiza vídeos e imágenes antes de publicarlos en Instagram usando IA.

---

## Stack

- **Frontend + Backend:** Next.js 14 + Vercel
- **Base de datos + Auth + Storage:** Supabase
- **Análisis IA:** Claude API (Anthropic)
- **Transcripción audio:** Whisper API (OpenAI)
- **Email:** Resend

---

## Instalación paso a paso

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/sibila-26.git
cd sibila-26
npm install
```

### 2. Configurar Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase-setup.sql`
3. Ir a **Storage** → **New bucket** → Nombre: `content-uploads`, Public: OFF
4. Ir a **Authentication** → **Providers** → Activar **Google**
5. Configurar Google OAuth en Google Cloud Console (Client ID + Secret)

### 3. Variables de entorno
```bash
cp .env.local.example .env.local
```
Rellenar todas las variables en `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — en Supabase > Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — en Supabase > Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` — en Supabase > Settings > API
- `ANTHROPIC_API_KEY` — en [console.anthropic.com](https://console.anthropic.com)
- `OPENAI_API_KEY` — en [platform.openai.com](https://platform.openai.com)
- `RESEND_API_KEY` — en [resend.com](https://resend.com)
- `ALLOWED_EMAIL` — email de Gmail de Juana
- `JUANA_EMAIL` — email donde recibir los análisis

### 4. Desarrollo local
```bash
npm run dev
```
Abrir [http://localhost:3000](http://localhost:3000)

### 5. Deploy en Vercel
1. Subir el código a GitHub
2. Conectar el repo en [vercel.com](https://vercel.com)
3. Añadir todas las variables de entorno en Vercel > Settings > Environment Variables
4. En Supabase > Authentication > URL Configuration:
   - Site URL: `https://tu-app.vercel.app`
   - Redirect URLs: `https://tu-app.vercel.app/auth/callback`

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # API de análisis principal
│   │   └── analyses/
│   │       ├── route.ts          # Lista de análisis
│   │       └── [id]/route.ts     # Detalle de análisis
│   ├── auth/callback/route.ts    # Callback OAuth
│   ├── dashboard/page.tsx        # Formulario de subida
│   ├── historial/
│   │   ├── page.tsx              # Lista de análisis
│   │   └── [id]/page.tsx         # Detalle histórico
│   ├── login/page.tsx            # Login con Google
│   └── resultado/[id]/page.tsx   # Resultado del análisis
├── components/
│   ├── layout/Header.tsx         # Header compartido
│   └── ui/ResultadoView.tsx      # Vista de resultado reutilizable
├── lib/supabase/
│   ├── client.ts                 # Cliente navegador
│   └── server.ts                 # Cliente servidor
├── middleware.ts                 # Protección de rutas + whitelist
└── types/index.ts                # Tipos TypeScript
```

---

## Coste estimado

| Servicio | Coste |
|---|---|
| Vercel | Gratuito |
| Supabase | Gratuito |
| Claude API | ~0.003€ / análisis |
| Whisper API | ~0.009€ / vídeo |
| Resend | Gratuito (3.000 emails/mes) |
| **Total** | **< 1€ / mes** |

---

*Desarrollado por Optimum for All para Sibila 26 · 2026*
