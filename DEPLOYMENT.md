# Deployment Guide

This guide explains how to deploy the UniTok website with:
- **Frontend** (static files) on Netlify
- **Backend** (Node.js API) on Render

---

## Prerequisites

- GitHub account (to connect with Render)
- Netlify account
- Your code pushed to a GitHub repository

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `unitok_website` repository

### Step 3: Configure Build Settings
Fill in the following:

**Name:** `unitok-backend` (or any name you prefer)

**Region:** Choose closest to your users

**Branch:** `main` (or your default branch)

**Root Directory:** Leave empty (or `.` if needed)

**Runtime:** `Node`

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node src/index.js
```

### Step 4: Set Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables (copy from your `.env` file):

| Key | Value | Example |
|-----|-------|---------|
| `PORT` | `3000` | 3000 |
| `BASE_URL` | Your Render URL | `https://unitok-backend.onrender.com` |
| `FRONTEND_URL` | Your Netlify URL | `https://unitokapp.netlify.app` |
| `SMTP_HOST` | `smtp.gmail.com` | smtp.gmail.com |
| `SMTP_PORT` | `587` | 587 |
| `SMTP_SECURE` | `false` | false |
| `SMTP_USER` | Your email | otp@unitokapp.com |
| `SMTP_PASS` | Your app password | ctrm hdrb head ytzn |
| `FROM_EMAIL` | Your email | otp@unitokapp.com |
| `FROM_NAME` | `UniTok Support` | UniTok Support |
| `SUPPORT_EMAIL` | Support email | otp@unitokapp.com |
| `TOKEN_EXPIRY_HOURS` | `24` | 24 |

**Important Notes:**
- `BASE_URL` should be your Render URL (e.g., `https://unitok-backend.onrender.com`)
- `FRONTEND_URL` should be your Netlify URL (e.g., `https://unitokapp.netlify.app` or `https://home.unitokapp.com`)

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete (3-5 minutes)
3. Copy your backend URL (e.g., `https://unitok-backend.onrender.com`)

### Step 6: Test Backend
Visit: `https://your-backend.onrender.com/`

You should see your landing page or a message indicating the server is running.

---

## Part 2: Update Frontend Configuration

### Step 1: Update API URL in Frontend
1. Open `request-deletion/index.html`
2. Find line ~1429 where it says:
   ```javascript
   const API_URL = isProduction
     ? 'https://your-backend.onrender.com' // Replace with your Render URL
     : 'http://localhost:3000';
   ```
3. Replace `https://your-backend.onrender.com` with your actual Render URL

Example:
```javascript
const API_URL = isProduction
  ? 'https://unitok-backend.onrender.com'
  : 'http://localhost:3000';
```

### Step 2: Commit and Push Changes
```bash
git add .
git commit -m "feat: Configure production backend URL for Render deployment"
git push origin main
```

---

## Part 3: Deploy Frontend to Netlify

### Option A: If Already Deployed on Netlify
1. Push your changes to GitHub
2. Netlify will automatically redeploy
3. Wait 1-2 minutes for deployment

### Option B: First Time Deployment
1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `.` or root
5. Click **"Deploy site"**

### Step 3: Configure Custom Domain (Optional)
If using `unitokapp.com`:
1. Go to **Site settings** → **Domain management**
2. Add custom domain: `home.unitokapp.com` or `www.unitokapp.com`
3. Follow DNS configuration instructions

---

## Part 4: Update Backend Environment Variables

After deploying frontend, update Render environment:

1. Go to your Render dashboard
2. Select your web service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` to your actual Netlify URL:
   - Example: `https://home.unitokapp.com`
   - Or: `https://unitokapp.netlify.app`
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## Part 5: Testing

### Test Locally
```bash
npm start
# Visit http://localhost:3000/request-deletion
# Submit a deletion request
```

### Test Production
1. Visit your Netlify URL: `https://home.unitokapp.com/request-deletion`
2. Fill out and submit the deletion request form
3. Check:
   - ✅ No network errors
   - ✅ Success message appears
   - ✅ Email is received
   - ✅ Confirmation link works

### Check Render Logs
1. Go to Render dashboard
2. Click on your service
3. View **"Logs"** tab
4. You should see:
   ```
   Deletion request created for test@example.com
   Confirmation email sent to test@example.com
   ```

---

## Troubleshooting

### Issue: CORS Error
**Symptom:** "Access to fetch has been blocked by CORS policy"

**Solution:**
1. Make sure `FRONTEND_URL` in Render matches your Netlify URL exactly
2. Include protocol (`https://`) and don't add trailing slash
3. Redeploy Render service

### Issue: Network Error on Form Submit
**Symptom:** "Network error. Please check your connection"

**Causes:**
1. Backend not deployed/running on Render
2. Wrong API URL in `request-deletion/index.html`
3. Render service sleeping (free tier sleeps after inactivity)

**Solution:**
1. Check Render logs to ensure service is running
2. Verify API URL in frontend code
3. Visit backend URL to wake it up if on free tier

### Issue: Email Not Sending
**Symptom:** Form submits but no email received

**Solution:**
1. Check Render logs for email errors
2. Verify SMTP credentials in Render environment variables
3. Make sure Gmail App Password is correct
4. Check spam folder

### Issue: 404 on Confirmation Link
**Symptom:** Clicking email link shows "Page not found"

**Solution:**
1. Ensure `BASE_URL` in Render points to backend URL (not frontend)
2. Example: `https://unitok-backend.onrender.com`

---

## Architecture Overview

```
User Browser
    ↓
[Netlify - Frontend]
    ↓ (HTTPS POST request)
[Render - Backend API]
    ↓
[Gmail SMTP Server]
    ↓
User's Email Inbox
```

**Frontend (Netlify):**
- Serves: `index.html`, `pp.html`, `request-deletion/index.html`
- Static files only
- Makes API calls to backend

**Backend (Render):**
- Handles: `/request-deletion` POST endpoint
- Sends emails
- Manages deletion tokens
- Stores request data

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free

**Netlify Free Tier:**
- 100GB bandwidth/month
- Unlimited sites
- Automatic HTTPS

### Security Checklist
- ✅ Never commit `.env` file
- ✅ Use environment variables on Render
- ✅ Keep SMTP credentials secure
- ✅ Use HTTPS in production
- ✅ Restrict CORS to your domain (update `FRONTEND_URL`)

### Monitoring
- Check Render logs regularly for errors
- Monitor email deliverability
- Test deletion flow monthly
- Keep dependencies updated

---

## Cost Estimates

**Current Setup (Free):**
- Netlify: $0/month (free tier)
- Render: $0/month (free tier)
- Total: **$0/month**

**If Scaling Needed:**
- Render Pro: $7/month (no sleep, better performance)
- Netlify Pro: $19/month (higher limits)

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend API URL
3. ✅ Push changes to GitHub
4. ✅ Netlify auto-deploys
5. ✅ Test production deployment
6. ✅ Update DNS if using custom domain

---

## Support

If you encounter issues:
1. Check Render logs first
2. Verify all environment variables
3. Test locally to isolate issue
4. Check browser console for frontend errors

---

## Useful Commands

```bash
# Local development
npm start

# Check environment variables
node -e "require('dotenv').config(); console.log(process.env)"

# Test API endpoint
curl -X POST https://your-backend.onrender.com/request-deletion \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","reason":"other","feedback":"Test"}'
```
