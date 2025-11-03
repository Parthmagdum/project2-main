# 🚀 Netlify Deployment Guide

## Prerequisites
✅ Build completed successfully (dist folder created)
✅ Netlify configuration file created (netlify.toml)
✅ All dependencies installed

## Deployment Steps

### Method 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```powershell
   netlify login
   ```

3. **Deploy to Netlify**:
   ```powershell
   netlify deploy --prod
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or leave blank for random name)
   - When asked for publish directory, enter: `dist`

### Method 2: Deploy via Netlify Dashboard (Easiest)

1. **Go to Netlify**: https://app.netlify.com/

2. **Create New Site**:
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder from your project

3. **Or Connect to Git**:
   - Click "Add new site" → "Import from Git"
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository
   - Build settings will be auto-detected from `netlify.toml`

### Method 3: Drag & Drop (Fastest for testing)

1. Open https://app.netlify.com/drop
2. Drag the entire `dist` folder into the browser
3. Your site will be live in seconds!

## Important Configuration

### Environment Variables (If using Supabase)
After deployment, add these to Netlify:

1. Go to Site settings → Environment variables
2. Add your Supabase credentials:
   - `VITE_SUPABASE_URL` = your_supabase_url
   - `VITE_SUPABASE_ANON_KEY` = your_supabase_key

### Build Settings (Auto-configured via netlify.toml)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

## Post-Deployment Checklist

✅ Test the live site URL
✅ Verify all pages load correctly
✅ Test student login and feedback submission
✅ Test faculty login and reply functionality
✅ Verify Gemini AI classification works
✅ Test anonymous feedback feature
✅ Check edit/delete functionality
✅ Test all category filters

## Continuous Deployment (Optional)

If you connected via Git:
- Every push to your main branch will automatically trigger a new deployment
- Netlify will rebuild and redeploy your site automatically

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Troubleshooting

### If build fails on Netlify:
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify Node version compatibility

### If site loads but features don't work:
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase URL and keys are correct

## Your Site Info

- **Build Command**: npm run build
- **Publish Directory**: dist
- **Build Output**: 405.44 kB (gzipped: 112.43 kB)
- **Gemini API Key**: Configured ✅
- **Node Version**: 18

## Quick Deploy Commands

```powershell
# Build for production
npm run build

# Deploy to Netlify (after netlify-cli is installed)
netlify deploy --prod

# Or test deployment first
netlify deploy --dir=dist
```

---

**Ready to deploy!** 🎉

Choose your preferred method above and your Student Feedback System will be live on Netlify!
