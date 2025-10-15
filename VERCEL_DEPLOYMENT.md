# 🚀 Vercel Deployment Guide

## Step-by-Step Instructions to Deploy on Vercel

### **Prerequisites**
- GitHub account
- Vercel account (free at vercel.com)
- Git installed on your computer

---

## **Step 1: Push to GitHub**

1. **Initialize Git** (if not already done):
   ```bash
   cd "E:\AIProjects\karbit-RAG"
   git init
   git add .
   git commit -m "Initial commit: Chat interface ready for Vercel"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub.com](https://github.com)
   - Click "New Repository"
   - Name it `karbit-RAG`
   - **Don't initialize** with README
   - Create repository

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/aayushmishraaa/karbit-RAG.git
   git branch -M main
   git push -u origin main
   ```

---

## **Step 2: Deploy on Vercel**

### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select `karbit-RAG` repository
   - Click "Import"

3. **Configure Deployment**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `public`
   - **Install Command**: `npm install`

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### **Option B: Deploy via Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd "E:\AIProjects\karbit-RAG"
   vercel
   ```
   - Follow the prompts
   - Choose default settings

---

## **Step 3: Test Your Deployment**

1. **Visit Your URL**: `https://your-project-name.vercel.app`
2. **Test Chat**: Send a message and verify webhook works
3. **Check Console**: Open browser dev tools for any errors

---

## **Step 4: Custom Domain (Optional)**

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

---

## **Troubleshooting**

### **Common Issues:**

**Build Fails:**
- Check that all files are committed to GitHub
- Verify package.json dependencies are correct

**Webhook Not Working:**
- Ensure your n8n workflow is active
- Check CORS settings on your webhook
- Verify webhook URL is correct in server.js

**404 Errors:**
- Make sure vercel.json is properly configured
- Check that public folder contains all static files

### **Environment Variables:**

If you need to hide sensitive information:

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Click "Environment Variables"
   - Add variables like `WEBHOOK_URL`

2. **Update server.js**:
   ```javascript
   const WEBHOOK_URL = process.env.WEBHOOK_URL || 'fallback-url';
   ```

---

## **Auto-Deploy on Git Push**

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update chat interface"
git push origin main
```

Your changes will be live in 1-2 minutes!

---

## **Expected Result**

✅ **Live URL**: `https://karbit-rag-aayushmishraaa.vercel.app`  
✅ **Automatic HTTPS**: Vercel provides SSL certificates  
✅ **Global CDN**: Fast loading worldwide  
✅ **Auto-deploys**: Updates on every git push  
✅ **Webhook Support**: Full Node.js backend functionality  

---

## **Performance Tips**

- Vercel optimizes static assets automatically
- Your chat interface will load instantly
- Webhook responses are proxied through Vercel's edge network
- Perfect for production use!

🎉 **Your chat interface is now live and ready for users!**