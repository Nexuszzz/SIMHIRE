# 🚀 Panduan Deploy SimHire ke VPS

## Option 1: Menggunakan Script Deploy (Recommended)

### Step 1: Upload Script ke VPS
```bash
# Dari komputer lokal, upload script deploy
scp deploy.sh root@103.30.246.36:/var/www/simhire/
```

### Step 2: SSH ke VPS
```bash
ssh root@103.30.246.36
```

### Step 3: Jalankan Script
```bash
cd /var/www/simhire
chmod +x deploy.sh
bash deploy.sh
```

---

## Option 2: Manual Deployment (Step-by-step)

### 1. SSH ke VPS
```bash
ssh root@103.30.246.36
```

### 2. Navigate ke Project
```bash
cd /var/www/simhire
```

### 3. Pull Changes dari GitHub
```bash
git pull origin main
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Build Production
```bash
npm run build
```

### 6. Restart Nginx
```bash
sudo systemctl restart nginx
```

### 7. Verify Deployment
```bash
# Check Nginx status
sudo systemctl status nginx

# Test site
curl -I https://simhire.flx.web.id
```

---

## Option 3: One-Line Command

Setelah SSH ke VPS, jalankan:

```bash
cd /var/www/simhire && git pull origin main && npm install && npm run build && sudo systemctl restart nginx && echo "✅ Deployment Complete! Visit: https://simhire.flx.web.id"
```

---

## ✅ Verification Checklist

Setelah deploy, verify:

1. **Git Pull Berhasil**
   ```bash
   git log -1 --oneline
   # Should show: "Add deployment documentation with mobile sidebar features"
   ```

2. **Build Berhasil**
   ```bash
   ls -lh dist/
   # Should show files like index.html, assets/
   ```

3. **Nginx Running**
   ```bash
   sudo systemctl status nginx
   # Should show: "active (running)"
   ```

4. **Site Accessible**
   ```bash
   curl -I https://simhire.flx.web.id
   # Should return: HTTP/2 200
   ```

5. **Test di Browser**
   - Buka: https://simhire.flx.web.id
   - Test mobile navbar (klik hamburger icon)
   - Verify sidebar slide dari kanan
   - Test responsive di berbagai screen size

---

## 🐛 Troubleshooting

### Jika Git Pull Gagal
```bash
# Reset local changes
git reset --hard HEAD
git clean -fd
git pull origin main
```

### Jika Build Gagal
```bash
# Clear cache dan rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Jika Nginx Error
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Test config
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

### Jika Site Tidak Update
```bash
# Clear browser cache atau hard refresh
# Chrome: Ctrl + Shift + R
# Firefox: Ctrl + F5
```

---

## 📊 Latest Changes

Commit: `9b7cd47`
- ✅ Mobile sidebar navigation (slide dari kanan)
- ✅ All pages fully responsive
- ✅ Touch-friendly buttons
- ✅ Optimized for all device sizes

---

## 🎯 Post-Deployment Testing

### Test pada device:
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile Android Chrome
- [ ] Mobile iOS Safari
- [ ] Tablet

### Test features:
- [ ] Mobile sidebar navigation
- [ ] Login form responsive
- [ ] Register multi-step responsive
- [ ] Dashboard stats responsive
- [ ] Company pages responsive
- [ ] All home sections responsive

---

## 📞 Support

Jika ada masalah deployment:
1. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
2. Check build output untuk errors
3. Verify file permissions: `ls -la /var/www/simhire/dist`

---

**VPS Info:**
- IP: 103.30.246.36
- User: root
- Path: /var/www/simhire
- Domain: https://simhire.flx.web.id
- Nginx: Active
- SSL: Let's Encrypt (Auto-renewal)

Good luck! 🚀
