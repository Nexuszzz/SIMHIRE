# 🚀 SIMHIRE Deployment Guide

## 📍 Production Deployment

### Live URLs
- **Primary Domain**: https://simhire.flx.web.id (HTTPS - Recommended)
- **Fallback IP**: http://13.213.57.228 (HTTP - Development only)

### VPS Configuration
- **Provider**: AWS EC2 / Custom VPS
- **IP Address**: 13.213.57.228
- **OS**: Ubuntu 22.04 LTS
- **Web Server**: Nginx 1.24.0
- **SSL/TLS**: Let's Encrypt (Auto-renewal enabled)

---

## 🔧 Server Configuration

### Nginx Setup

**Primary Site**: `/etc/nginx/sites-available/simhire.flx.web.id`

```nginx
server {
    # HTTP - Auto redirect to HTTPS
    listen 80;
    server_name simhire.flx.web.id;
    return 301 https://$host$request_uri;
}

server {
    # HTTPS - Main configuration
    listen 443 ssl http2;
    server_name simhire.flx.web.id;
    
    # Document root
    root /var/www/simhire/dist;
    index index.html;
    
    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Access-Control-Allow-Origin * always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/javascript application/json;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # JavaScript MIME type
    location ~* \.js$ {
        add_header Content-Type application/javascript;
    }
    
    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/simhire.flx.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/simhire.flx.web.id/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

### Ports Configuration

| Service | Port | Usage |
|---------|------|-------|
| HTTP | 80 | Auto-redirect to HTTPS |
| HTTPS | 443 | Production (simhire.flx.web.id) |
| Dev Server | 8347 | Local development (custom port) |

**Note**: Port 5173 (default Vite) has been changed to 8347 for security reasons.

---

## 📦 Deployment Process

### 1. Local Build & Push
```bash
# Build production bundle
npm run build

# Commit changes
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. VPS Deployment
```bash
# SSH to VPS
ssh user@13.213.57.228

# Navigate to project directory
cd /var/www/simhire

# Pull latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Build production bundle
npm run build

# Restart Nginx
sudo systemctl reload nginx
```

### 3. SSL Certificate Renewal
SSL certificates auto-renew via Certbot. To manually renew:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 🔐 Security Features

### HTTPS/SSL
- ✅ Let's Encrypt SSL certificate
- ✅ Auto-renewal enabled
- ✅ HTTP → HTTPS redirect
- ✅ Modern TLS configuration

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Access-Control-Allow-Origin: *` (CORS enabled)

### Additional Security
- ✅ Gzip compression enabled
- ✅ SPA routing configured
- ✅ Correct MIME types for assets
- ✅ Crypto.randomUUID polyfill for non-HTTPS contexts

---

## 👥 Demo Accounts

### Candidate Account
- **Email**: kandidat@wengdev.com
- **Password**: kandidat123

### Company Account
- **Email**: perusahaan@wengdev.com
- **Password**: perusahaan123

---

## 📞 Support & Contact

For deployment issues or questions:
- **Repository**: https://github.com/Nexuszzz/SIMHIRE
- **Domain**: simhire.flx.web.id
- **VPS IP**: 13.213.57.228

---

**Last Updated**: November 7, 2025
**Version**: Production v1.0
**Status**: ✅ Live and Operational
