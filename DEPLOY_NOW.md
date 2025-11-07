# 🚀 DEPLOY SEKARANG - Pilihan Deploy

## ❗ MASALAH: SSH Timeout dari Windows PowerShell

SSH langsung dari PowerShell timeout karena firewall/network Windows.

---

## ✅ SOLUSI CEPAT - 3 Cara Deploy

### **CARA 1: Gunakan PuTTY (PALING MUDAH)** ⭐

1. **Download PuTTY** (jika belum punya): https://www.putty.org/
2. **Buka PuTTY**
3. **Connect:**
   - Host Name: `103.30.246.36`
   - Port: `22`
   - Connection type: SSH
   - Klik **Open**
4. **Login:**
   - login as: `root`
   - password: `[password VPS Anda]`
5. **Jalankan command ini:**
   ```bash
   cd /var/www/simhire
   git pull origin main
   npm install
   npm run build
   sudo systemctl restart nginx
   ```
6. **Verifikasi:** Buka https://simhire.flx.web.id

---

### **CARA 2: PowerShell Script** (Jika SSH sudah terinstall)

```powershell
.\deploy-windows.ps1
```

*Script sudah dibuat di: `deploy-windows.ps1`*

---

### **CARA 3: WSL (Windows Subsystem for Linux)**

Jika punya WSL installed:

```bash
wsl
ssh root@103.30.246.36
cd /var/www/simhire
bash deploy.sh
```

---

### **CARA 4: Copy-Paste Manual Command**

Buka SSH client apapun (PuTTY/MobaXterm/WSL), connect ke VPS, lalu:

```bash
cd /var/www/simhire && git pull origin main && npm install && npm run build && sudo systemctl restart nginx
```

---

## 📋 Yang Sudah Selesai ✅

- ✅ Semua halaman responsive (15+ halaman)
- ✅ Mobile sidebar navigation
- ✅ 17 TypeScript errors sudah fixed
- ✅ Build sukses (523KB bundle, 158KB gzipped)
- ✅ Code sudah push ke GitHub (commit: c6c32fc)
- ✅ Deployment scripts ready

---

## 🔍 Verifikasi Setelah Deploy

1. Buka: **https://simhire.flx.web.id**
2. Test mobile view (F12 → Toggle device toolbar)
3. Klik hamburger menu → lihat sidebar slide dari kanan
4. Test login/register forms
5. Check browser console (F12) untuk errors

---

## 📞 Need Help?

Jika masih ada masalah:
1. Screenshot error message
2. Cek file: `DEPLOY_INSTRUCTIONS.md` untuk troubleshooting lengkap

---

**🎯 REKOMENDASI: Gunakan PuTTY (Cara 1) - Paling mudah dan reliable untuk Windows!**
