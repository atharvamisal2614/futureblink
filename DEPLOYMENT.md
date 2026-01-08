# 🚀 Deployment Guide: AI Flow Application

Complete step-by-step guide to deploy your AI Flow application to production.

**Backend** → Render  
**Frontend** → Vercel

---

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ **GitHub Account** (for connecting to Render and Vercel)
2. ✅ **MongoDB Atlas Database** with connection string
3. ✅ **OpenRouter API Key** ([Get it here](https://openrouter.ai/))
4. ✅ **Git Repository** with your code pushed to GitHub/GitLab/Bitbucket

---

## 🎯 Deployment Order

> **IMPORTANT:** Deploy the backend FIRST, then the frontend!

1. Backend (Render) → Get the backend URL
2. Frontend (Vercel) → Use backend URL in environment variables

---

## Part 1: Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up using your GitHub account
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** button in the top right
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `futureblink-assessment`

### Step 3: Configure Web Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `ai-flow-backend` (or your preferred name) |
| **Region** | Choose closest to you (e.g., Oregon) |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string from Atlas |
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `FRONTEND_URL` | Leave empty for now (add after Vercel deployment) |
| `NODE_ENV` | `production` |

**Example MongoDB URI format:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Step 5: Deploy Backend
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for initial deployment
3. Monitor the deployment logs for any errors
4. Once deployed, you'll see: **"Your service is live 🎉"**

### Step 6: Get Your Backend URL
1. At the top of your service page, you'll see a URL like:
   ```
   https://ai-flow-backend-xxxx.onrender.com
   ```
2. **COPY THIS URL** - you'll need it for Vercel!

### Step 7: Test Backend
Test your backend health endpoint:
```
https://ai-flow-backend-xxxx.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

✅ **Backend deployment complete!**

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Update Production Environment File
Before deploying, update the production environment file:

1. Open `frontend/.env.production`
2. Replace the placeholder with your **actual Render URL**:
   ```
   VITE_API_URL=https://ai-flow-backend-xxxx.onrender.com/api
   ```
3. Save and commit this change:
   ```bash
   git add frontend/.env.production
   git commit -m "Update production API URL"
   git push
   ```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up using your GitHub account
3. Authorize Vercel to access your repositories

### Step 3: Import Project
1. Click **"Add New..." → "Project"**
2. Select **"Import Git Repository"**
3. Find and import `futureblink-assessment`

### Step 4: Configure Project

| Field | Value |
|-------|-------|
| **Framework Preset** | `Vite` (should auto-detect) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 5: Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://ai-flow-backend-xxxx.onrender.com/api` |

**Note:** Replace `xxxx` with your actual Render service name!

Make sure to add this for:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 6: Deploy Frontend
1. Click **"Deploy"**
2. Wait 2-5 minutes for deployment
3. Once complete, you'll get a URL like:
   ```
   https://futureblink-assessment-xxxx.vercel.app
   ```

✅ **Frontend deployment complete!**

---

## Part 3: Final Configuration

### Update Backend FRONTEND_URL

Now that you have your Vercel URL, update the backend:

1. Go back to your Render dashboard
2. Click on your web service (`ai-flow-backend`)
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` variable:
   ```
   https://futureblink-assessment-xxxx.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy your backend

---

## Part 4: Testing Your Deployment

### Test the Complete Flow

1. **Open your Vercel URL** in a browser
2. **Enter a prompt** in the input node (e.g., "What is AI?")
3. **Click "Run Flow"** button
4. **Verify** you get an AI response in the result node
5. **Click "Save"** button
6. **Check MongoDB Atlas** to confirm the interaction was saved

### Expected Results:
- ✅ Frontend loads without errors
- ✅ Prompt can be entered
- ✅ "Run Flow" triggers API call to backend
- ✅ AI response appears in result node
- ✅ "Save" successfully stores data in MongoDB
- ✅ No CORS errors in browser console

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Problem:** "MongoDB connection error"
- **Solution:** Check your `MONGODB_URI` is correct
- Ensure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check Network Access in MongoDB Atlas

**Problem:** "OpenRouter API error"
- **Solution:** Verify your `OPENROUTER_API_KEY` is valid
- Check you have credits/access on OpenRouter

**Problem:** Render service keeps restarting
- **Solution:** Check logs for errors
- Ensure all dependencies are in `package.json`
- Verify `npm start` works locally

#### Frontend Issues

**Problem:** "Failed to fetch" or network errors
- **Solution:** Check `VITE_API_URL` is set correctly in Vercel
- Ensure URL includes `/api` at the end
- Verify backend is running on Render

**Problem:** CORS errors in browser
- **Solution:** Check backend CORS configuration allows your Vercel domain
- Verify `FRONTEND_URL` is set in Render
- Backend code should already handle `*.vercel.app` domains

**Problem:** Blank page or build errors
- **Solution:** Check build logs in Vercel
- Ensure `npm run build` works locally
- Verify all dependencies are installed

#### General Issues

**Problem:** Everything works locally but not in production
- **Solution:** 
  - Use browser DevTools Network tab to see actual errors
  - Check both backend (Render) and frontend (Vercel) logs
  - Ensure environment variables are set correctly on both platforms
  - Verify MongoDB allows external connections

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://...
OPENROUTER_API_KEY=sk-or-v1-...
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔄 Redeployment

### Backend Updates
1. Push changes to GitHub
2. Render automatically redeploys
3. Or manually trigger from Render dashboard

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Or manually trigger from Vercel dashboard

---

## 🎉 Success!

Your AI Flow application is now live! 

- 🌐 **Frontend:** `https://your-app.vercel.app`
- 🔌 **Backend:** `https://your-backend.onrender.com`
- 💾 **Database:** MongoDB Atlas

---

## 💡 Tips for Production

1. **Monitor Usage:** 
   - Render free tier has 750 hours/month
   - Service sleeps after 15 min of inactivity
   - First request after sleep takes ~30 seconds

2. **MongoDB Atlas:**
   - Free tier has 512 MB storage
   - Monitor your storage usage

3. **OpenRouter API:**
   - Monitor your API usage and costs
   - Free model has rate limits

4. **Custom Domain:**
   - Add custom domain in Vercel settings
   - Update `FRONTEND_URL` in Render
   - Update backend CORS if needed

5. **Security:**
   - Never commit `.env` files
   - Rotate API keys regularly
   - Use strong MongoDB passwords

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **OpenRouter:** https://openrouter.ai/docs

---

**Good luck with your deployment! 🚀**
