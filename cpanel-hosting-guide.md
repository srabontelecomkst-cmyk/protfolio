# cPanel/WHM Server Setup & Optimization Guide

## Table of Contents
1. [Initial Server Setup](#1-initial-server-setup)
2. [LAMP/LEMP Stack Installation](#2-lamplem-stack-installation)
3. [cPanel/WHM Installation](#3-cpanelwhm-installation)
4. [Server Hardening](#4-server-hardening)
5. [SSL Implementation with AutoSSL](#5-ssl-implementation-with-autossl)
6. [DNS Configuration](#6-dns-configuration)
7. [Email Server Optimization](#7-email-server-optimization)
8. [Security: CSF & Imunify360](#8-security-csf--imunify360)
9. [ModSecurity & Firewall](#9-modsecurity--firewall)
10. [Troubleshooting](#10-troubleshooting)
11. [Deploying Your React/Node.js App to cPanel](#11-deploying-your-reactnodejs-app-to-cpanel)

---

## 1. Initial Server Setup

### 1.1 System Requirements (CentOS 9 Stream / AlmaLinux 9)
```bash
# Minimum requirements
CPU: 2+ cores (4+ recommended)
RAM: 4 GB minimum (8 GB+ recommended)
Disk: 40 GB minimum (SSD recommended)

# Update system
dnf update -y
dnf upgrade -y
reboot

# Set hostname
hostnamectl set-hostname server.yourdomain.com
```

### 1.2 Create cPanel System User
```bash
# Add a cPanel admin user (if not created during install)
adduser cpadmin
passwd cpadmin
usermod -aG wheel cpadmin
```

### 1.3 Firewall Pre-Configuration
```bash
# Only allow required ports initially
firewall-cmd --permanent --remove-service=ssh
firewall-cmd --permanent --add-port=22/tcp
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## 2. LAMP/LEMP Stack Installation

### 2.1 Option A: LAMP (Apache + MariaDB + PHP)

**Apache Configuration:**
```bash
# Install Apache
dnf install httpd -y
systemctl enable httpd
systemctl start httpd

# Optimize Apache for cPanel
echo "ServerTokens Prod
ServerSignature Off
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5
Timeout 300" > /etc/httpd/conf.d/optimization.conf
```

**MariaDB Installation:**
```bash
dnf install mariadb-server -y
systemctl enable mariadb
systemctl start mariadb

# Secure MariaDB installation
mysql_secure_installation

# root password, remove anonymous users, disallow root login remotely, remove test DB
```

**PHP Installation (cPanel manages this, but manual stacks need):**
```bash
# For manual LAMP without cPanel
dnf install php php-cli php-common php-mysqlnd php-gd php-mbstring php-xml php-json php-bcmath php-zip -y

# Recommended PHP version for modern apps: 8.1+
```

### 2.2 Option B: LEMP (Nginx + MariaDB + PHP-FPM)

**Nginx Configuration:**
```bash
dnf install nginx -y
systemctl enable nginx
systemctl start nginx

# Create Nginx optimization config
cat > /etc/nginx/conf.d/optimization.conf << 'EOF'
# Worker processes
worker_processes auto;
worker_rlimit_nofile 100000;

# Events
events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

# HTTP
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # PHP-FPM
    include /etc/nginx/fastcgi.conf;
}
EOF
```

**PHP-FPM Configuration:**
```bash
# Install PHP-FPM
dnf install php-fpm php-mysqlnd -y
systemctl enable php-fpm
systemctl start php-fpm

# Optimize PHP-FPM
sed -i 's/pm = dynamic/pm = ondemand/' /etc/php-fpm.d/www.conf
sed -i 's/pm.max_children = 50/pm.max_children = 150/' /etc/php-fpm.d/www.conf
sed -i 's/pm.start_servers = 5/pm.start_servers = 10/' /etc/php-fpm.d/www.conf
sed -i 's/pm.min_spare_servers = 5/pm.min_spare_servers = 5/' /etc/php-fpm.d/www.conf
sed -i 's/pm.max_spare_servers = 35/pm.max_spare_servers = 30/' /etc/php-fpm.d/www.conf
```

---

## 3. cPanel/WHM Installation

### 3.1 Pre-Installation Checks
```bash
# Verify hostname is FQDN
hostname -f
# Should output: server.yourdomain.com

# Check DNS resolution
nslookup server.yourdomain.com

# Ensure /etc/hosts has proper entry
cat /etc/hosts
# Should include: 127.0.0.1 localhost server.yourdomain.com server

# Disable SELinux (optional, but recommended for cPanel)
setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config

# Disable firewalld if using CSF
systemctl stop firewalld
systemctl disable firewalld
```

### 3.2 Install cPanel/WHM
```bash
# Download installer
cd /home
curl -o latest -L https://securedownloads.cpanel.net/latest
sh latest

# Installation takes 1-2 hours
# Monitor progress: tail -f /var/log/cpanel/install.log
```

### 3.3 Post-Installation Configuration
```bash
# Restart services
/scripts/restartsrv_httpd
/scripts/restartsrv_mysqld
/scripts/restartsrv_named

# Access WHM
# HTTPS: https://your-server-ip:2087
# Username: root
# Password: your root password
```

---

## 4. Server Hardening

### 4.1 SSH Hardening
```bash
# Edit SSH config
vi /etc/ssh/sshd_config

# Change these values:
Port 4242                     # Change from 22
PermitRootLogin no            # Disable root login
PasswordAuthentication no     # Disable password auth (use keys)
PermitEmptyPasswords no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowUsers cpadmin            # Allow only specific users

# Restart SSH
systemctl restart sshd
```

**Generate SSH Keys for Users:**
```bash
# On client machine
ssh-keygen -t ed25519 -C "admin@yourdomain.com"

# Copy public key to server
ssh-copy-id -p 4242 cpadmin@server.yourdomain.com
```

### 4.2 FTP Security (Disable plain FTP)
```bash
# In WHM → Service Configuration → FTP Server Settings
# Disable anonymous FTP
# Set Maximum number of connections: 5
# Set Maximum number of connections per IP: 2
```

### 4.3 PHP Optimization
```bash
# WHM → MultiPHP INI Editor
# Global settings:

max_execution_time = 30
max_input_time = 60
memory_limit = 256M
post_max_size = 64M
upload_max_filesize = 64M
max_file_uploads = 20
session.gc_maxlifetime = 1440

# Disable dangerous functions:
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source
```

---

## 5. SSL Implementation with AutoSSL

### 5.1 Enable AutoSSL in WHM
```bash
# WHM → SSL/TLS → AutoSSL

# 1. Install AutoSSL Provider:
# - Select "Let's Encrypt" (recommended)
# - Or cPanel's built-in AutoSSL

# 2. Enable AutoSSL:
# Check: "Enable AutoSSL globally"

# 3. Provider Settings (Let's Encrypt):
# Accept the terms
# Set Rate Limit: 5 requests per hour per domain

# 4. Options:
# ☑ Include all domains
# ☑ Disable certificate validation for self-signed
# ☑ Reinstall certificates that expire within X days

# 5. Save
```

### 5.2 Force HTTPS Redirect (cPanel UI)
```bash
# WHM → Service Configuration → Apache Configuration → Include Editor
# Pre VirtualHost Include: All Versions → All Versions

# Add:
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Rebuild configuration
/scripts/rebuildhttpdconf
systemctl restart httpd
```

### 5.3 Force HTTPS for Specific Domains (User Level)
```bash
# In cPanel → Select Domain → Force HTTPS Redirect
# Or use .htaccess in public_html:
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## 6. DNS Configuration

### 6.1 Nameserver Setup
```bash
# WHM → Server Configuration → Basic WebHost Manager Setup
# Nameserver 1: ns1.yourdomain.com (IP: your-server-ip)
# Nameserver 2: ns2.yourdomain.com (IP: your-server-ip)
# Nameserver 3: ns3.yourdomain.com (optional)

# Register nameservers at your domain registrar:
# A records:
ns1.yourdomain.com → server-ip
ns2.yourdomain.com → server-ip

# Then in WHM → IP Functions → Change Site's IP (if needed)
```

### 6.2 DNS Zone Templates
```bash
# WHM → DNS Functions → DNS Cluster
# Enable DNS clustering for redundancy

# WHM → Server Configuration → Tweak Settings → DNS
# Enable DNS clustering: Yes
# Reverse DNS: Enable (set reverse DNS for IP at hosting provider)
```

### 6.3 Common DNS Records
```bash
# Zone file example for domain.com:
@   IN  A   192.168.1.1          # Main domain
@   IN  AAAA    ::1              # IPv6 (optional)
@   IN  MX  10 mail.domain.com. # Mail server
mail IN  A   192.168.1.1          # Mail subdomain
www IN  A   192.168.1.1          # WWW subdomain
webmail IN A 192.168.1.1         # Webmail
ftp IN  A   192.168.1.1          # FTP
```

---

## 7. Email Server Optimization

### 7.1 Configure Exim (cPanel's MTA)
```bash
# WHM → Service Configuration → Exim Configuration Manager

# 1. Basic Configuration:
# - Set "SMTP Restrictions": Enable
# - Set "Require HELO": Yes
# - Set "Require Reverse DNS": Yes

# 2. Access Control:
# - Enable RBL rejection (SORBS, Spamhaus, etc.)
# - Enable SPF/DKIM/DMARC

# 3. Mail Scanning:
# - Enable ClamAV scanning
# - Enable Enable mail server content filtering (optional)
```

### 7.2 Enable SPF, DKIM, DMARC
```bash
# WHM → Email → Authentication
# Enable SPF, DKIM, DMARC globally

# WHM → Email → DMARC
# Set Policy: quarantine (or reject for stricter)
# Set Domain Alignment: relaxed
```

### 7.3 Prevent Spam (RBLs & Blocklists)
```bash
# WHM → Service Configuration → Exim Configuration Manager → RBLs

# Add these RBLs:
- zen.spamhaus.org
- bl.spamcop.net
- dnsbl.sorbs.net
- b.barracudacentral.org

# Reject messages from these RBLs
```

### 7.4 Limit Outgoing Email
```bash
# WHM → Tweak Settings → Mail
# Maximum hourly emails per domain: 500
# Maximum hourly emails per account: 100
# Maximum percentage of failed outgoing mail before disabling account: 20%

# Create Mail Rate Limits (WHM → Email → Mail Delivery Reports → Mail Limits)
```

### 7.5 Test Email
```bash
# Via SSH:
echo "Subject: Test" | sendmail -v yourtest@example.com

# Or use cPanel's Mail Delivery Reports:
# WHM → Email → Mail Delivery Reports → Search by domain/user
```

---

## 8. Security: CSF & Imunify360

### 8.1 Install ConfigServer Security & Firewall (CSF)
```bash
cd /usr/src
rm -fv csf.tgz
wget https://download.configserver.com/csf.tgz
tar -xzf csf.tgz
cd csf
sh install.sh

# Configure CSF
vi /etc/csf/csf.conf

# Critical settings:
TESTING = 0
TCP_IN = "20,21,22,25,53,80,110,143,443,465,587,993,995,2077,2078,2082,2083,2086,2087,2095,2096"
TCP_OUT = "20,21,22,25,53,80,110,113,443,465,587,993,995"
UDP_IN = "20,21,53"
UDP_OUT = "20,21,53,113,123"

# Rate limits:
CT_LIMIT = "300"           # Connection tracking limit
CT_PERMANENT = "0"
CT_BLOCK_TIME = "600"      # 10 min block
LF_DAEMON = "1"

# Login protection:
LF_SSHD = "1"
LF_FTPD = "1"
LF_IMAPD = "1"
LF_POP3D = "1"
LF_SMTPAUTH = "1"

# Email alerts:
LF_ALERT_TO = "admin@yourdomain.com"

# Restart CSF
csf -r
```

### 8.2 CSF Port Configuration for cPanel
```bash
# cPanel required ports:
20,21 (FTP)
22 (SSH)
25,465,587 (SMTP)
110,995 (POP3)
143,993 (IMAP)
53 (DNS)
443 (HTTPS)
80 (HTTP)
2082,2083 (cPanel)
2086,2087 (WHM)
2095,2096 (Webmail)

# Add custom ports if needed:
# /etc/csf/csf.conf → TCP_IN/TCP_OUT
```

### 8.3 Install Imunify360 (Optional - Advanced)
```bash
# Purchase license from CloudLinux
# Download and install:
wget https://download.imunify360-cloudlinux.com/install.sh
bash install.sh

# Configure Imunify360 via WHM → Imunify360
# - Enable Malware Scanner
# - Enable Firewall (can replace CSF)
# - Enable IDS/IPS
# - Set-up automatic malware removal
# - Configure file upload restrictions
```

---

## 9. ModSecurity & Web Application Firewall

### 9.1 Install ModSecurity with cPanel
```bash
# WHM → Security Center → ModSecurity™ Vendors
# Select: Comodo ModSecurity Rules (free)
# Click "Install"

# After install:
# WHM → Security Center → ModSecurity™ Configuration
# Enable ModSecurity: Yes
# Default Action: Detect and log only (initially for testing)
# Enable audit log: Yes
```

### 9.2 Configure ModSecurity for cPanel
```bash
# WHM → Security Center → ModSecurity™Configuration
# - Request body limit: 131072 (128KB)
# - Request body limit action: Reject
# - Response body limit: 524288 (512KB)
# - Connect timeouts: 60/30
# - Debug log level: 0 (production)

# Create custom rules (WHM → Security Center → ModSecurity™ → Rules Management)
# Or drop .conf files in /etc/apache2/conf.d/modsec2.user.conf
```

### 9.3 Fine-Tuned ModSecurity Rules (Save as /etc/apache2/conf.d/modsec-custom.conf)
```apache
<IfModule security2_module>
    # General settings
    SecRuleEngine On

    # Don't log static assets
    SecRule REQUEST_URI "@endsWith .css .js .png .jpg .jpeg .gif .ico .svg .woff .woff2 .ttf .eot" "id:1000000,phase:1,pass,nolog,ctl:ruleEngine=Off"

    # Increase request body limit for file uploads
    SecRequestBodyNoFilesLimit 2097152
    SecRequestBodyLimit 134217728
    SecRequestBodyInMemoryLimit 2097152

    # Allow larger URI (needed for some React Router routes)
    SecRequestBodyAccess On
    SecResponseBodyAccess On

    # Custom rules for better UX
    # Don't block WordPress admin-ajax (if using)
    # SecRule REQUEST_URI "@beginsWith /wp-admin/admin-ajax.php" "id:1000001,phase:2,pass,nolog,ctl:ruleEngine=Off"
</IfModule>
```

---

## 10. Troubleshooting Common cPanel Errors

### 10.1 cPanel License Issues
```bash
# Check license:
/usr/local/cpanel/cpkeyclt

# If invalid:
/usr/local/cpanel/scripts/update_license

# Contact cPanel support if persistent
```

### 10.2 Apache Won't Start
```bash
# Check syntax:
httpd -t

# Check error logs:
tail -50 /usr/local/apache/logs/error_log
tail -50 /usr/local/apache/logs/access_log

# Common issues:
# - Port 80/443 already in use: netstat -tlnp | grep :80
# - Wrong Index Manager in .htaccess
# - suPHP configuration errors: /usr/local/apache/conf/suphp.conf
```

### 10.3 DNS Issues
```bash
# Check named status:
systemctl status named

# Check DNS zone:
/scripts/rebuilddnszone domain.com

# Check nameservers:
/scripts/checkdns

# Restart DNS:
/scripts/restartsrv_named
```

### 10.4 Email Not Sending/Receiving
```bash
# Check Exim queue:
exim -bpc
exim -Mvl <message-id>

# Clear stuck queue:
exim -Mrm <message-id>

# Check mail logs:
tail -f /var/log/exim_mainlog

# Verify MX records:
dig MX domain.com

# Test SMTP:
telnet localhost 25
```

### 10.5 PHP Errors
```bash
# Switch PHP version for domain:
/usr/local/cpanel/bin/php_wrapper -d domain.com

# Check PHP error log:
tail -f /usr/local/apache/logs/domain.com-error_log

# Fix permissions:
chown -R user:group /home/user/public_html
find /home/user/public_html -type d -exec chmod 755 {} \;
find /home/user/public_html -type f -exec chmod 644 {} \;
```

### 10.6 403 Forbidden Errors
```bash
# Check file permissions:
ls -la /home/user/public_html
# Should be: 755 for dirs, 644 for files

# Check .htaccess:
# Comment out lines to isolate issue

# Fix ownership:
chown -R user:user /home/user/public_html

# Apache config test:
apachectl configtest
```

### 10.7 500 Internal Server Error
```bash
# Check error logs:
tail -100 /usr/local/apache/logs/error_log

# Common causes:
# 1. PHP memory limit: increase in .htaccess or php.ini
# 2. .htaccess syntax error: rename .htaccess temporarily
# 3. Corrupted files: re-upload
# 4. ModSecurity false positive: disable for domain in WHM or cPanel
```

### 10.8 "Connection Timed Out" or "502 Bad Gateway"
```bash
# Check if services running:
systemctl status httpd
systemctl status mariadb
systemctl status named

# Check resource usage:
top
df -h
free -m

# Restart affected services:
/scripts/restartsrv_httpd
/scripts/restartsrv_mysqld
```

---

## 11. Deploying Your React/Node.js App to cPanel

### 11.1 Determine Your cPanel Type

**Check if your cPanel supports Node.js:**
1. Log into cPanel
2. Look for "Setup Node.js App" or "Application Manager" icon
   - If present → **cPanel with Node.js support** → Use Option A
   - If NOT present → **Standard cPanel** → Use Option B

---

### Option A: cPanel with Node.js Support (Optimal)

#### Step 1: Prepare Your Application
```bash
# In your project root:
# Ensure .env file exists with all required variables
cat > .env << 'EOF'
VITE_ADMIN_PASSWORD=admin123
NODE_ENV=production
PORT=3000
EOF

# Build the project
pnpm install --no-frozen-lockfile
pnpm run build
```

#### Step 2: Upload Files via cPanel File Manager
1. Log into cPanel → File Manager
2. Navigate to `public_html`
3. **Upload these folders:** (compressed as ZIP then extract)
   - `dist/spa/` contents → `public_html/` (HTML, CSS, JS)
   - `server/` folder → outside `public_html` (e.g., `/home/username/server/`)
   - `shared/` folder → outside `public_html`
   - `package.json`, `pnpm-lock.yaml` → outside `public_html`

**Recommended folder structure:**
```
/home/username/
├── app/                    # Your app root
│   ├── dist/server/        # Built server
│   ├── dist/spa/          # Built client (copied to public_html)
│   ├── server/            # Source server code
│   ├── shared/            # Shared types
│   ├── package.json
│   └── pnpm-lock.yaml
└── public_html/           # Web root
    ├── index.html         # From dist/spa/
    ├── assets/
    └── .htaccess          # SPA routing
```

#### Step 3: Create Node.js Application
1. In cPanel → **Setup Node.js App**
2. Click **Create Application**
3. Configuration:
   - Application mode: Production
   - Application root: `/home/username/app`
   - Application URL: `/` (or `/api` to isolate API)
   - Application entry point: `dist/server/node-build.mjs`
   - Environment variables:
     - `NODE_ENV=production`
     - `PORT=3000` (or 3001 if already used)
   - Build command: `pnpm install --no-frozen-lockfile && pnpm run build`
4. Click **Create**

#### Step 4: Configure Apache to Proxy Node.js (via .htaccess)
In `public_html/.htaccess`:
```apache
RewriteEngine On

# Proxy API requests to Node.js server
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# SPA fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

#### Step 5: Start Application
- In cPanel Node.js App manager, click **Restart Application**
- Wait 30 seconds
- Test: `https://yourdomain.com/api/ping`
- Should return: `{"message":"ping"}`

---

### Option B: Standard cPanel (No Node.js Support) - Static Build

This option builds a static version. Admin panel works, but API routes won't function.

#### Step 1: Build Static Files Only
```bash
# Build client only (skip server)
npx pnpm run build:client

# Output is in dist/spa/
```

#### Step 2: Upload to cPanel
1. Log into cPanel → File Manager
2. Navigate to `public_html`
3. Delete old files (except backups)
4. Upload **contents** of `dist/spa/`:
   - `index.html`
   - `assets/` folder
   - Any other files

#### Step 3: Configure .htaccess for SPA Routing
Create/update `public_html/.htaccess`:
```apache
# Enable mod_rewrite
RewriteEngine On
RewriteBase /

# Handle API routes - redirect to separate domain or handle differently
# If you have a separate backend server:
# RewriteRule ^api/(.*)$ https://api.yourdomain.com/$1 [P,L]

# SPA fallback: send all non-file requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# Optional: Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json
</IfModule>

# Optional: Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresDefault "access plus 2 days"
</IfModule>
```

#### Step 4: Set Index Page
In cPanel → **Advance → Indexes**:
- Ensure `index.html` is listed as a valid index file
- Order: `index.html, index.php, index.cgi, index.pl`

#### Step 5: Test
- Visit `https://yourdomain.com`
- Navigate to admin: `https://yourdomain.com/login` (password: `admin123`)
- Admin panel should load (localStorage-based, no backend needed)

---

### 11.3 Deploy via ZIP (Alternative)

```bash
# Create deployment package
cd dist/spa
zip -r ../site.zip *

# Upload via cPanel File Manager
# Extract to public_html
```

---

### 11.4 Deployment Checklist

**Pre-deployment:**
- [ ] Build locally: `pnpm run build` (or `pnpm run build:client` for static)
- [ ] Test locally: `npx pnpm start` → visit http://localhost:3000
- [ ] Check console for errors
- [ ] Update `package.json` name/version if needed
- [ ] Set environment variables in cPanel or .env file

**Upload:**
- [ ] Upload `dist/spa/` contents to `public_html/` (static) OR
- [ ] Upload full project and configure Node.js app in cPanel
- [ ] Set correct permissions: 755 dirs, 644 files
- [ ] Upload `.htaccess` for SPA routing

**Post-deployment:**
- [ ] Clear browser cache (hard refresh Ctrl+Shift+R)
- [ ] Test navigation between pages (React Router)
- [ ] Test admin panel: `/login` → password `admin123`
- [ ] Check console/network tabs for 404s
- [ ] Test on mobile device

---

## 12. Additional Security Hardening (WHM Level)

### 12.1 Disable Compilers (for jailed users)
```bash
# WHM → Security Center → Compiler Access
# Disable for all unless needed
```

### 12.2 Enable cPHulk Brute Force Protection
```bash
# WHM → Security Center → cPHulk Brute Force Protection
# Enable: Yes
# Maximum failures per account: 5
# Block for: 1 hour
# Whitelist your IP
```

### 12.3 Tweak Settings (WHM → Server Configuration → Tweak Settings)

**Security tab:**
```
Allow users to run cron jobs with "ALL": No
Allow users to override PHP open_basedir: Yes (if needed)
Enable "Compress All" in Apache: Yes
Enable Chicken and Egg for Apache: Yes
Restrict document root: Yes
Restrict directory users: Yes
```

**System tab:**
```
cPanel Update Frequency: Daily
Enable cPanel Update Notifications: Yes
Maximum MySQL connections: 500
Max min memory percent: 70
```

### 12.4 Create Regular Backups
```bash
# WHM → Backup → Backup Configuration
# Enable backups: Yes
# Backup type: Compressed
# Retention: Daily (keep 3), Weekly (keep 4), Monthly (keep 6)
# Backup directory: /backup (on separate drive if possible)

# Exclude directories:
# /home/user/temp
# /home/user/cache

# Schedule:
# Daily at 2:00 AM
# Weekly Sunday at 3:00 AM
```

### 12.5 Monitoring & Alerts
```bash
# Set up monitoring in WHM → Server Contacts
# Email: admin@yourdomain.com
# ICQ/IRC/HipChat: optional

# Enable "Service Status Notifications"
# Get alerted when Apache/MariaDB/Exim go down
```

---

## 13. Performance Optimization

### 13.1 Enable OPcache for PHP
```bash
# WHM → MultiPHP INI Editor → All PHP versions
# OPcache settings:
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.validate_timestamps=1
opcache.revalidate_freq=60
```

### 13.2 MySQL/MariaDB Tuning
```bash
# WHM → Service Configuration → MariaDB (MySQL) Configuration
# Basic tuning (adjust based on RAM):

[mysqld]
innodb_buffer_pool_size = 512M      # ~70% of RAM for dedicated DB server
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 1  # 2 for less durability, faster
max_connections = 500
query_cache_size = 0                # Disabled in MySQL 8+
thread_cache_size = 16

# Apply and restart MariaDB
```

### 13.3 Apache MPM Event (Recommended)
```bash
# WHM → Service Configuration → Apache Configuration → Global Configuration
# Set MPM: event (faster than prefork)

# Event MPM settings:
StartServers: 3
MinSpareThreads: 75
MaxSpareThreads: 250
ThreadsPerChild: 25
MaxRequestWorkers: 400
MaxConnectionsPerChild: 0
```

---

## 14. Automated Tasks & Monitoring

### 14.1 Create Cron Jobs
```bash
# WHM → Cron Jobs → Create New Cron Job

# Daily log rotation at 2 AM
0 2 * * * /usr/sbin/logrotate -f /etc/logrotate.conf

# Weekly security audit
0 3 * * 0 /usr/local/cpanel/scripts/audit_cpanel

# Monthly update check
0 4 1 * * /usr/local/cpanel/scripts/upcp --check

# Clean old sessions
0 5 * * * find /home/*/tmp -type f -mtime +1 -delete
```

### 14.2 Monitor Disk Space
```bash
# Add to crontab:
*/30 * * * * df -h /home /var /tmp | mail -s "Disk Usage Report" admin@yourdomain.com
```

### 14.3 Fail2Ban Alternative (CSF already includes)
```bash
# CSF's LFD (Login Failure Daemon) is enabled by default
# View blocks: csf -l | grep "Blocked"
# Unblock: csf -d IP_ADDRESS
```

---

## 15. Regular Maintenance Schedule

**Daily:**
- Check `/var/log/exim_mainlog` for spam issues
- Review cPanel disk usage: `df -h`
- Monitor CPU/memory: `top` or `htop`

**Weekly:**
- Update system: `yum update -y`
- Check backup logs
- Review cPanel error logs
- Rotate logs

**Monthly:**
- Review security logs
- Update Imunify360/CSF definitions
- Check for cPanel updates
- Generate monthly backup report

**Quarterly:**
- Full system audit
- Test restore from backup
- Review firewall rules
- Update PHP versions

---

## 16. Troubleshooting Deployment Errors

### Error: "Internal Server Error 500"
- **Cause:** .htaccess error, permission issue, PHP memory
- **Fix:**
  1. Temporarily rename `.htaccess` to `.htaccess.bak`
  2. Set permissions: `chmod 644 .htaccess`, `chmod 755 directory`, `chmod 644 files`
  3. Increase PHP memory in .htaccess: `php_value memory_limit 256M`

### Error: "403 Forbidden"
```bash
# Check SELinux (if enabled):
ls -laZ index.html  # Should be current_user:object_r:httpd_sys_content_t

# Fix context:
chcon -t httpd_sys_content_t index.html
```

### Error: "Application Error" in cPanel Node.js
```bash
# Check application logs in cPanel:
# cPanel → Metrics → Errors
# Or SSH: cat ~/nodejsapp/stderr.log

# Common fixes:
1. Wrong entry point → set to `dist/server/node-build.mjs`
2. Missing dependencies → run `pnpm install` in application root
3. Port conflict → change PORT env var to 3001, 3002, etc.
4. Build failed → run `pnpm run build` manually to see errors
```

### Error: "ERR_TOO_MANY_REDIRECTS" (HTTPS)
```bash
# Check for mixed content or duplicated redirect rules
# In cPanel → Force HTTPS Redirect should be ON
# .htaccess should not have conflicting rules
```

### Error: "ERR_SSL_PROTOCOL_ERROR"
```bash
# Verify SSL certificate:
/usr/local/cpanel/bin/checkallsslcerts

# Reissue AutoSSL:
# WHM → SSL/TLS → AutoSSL → Run AutoSSL for selected domain

# Check if port 443 is open in firewall
```

### Error: "Connection refused" on port 3000 (for Node.js apps)
```bash
# Check Node.js app status:
cd /home/username/app
./node_modules/.bin/pm2 list

# Or view cPanel Node.js process:
ps aux | grep node

# Ensure proxy in .htaccess points to correct port:
# RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
# Change 3000 to the port shown in cPanel Node.js app settings
```

### Error: Email goes to Spam
```bash
# 1. Setup SPF, DKIM, DMARC (already covered)
# 2. Reverse DNS (PTR record) - ask hosting provider to set
# 3. Check IP reputation: mxtoolbox.com/blacklists.aspx
# 4. Warm up IP (if new): send gradually increasing emails
# 5. Avoid spam keywords in subject
# 6. Include unsubscribe link for bulk emails
```

### Error: "Exim connection timed out"
```bash
# Check if port 25 outbound is blocked by provider
telnet gmail-smtp-in.l.google.com 25

# If blocked, use alternative port 587 with TLS
# In WHM → Service Configuration → Exim Configuration Manager
# Smtp Sending: Force SMTP TLS: Yes
```

---

## Appendix

### A. Useful cPanel Scripts
```bash
# Restart all services
/scripts/restartsrv_all

# Switch Apache mode (prefork/event/worker)
/usr/local/cpanel/scripts/switchapiconf --auto

# Update cPanel
/usr/local/cpanel/scripts/upcp

# Repair cPanel account
/usr/local/cpanel/scripts/repair_account user

# Check cPanel update
/usr/local/cpanel/scripts/check_cpanel_rpms

# List users
/usr/local/cpanel/scripts/listaccounts

# Reset cPanel password
/usr/local/cpanel/scripts/kpasswd user
```

### B. Quick Reference: cPanel Ports
```
20, 21    FTP
22        SSH
25, 465, 587  SMTP
110, 995  POP3
143, 993  IMAP
53        DNS
80, 443   HTTP/HTTPS
2082, 2083  cPanel
2086, 2087  WHM
2095, 2096  Webmail
3306      MySQL (remote connections - DISABLE unless needed)
```

### C. cPanel Log File Locations
```
/usr/local/apache/logs/error_log    - Apache errors
/usr/local/apache/logs/access_log   - Apache access
/var/log/exim_mainlog               - Exim (email)
/var/lib/mysql/DB_NAME.err          - MySQL errors
/usr/local/cpanel/logs/access_log   - cPanel access
/usr/local/cpanel/logs/error_log    - cPanel errors
/home/USERNAME/access_log           - Domain-specific access
```

### D. Essential WHM Extensions (Paid)
- **CloudLinux** – OS-level isolation
- **Imunify360** – Advanced security (WAF, malware scanning)
- **LiteSpeed** – Alternative to Apache (faster, but cost)
- **Softaculous** – One-click app installer
- **SiteImprove** – SEO & performance monitoring

---

## Conclusion

This guide covers enterprise-grade cPanel/WHM deployment. Key takeaways:
1. **Security first:** Change SSH port, disable root login, install CSF
2. **SSL everywhere:** Use AutoSSL/Let's Encrypt
3. **Email properly:** Configure SPF/DKIM/DMARC, limit outbound
4. **Monitor logs:** Regularly check `/var/log/exim_mainlog`, Apache errors
5. **Backup religiously:** Automated, tested backups

For your specific React/Node.js app deployment:
- **Recommended:** cPanel with Node.js support → full API functionality
- **Alternative:** Static build → deploy to `public_html/` with SPA routing htaccess

Regular maintenance and monitoring will keep your server secure and performant.
