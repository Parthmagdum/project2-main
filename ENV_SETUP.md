# Environment Configuration Guide

This guide explains how to set up your environment variables for the Student Feedback Management System.

## 📋 Prerequisites

Before you begin, make sure you have:
1. A Supabase account and project
2. A Google Gemini API key

## 🔐 Environment Variables Setup

### Step 1: Create .env File

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Configure Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or select a project
3. Click **"Get API Key"**
4. Copy the API key → `VITE_GEMINI_API_KEY`

### Step 4: Update .env File

Your `.env` file should look like this:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## ⚠️ Important Notes

### Security
- ✅ `.env` is already in `.gitignore` - **Never commit this file!**
- ✅ Use `.env.example` for sharing configuration structure
- ✅ Keep your API keys private and secure

### Vite Environment Variables
- All environment variables must start with `VITE_` to be exposed to the client
- Access them using `import.meta.env.VITE_VARIABLE_NAME`
- Changes to `.env` require restarting the dev server

## 🚀 Usage

The application automatically loads environment variables from the `.env` file:

### Supabase (Database)
```typescript
// Used in: src/config/supabase.ts
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Gemini AI (Sentiment Analysis)
```typescript
// Used in: src/utils/geminiApi.ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

## 🔄 Restart Development Server

After updating `.env`, restart the server:

```bash
# Stop the current server (Ctrl + C)
# Then restart
npm run dev
```

## 🆘 Troubleshooting

### Variables Not Loading?
1. Ensure variable names start with `VITE_`
2. Restart the development server
3. Check for typos in variable names

### Supabase Connection Issues?
1. Verify URL format: `https://yourproject.supabase.co`
2. Ensure anon key is copied completely
3. Check Supabase project is active

### Gemini API Errors?
1. Verify API key is valid
2. Check Google Cloud billing is enabled
3. Ensure Generative Language API is enabled

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes | `eyJhbGci...` |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes | `AIzaSy...` |

## 🔗 Helpful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Google AI Studio](https://makersuite.google.com)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
