# 🚀 Deployment Guide - UniTok Web with Account Deletion

This guide walks you through deploying the integrated UniTok web application with the account deletion feature.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass locally
- [ ] `.env` file is **NOT** committed to git
- [ ] `data/` directory is **NOT** committed to git
- [ ] `.env.example` is committed (safe template)
- [ ] All code changes are working as expected
- [ ] You have production SMTP credentials ready
- [ ] You know your production server's IP/domain

---

## Step 1: Commit and Push to GitHub

### 1.1 Stage Your Changes

```bash
cd "C:\Users\alk19\Desktop\tst html\delete account - Copy - Copy\webproject\unitok_website"

# Add the new public/ directory and all new files
git add public/

# Add modified files
git add .gitignore README.md package.json package-lock.json src/

# Add new configuration files
git add .env.example
git add data/.gitkeep

# IMPORTANT: Verify .env is NOT staged
git status
# You should NOT see .env or data/*.json in the staged files
```

### 1.2 Commit Your Changes

```bash
git commit -m "$(cat <<'EOF'
feat: Integrate account deletion system with email verification

Major Changes:
- Migrated server from native HTTP to Express.js
- Added account deletion request system with email verification
- Implemented token-based security (24-hour expiration)
- Created modular email configuration system
- Reorganized file structure (public/, data/, src/config/)

New Features:
- POST /request-deletion - Submit deletion requests
- GET /confirm/:token - Email confirmation endpoint
- Automated support team notifications
- Duplicate request prevention
- Expired token cleanup

Dependencies Added:
- nodemailer@^6.9.7 - Email sending
- uuid@^9.0.1 - Token generation
- dotenv@^16.3.1 - Environment variables

Security Enhancements:
- Environment variables for sensitive data
- .env and data/ gitignored
- Token expiration and one-time use
- Email validation and sanitization

Documentation:
- Comprehensive README with setup instructions
- .env.example template for configuration
- Deployment guide and troubleshooting

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 1.3 Push to GitHub

```bash
# Push to your main branch (adjust branch name if needed)
git push origin master

# Or if you're on a different branch:
# git push origin main
```

---

## Step 2: Check Your GitHub Actions Workflow

### 2.1 Locate Your Workflow File

Check if you have a GitHub Actions workflow:

```bash
# Look for workflow files
ls -la .github/workflows/
```

**If you DON'T have a workflow file**, you'll need to create one (see Step 2.2).

**If you DO have a workflow file**, skip to Step 2.3 to verify it's configured correctly.

### 2.2 Create GitHub Actions Workflow (If Needed)

If you don't have a CI/CD workflow, create one:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy UniTok Web

on:
  push:
    branches: [ master, main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/your/unitok_website
          git pull origin master
          npm install --production
          # Create .env if it doesn't exist
          if [ ! -f .env ]; then
            echo "PORT=${{ secrets.PORT }}" > .env
            echo "BASE_URL=${{ secrets.BASE_URL }}" >> .env
            echo "SMTP_HOST=${{ secrets.SMTP_HOST }}" >> .env
            echo "SMTP_PORT=${{ secrets.SMTP_PORT }}" >> .env
            echo "SMTP_SECURE=${{ secrets.SMTP_SECURE }}" >> .env
            echo "SMTP_USER=${{ secrets.SMTP_USER }}" >> .env
            echo "SMTP_PASS=${{ secrets.SMTP_PASS }}" >> .env
            echo "FROM_EMAIL=${{ secrets.FROM_EMAIL }}" >> .env
            echo "FROM_NAME=${{ secrets.FROM_NAME }}" >> .env
            echo "SUPPORT_EMAIL=${{ secrets.SUPPORT_EMAIL }}" >> .env
            echo "TOKEN_EXPIRY_HOURS=24" >> .env
          fi
          # Ensure data directory exists
          mkdir -p data
          # Restart the application
          pm2 restart unitok-web || pm2 start src/index.js --name unitok-web
          pm2 save
```

Then commit and push:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin master
```

### 2.3 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `SERVER_HOST` | Your server IP or domain | `123.45.67.89` |
| `SERVER_USER` | SSH username | `ubuntu` |
| `SSH_PRIVATE_KEY` | Your SSH private key | `-----BEGIN RSA PRIVATE KEY-----...` |
| `PORT` | Server port | `3000` |
| `BASE_URL` | Production URL | `https://unitokapp.com` |
| `SMTP_HOST` | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_SECURE` | Use TLS | `false` |
| `SMTP_USER` | Email address | `otp@unitokapp.com` |
| `SMTP_PASS` | Email password/app password | `your-app-password` |
| `FROM_EMAIL` | Sender email | `otp@unitokapp.com` |
| `FROM_NAME` | Sender name | `UniTok Support` |
| `SUPPORT_EMAIL` | Support email | `otp@unitokapp.com` |

---

## Step 3: Manual Deployment (If No CI/CD)

If you're deploying manually without GitHub Actions:

### 3.1 SSH into Your Production Server

```bash
ssh your-username@your-server-ip
```

### 3.2 Navigate to Your Project Directory

```bash
cd /path/to/your/unitok_website
```

### 3.3 Pull Latest Changes

```bash
git pull origin master
```

### 3.4 Install Dependencies

```bash
npm install --production
```

### 3.5 Create .env File on Server

**IMPORTANT**: You need to manually create the `.env` file on the server since it's gitignored.

```bash
nano .env
```

Add this content (replace with your actual values):

```env
# Server Configuration
PORT=3000
BASE_URL=https://your-production-domain.com

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=otp@unitokapp.com
SMTP_PASS=your-actual-app-password-here

