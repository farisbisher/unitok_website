# UniTok Web

The UniTok website, made up of two independently deployed parts:

- **Landing page** — an Angular 18 single-page app in `web/`, built and served
  as static files by **Netlify**.
- **Account deletion API** — an Express server in `src/`, deployed to
  **Render**. It handles deletion requests and email verification.

The legacy static pages (`pp.html`, `csae.html`, `request-deletion/`) live at
the repo root and are copied into the Netlify publish directory at build time,
so they keep working at their existing URLs.

Netlify's build and publish settings come from `netlify.toml` in this repo,
which overrides anything configured in the Netlify dashboard.

---

## Features

### Landing Page (Angular, `web/`)
- Arabic-first, responsive design optimized for mobile and desktop
- Routed pages for programs, ambassadors, and UniTok Business
- University partnership showcase and team profiles
- Download links for Android and iOS apps
- GSAP-driven scroll animations

### Account Deletion System
- User-friendly deletion request form
- Email verification with 24-hour expiration
- Automated support team notifications
- Duplicate request prevention
- Token-based security
- Comprehensive error handling

### Privacy Policy
- Searchable, interactive policy document
- Collapsible sections for easy navigation
- Table of contents with smooth scrolling
- Mobile-optimized reading experience

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Gmail Account** (or other SMTP server for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farisbisher/unitok_website.git
   cd unitok_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your configuration
   # See "Configuration" section below for details
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Visit the application**
   ```
   http://localhost:3000
   ```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=3000
BASE_URL=http://localhost:3000

# SMTP Email Configuration
# For Gmail, use App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

# Email Settings
FROM_EMAIL=your-email@gmail.com
FROM_NAME=UniTok Support
SUPPORT_EMAIL=support@unitokapp.com

# Token expiration time in hours
TOKEN_EXPIRY_HOURS=24
```

### Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in your `.env` file as `SMTP_PASS`

**Important:** Never commit your `.env` file to version control!

---

## Project Structure

```
unitok_website/
├── web/                      # Angular landing page (deployed to Netlify)
│   ├── src/app/              # Components, sections, routed pages
│   ├── public/assets/        # Fonts, images, video used by the app
│   ├── angular.json
│   └── package.json
├── src/                      # Express API (deployed to Render)
│   ├── index.js              # Main Express server
│   └── config/
│       └── email.js          # Email transporter configuration
├── pp.html                   # Privacy policy (legacy static page)
├── csae.html                 # CSAE policy (legacy static page)
├── request-deletion/
│   ├── index.html            # Deletion request form
│   └── confirmed.html        # Confirmation success page
├── assets/                   # Legacy media, still served at /assets by the API
├── data/                     # Deletion request storage (gitignored)
├── netlify.toml              # Netlify build + publish + SPA redirect config
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── package.json              # API dependencies and scripts
└── README.md                 # This file
```

---

## Available Routes

These are the routes served by the Express API on Render. The public website
itself is served by Netlify.

### Public Pages
- `GET /` - Redirects to `FRONTEND_URL` (the Netlify site)
- `GET /pp.html` - Privacy policy
- `GET /request-deletion` - Account deletion form
- `GET /assets/*` - Legacy static assets (images, videos, etc.)

### API Endpoints
- `POST /request-deletion` - Submit deletion request
  - Body: `{ email, reason, feedback }`
  - Returns: `{ success, message }` or `{ error }`

- `GET /confirm/:token` - Confirm deletion via email link
  - Returns: Confirmation page or error page

---

## npm Scripts

```bash
# Start the server in production mode
npm start

# Start with hot-reload during development
npm run dev

# Run tests (not yet implemented)
npm test
```

---

## Development

### Adding New Features

1. **Landing page changes:** work in `web/` (`cd web && npm install && npm start`)
2. **New API Routes:** Add routes in `src/index.js` following the existing pattern
3. **Email Templates:** Modify email HTML in route handlers
4. **Landing page assets:** Place in `web/public/assets/`

### Code Quality Standards

- Use JSDoc comments for all functions
- Follow existing code style and structure
- Add error handling for all async operations
- Log important events to console
- Validate user input on both client and server

### Testing Locally

1. **Test Landing Page:**
   ```bash
   curl http://localhost:3000
   ```

2. **Test Deletion Request:**
   ```bash
   curl -X POST http://localhost:3000/request-deletion \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","reason":"other","feedback":"Testing"}'
   ```

3. **Check Logs:**
   - Monitor console for request logs
   - Check `data/` directory for saved requests
   - Verify emails arrive in inbox

---

## Deployment

### Production Checklist

- [ ] Update `BASE_URL` in `.env` to production domain
- [ ] Ensure `PORT` matches server configuration
- [ ] Verify SMTP credentials work from production server
- [ ] Test email delivery from production IP
- [ ] Ensure `data/` directory has write permissions
- [ ] Verify `.env` is not committed to repository
- [ ] Set up process manager (PM2, systemd, etc.)
- [ ] Configure reverse proxy (nginx/apache) if needed
- [ ] Enable HTTPS with SSL certificate
- [ ] Set up monitoring and logging

### Deploying to Production

1. **SSH into production server**
   ```bash
   ssh user@your-server.com
   ```

2. **Navigate to project directory**
   ```bash
   cd /path/to/unitok_website
   ```

3. **Pull latest changes**
   ```bash
   git pull origin master
   ```

4. **Install dependencies**
   ```bash
   npm install --production
   ```

5. **Update environment variables**
   ```bash
   nano .env
   # Update BASE_URL, SMTP settings, etc.
   ```

6. **Restart server**
   ```bash
   # Using PM2
   pm2 restart unitok-web

   # Or using systemd
   sudo systemctl restart unitok-web
   ```

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start src/index.js --name unitok-web

# Enable auto-restart on reboot
pm2 startup
pm2 save

# Monitor logs
pm2 logs unitok-web

# Restart after code changes
pm2 restart unitok-web
```

---

## Security Considerations

### Sensitive Data Protection
- **Never commit `.env` file** - Contains SMTP credentials
- **Never commit `data/` directory** - Contains user deletion requests
- `.gitignore` is configured to protect these files

### Email Security
- Use Gmail App Passwords (not your main password)
- Rotate SMTP credentials periodically
- Monitor for unauthorized email usage

### Data Retention
- Deletion requests are stored in `data/` as JSON files
- Confirmed requests should be processed within 30 days
- Consider implementing automated cleanup of old requests

### Token Security
- Tokens expire after 24 hours (configurable)
- Tokens are UUIDs (impossible to predict)
- One-time use only (cannot confirm twice)

---

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Kill the process using the port
taskkill /PID <process-id> /F

# Or use a different port in .env
PORT=3001
```

### Emails not sending
```bash
# Check SMTP configuration
node -e "require('dotenv').config(); console.log(process.env.SMTP_USER)"

# Verify email transporter
# Check console logs for "Email server ready" message
```

### Assets not loading
- Ensure assets are in the `assets/` directory
- Check file paths are correct (case-sensitive on Linux)
- Verify Express static middleware is configured

### Data directory permissions
```bash
# On Linux/Mac, ensure write permissions
chmod 755 data/

# Check if directory exists
ls -la data/
```

---

## Maintenance

### Regular Tasks

1. **Clean up expired requests**
   ```bash
   # Remove JSON files older than 30 days from data/
   find data/ -name "*.json" -mtime +30 -delete
   ```

2. **Monitor disk space**
   ```bash
   du -sh data/
   ```

3. **Check email deliverability**
   - Monitor bounce rates
   - Verify SPF/DKIM records
   - Check spam folder reports

4. **Update dependencies**
   ```bash
   npm audit
   npm update
   ```

---

## Support

For issues or questions:
- **Email:** otp@unitokapp.com
- **GitHub:** https://github.com/farisbisher/unitok_website

---

## License

ISC License - Copyright (c) 2025 UniTok Team

---

## Changelog

### Version 3.0.0
- ✨ Replaced the static landing page with the Angular 18 app in `web/`
- 📦 Added `netlify.toml` so Netlify builds the Angular app and keeps the
  legacy pages reachable
- 🔀 `GET /` on the API now redirects to `FRONTEND_URL` instead of serving a
  local `index.html`
- 🗑️ Removed the superseded root `index.html` and an empty `server.js`

### Version 2.0.0 (2025-11-30)
- ✨ Added account deletion request system
- ✨ Integrated email verification flow
- ✨ Migrated from native http to Express.js
- 📦 Added dependencies: nodemailer, uuid, dotenv
- 📁 Reorganized file structure (public/, data/, src/config/)
- 🔒 Enhanced security with environment variables
- 📝 Comprehensive documentation and error handling

### Version 1.0.0 (2025-11-12)
- 🎉 Initial release
- 🌐 Landing page with team and partner showcase
- 📄 Privacy policy page
- 🖼️ Static asset serving
