# Deploying Fusion Starter to cPanel

## Quick Start (5 minutes)

### Prerequisites
- cPanel account with File Manager access
- Domain pointing to your server's nameservers
- Node.js support (optional - see options below)

---

## Option 1: Static Build (Works on ANY cPanel)

This deploys only the frontend. Admin panel works locally (localStorage). API routes won't function.

### Step 1: Build Locally

```bash
cd AsifDeveloper2025-main
pnpm install --no-frozen-lockfile

# If using Supabase features, create .env:
cat > .env << 'EOF'
VITE_ADMIN_PASSWORD=admin123
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF

# Build client only (static HTML/CSS/JS)
npx pnpm run build:client
```

**Output:** `dist/spa/` folder

### Step 2: Upload via cPanel File Manager

1. Log into cPanel → **File Manager**
2. Navigate to `public_html`
3. **Optional:** Delete old files (backup first!)
4. Click **Upload** → select all files from `dist/spa/`
   - `index.html`
   - `assets/` folder
5. Wait for upload to complete

### Step 3: Configure SPA Routing

Create/update `.htaccess` in `public_html/`:

```apache
RewriteEngine On

# SPA fallback - all non-file requests go to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# Optional: Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json
</IfModule>

# Optional: Browser caching for assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresDefault "access plus 2 days"
</IfModule>
```

### Step 4: Test Deployment

- Visit: `https://yourdomain.com`
- Test navigation (Home, Projects, Contact)
- Login to admin: Visit `https://yourdomain.com/login` → Password: `admin123`
- Admin panel should load (Services, Projects, etc.)

**Note:** Image upload in admin panel will store as blob URLs (temporary). API routes return mock data.

---

## Option 2: Full-Stack (Node.js) – Requires cPanel Node.js Support

Use this if your cPanel has **"Setup Node.js App"** icon.

### Step 1: Build Locally

```bash
# Ensure .env is configured
cat > .env << 'EOF'
VITE_ADMIN_PASSWORD=admin123
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
NODE_ENV=production
PORT=3000
EOF

# Full build (client + server)
npx pnpm run build
```

**Output:**
- `dist/spa/` (static frontend)
- `dist/server/node-build.mjs` (Express server)

### Step 2: Create Folder Structure in cPanel

Via SSH or File Manager:

```
/home/username/
├── app/                    # Application root (outside public_html!)
│   ├── dist/
│   │   ├── server/
│   │   │   └── node-build.mjs
│   │   └── spa/
│   │       ├── index.html
│   │       └── assets/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── server/
│   ├── shared/
│   ├── client/
│   └── .env
└── public_html/            # Web root (static files symlinked from app/)
    ├── index.html         # Symlink to ../app/dist/spa/index.html
    └── assets/            # Symlink to ../app/dist/spa/assets/
```

**Easiest via cPanel File Manager:**
1. Create folder `/home/username/app`
2. Upload `dist/spa/` contents → `/home/username/app/dist/spa/`
3. Upload `dist/server/node-build.mjs` → `/home/username/app/dist/server/`
4. Upload `package.json`, `pnpm-lock.yaml` → `/home/username/app/`
5. Upload `server/`, `shared/` folders → `/home/username/app/`
6. Upload `.env` → `/home/username/app/`

### Step 3: Set Up Node.js Application

1. In cPanel → **Setup Node.js App**
2. Click **Create Application**
3. Configuration:
   - **Application mode:** Production
   - **Application root:** `/home/username/app`
   - **Application URL:** `/` (root) OR `/api` (if you want static HTML from Apache, API from Node)
   - **Application entry point:** `dist/server/node-build.mjs`
   - **Environment variables:**
     ```
     NODE_ENV=production
     PORT=3000
     VITE_ADMIN_PASSWORD=admin123
     ```
4. Click **Create**

cPanel will:
- Install dependencies from `pnpm-lock.yaml` (or `package.json`)
- Build if build command is set (optional – you already built)
- Start the application on port 3000+


**Important:** cPanel Node.js runs on a separate port (e.g., 3000, 3001). Configure Apache to proxy requests.

### Step 4: Configure .htaccess for Express Proxy

In `public_html/.htaccess`:

```apache
RewriteEngine On

# Proxy API requests to Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Also proxy other non-static requests to Express for SSA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**If Node.js app is at `/api` subdirectory:**

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
RewriteRule ^(.*)$ /index.html [L]
```

### Step 5: Deploy Static Files

Copy frontend build to `public_html`:

```bash
# Via SSH (if available):
cp -r /home/username/app/dist/spa/* /home/username/public_html/

# Or via File Manager: upload contents of dist/spa/ to public_html/
```

Create `.htaccess` in `public_html/`:

```apache
# SPA routing fallback
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### Step 6: Restart Node.js Application

In cPanel → **Setup Node.js App**:
- Click "Restart Application" button
- Wait 10 seconds

### Step 7: Verify Deployment

1. **Test frontend:** `https://yourdomain.com`
   - Should load React app