# Email Settings
FROM_EMAIL=otp@unitokapp.com
FROM_NAME=UniTok Support
SUPPORT_EMAIL=otp@unitokapp.com

# Token expiration time in hours
TOKEN_EXPIRY_HOURS=24
```

Save and exit (Ctrl+X, then Y, then Enter).

### 3.6 Ensure Data Directory Exists

```bash
mkdir -p data
chmod 755 data
```

### 3.7 Restart the Application

**Option A: Using PM2 (Recommended)**

```bash
# If PM2 is not installed
npm install -g pm2

# Start or restart the application
pm2 restart unitok-web || pm2 start src/index.js --name unitok-web

# Save PM2 configuration
pm2 save

# Enable auto-restart on server reboot
pm2 startup
# Follow the instructions shown
```

**Option B: Using systemd**

```bash
sudo systemctl restart unitok-web
```

**Option C: Direct Node (Not recommended for production)**

```bash
# Stop any existing process
pkill -f "node src/index.js"

# Start in background
nohup node src/index.js > unitok.log 2>&1 &
```

---

## Step 4: Verify Deployment

### 4.1 Check Server is Running

```bash
# Using PM2
pm2 status

# Check logs
pm2 logs unitok-web --lines 50

# Or check systemd
sudo systemctl status unitok-web
```

### 4.2 Test Endpoints

From your local machine or browser:

```bash
# Test landing page
curl -I https://your-production-domain.com/

# Test privacy policy
curl -I https://your-production-domain.com/pp.html

# Test deletion form
curl -I https://your-production-domain.com/request-deletion

# Test API endpoint
curl -X POST https://your-production-domain.com/request-deletion \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","reason":"other","feedback":"Test"}'
```

### 4.3 Test Email Functionality

1. Go to `https://your-production-domain.com/request-deletion`
2. Submit a deletion request with your email
3. Check your inbox for the confirmation email
4. Click the confirmation link
5. Verify the support team receives a notification email

---

## Step 5: Post-Deployment Verification

### 5.1 Verify Environment Variables

SSH into the server and check:

```bash
cd /path/to/unitok_website

# Verify .env exists and has correct values
cat .env | grep BASE_URL
cat .env | grep SMTP_USER

# Test email configuration
node -e "require('dotenv').config(); const t = require('./src/config/email'); console.log('Email config loaded successfully');"
```

### 5.2 Check File Permissions

```bash
# Ensure data directory is writable
ls -la data/
chmod 755 data/

# Verify .env is readable
ls -la .env
chmod 600 .env  # Only owner can read/write
```

### 5.3 Monitor Logs

```bash
# PM2 logs
pm2 logs unitok-web

# Or check custom log file
tail -f unitok.log

# Or systemd logs
sudo journalctl -u unitok-web -f
```

---

## 🔒 Security Checklist

After deployment, verify:

- [ ] `.env` file exists on server (manually created)
- [ ] `.env` is NOT in git repository
- [ ] `data/` directory exists and is writable
- [ ] `data/` contents are NOT in git repository
- [ ] SMTP credentials are working
- [ ] Emails are being delivered (not in spam)
- [ ] HTTPS is enabled (SSL certificate)
- [ ] Server firewall allows port 3000 (or your chosen port)
- [ ] Reverse proxy (nginx/apache) is configured if needed

---

## 🐛 Troubleshooting

### Issue: Server won't start

```bash
# Check if port is in use
netstat -tulpn | grep 3000

# Check logs for errors
pm2 logs unitok-web --err

# Verify Node.js version
node --version  # Should be v14 or higher
```

### Issue: Emails not sending

```bash
# Test SMTP connection
node -e "
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify((err, success) => {
  if (err) console.error('SMTP Error:', err);
  else console.log('SMTP Ready');
});
"
```

### Issue: 404 errors for pages

```bash
# Verify public directory exists and has files
ls -la public/
ls -la public/request-deletion/

# Check Express static middleware is configured
grep "express.static" src/index.js
```

### Issue: Data not saving

```bash
# Check data directory permissions
ls -la data/
chmod 755 data/

# Check disk space
df -h
```

---

## 📊 Monitoring

### Set up monitoring for:

1. **Application Health**
   ```bash
   pm2 monitor  # PM2 web monitoring
   ```

2. **Email Deliverability**
   - Monitor bounce rates
   - Check spam folder reports
   - Verify SPF/DKIM records

3. **Disk Space**
   ```bash
   # Clean up old deletion requests periodically
   find data/ -name "*.json" -mtime +30 -delete
   ```

4. **Server Resources**
   ```bash
   htop  # Monitor CPU/RAM usage
   ```

---

## 🔄 Future Updates

When you need to deploy updates:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. If using CI/CD: Deployment happens automatically
5. If manual: SSH to server, `git pull`, `npm install`, restart

---

## 📞 Support

If you encounter issues:

1. Check logs: `pm2 logs unitok-web`
2. Verify .env configuration
3. Test email connectivity
4. Check file permissions
5. Review security settings

---

## ✅ Deployment Complete!

Once all steps are complete:
- Your application is running in production
- Account deletion feature is live
- Emails are being sent
- All routes are accessible
- Security measures are in place

**Production URL**: `https://your-domain.com`
**Deletion Page**: `https://your-domain.com/request-deletion`

Good luck with your deployment! 🚀