2. **Test API:** `https://yourdomain.com/api/ping`
   - Should return: `{"message":"ping"}` or custom PING_MESSAGE

3. **Test admin panel:** `https://yourdomain.com/login`
   - Password: `admin123`
   - Should redirect to `/admin`

4. **Check Node.js logs** if errors:
   - cPanel → Metrics → Errors
   - Or SSH: `cat ~/app/stderr.log`

---

## Troubleshooting cPanel Deployment

### A. "Application Error" after Node.js deploy

**Check logs:**
```bash
cat ~/app/stderr.log
```

**Common fixes:**
- Entry point wrong → Set to `dist/server/node-build.mjs` not `server.js`
- Missing dependencies → SSH into account → run `pnpm install` in `/home/username/app/`
- Wrong PORT env var → Must be set (cPanel passes PORT automatically)
- Build artifacts missing → Get `dist/` folder from local build

### B. 404 Not Found for React Routes (Home works, /about doesn't)

**Fix:** `.htaccess` missing or incorrect.

`public_html/.htaccess` must have:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### C. API routes return 404

**Check:**
1. Node.js app is running: cPanel → Node.js App → Status
2. Proxy rule in `.htaccess` points to correct port:
   - RewriteRule `http://localhost:3000` → matches actual PORT from cPanel
   - Check cPanel Node.js app → "Application Port" field
3. API routes defined in `server/index.ts`:
   - `/api/ping`
   - `/api/demo`
   - `/api/generate-testimonial`

### D. CSS/JS not loading (404 assets)

**Cause:** `index.html` references wrong `assets/` path.

**Fix A:** Ensure `index.html` from `dist/spa/` was uploaded to `public_html/`

**Fix B:** Check base path in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/',  // Should be '/' not './'
  // ...
})
```

**Fix C:** Clear browser cache + hard refresh (Ctrl+Shift+R)

### E. Admin login fails ("Invalid password")

**Check:**
1. `VITE_ADMIN_PASSWORD` set correctly in cPanel:
   - Node.js app: Environment variables section
   - Static build: Password baked into build at build time

2. Clear localStorage:
   ```javascript
   // In browser console:
   localStorage.clear(); location.reload();
   ```

3. Try again at `/login` with password `admin123` (or your custom)

### F. Image upload fails in admin panel

**Cause:** Supabase not configured or file too large.

**Static build:** Images fallback to blob URLs (temporary). That's expected.

**Full Node.js:**
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in cPanel
- Ensure upload limits: `upload_max_filesize = 64M` in PHP (even though Node.js, cPanel's PHP limits sometimes affect)
- Max file size in Node.js: adjust if needed in code

### G. SSL/HTTPS mixed content warnings

**Fix:** Ensure `.htaccess` forces HTTPS **before** proxy rules:

```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [L,R=301]

# Then proxy to Node
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### H. Port 3000 already in use (cPanel Node.js)

**Fix:**
- Stop the first app: In cPanel Node.js App, click "Stop"
- Change port for second app: Set PORT=3001 in env vars
- Update `.htaccess` proxy target: `http://localhost:3001`

---

## Post-Deployment Checklist

**Immediate:**
- [ ] SSL installed (AutoSSL ran, HTTPS working)
- [ ] All pages load (Home, Projects, Contact, Admin)
- [ ] Admin panel login: `/login` → `admin123` → redirected to `/admin`
- [ ] API responds: `https://yourdomain.com/api/ping`
- [ ] Mobile responsive check
- [ ] Browser console no errors (except optional warnings)

**One week later:**
- [ ] Check Exim logs for spam issues
- [ ] Monitor disk space
- [ ] Review error logs from WHM
- [ ] Set up regular backups verified

**One month later:**
- [ ] Update cPanel
- [ ] Review security logs
- [ ] Test backup restore
- [ ] Check ModSecurity false positives and adjust

---

## Useful Commands (if you have SSH access)

```bash
# Check Node.js app status
cd /home/username/app
ls -la dist/server/

# View Node.js logs
cat ~/nodejsapp/stderr.log
cat ~/nodejsapp/stdout.log

# Restart Node.js app
cd /home/username/app
pm2 restart ecosystem.config.js  # if using PM2
# Or use cPanel interface

# Tail Apache error log for domain
tail -f /usr/local/apache/logs/yourdomain.com-error_log

# Fix permissions
chown -R username:username /home/username/app
chmod -R 755 /home/username/app
find /home/username/public_html -type f -exec chmod 644 {} \;
```

---

## Support

- cPanel Documentation: https://docs.cpanel.net/
- WHM Docs: https://docs.cpanel.net/whm/
- Your host's support: Open ticket for server-level issues

**Deployment complete!** Your React/Express app is live on cPanel.
