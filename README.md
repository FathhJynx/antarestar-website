# 🚀 Antarestar Explorer Hub
> **Platform E-Commerce Generasi Terbaru untuk Para Petualang**  
> *Dikembangkan dengan ❤️ oleh **Fathan Jamil***

[![Laravel](https://img.shields.io/badge/Laravel-13.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![RoadRunner](https://img.shields.io/badge/RoadRunner-Enabled-F7DC6F?style=for-the-badge&logo=roadrunner)](https://roadrunner.dev/)

---

## ✨ Ikhtisar (Overview)

**Antarestar Explorer Hub** adalah platform e-commerce premium yang dirancang khusus untuk kebutuhan perlengkapan outdoor dan petualangan. Dengan performa tinggi dan desain modern, platform ini memberikan pengalaman belanja yang mulus dan responsif bagi para penjelajah.

### 🌟 Fitur Utama Website
- **⚡ Performa Kilat:** Navigasi antar halaman yang instan tanpa *lag* berkat optimasi server **RoadRunner**.
- **🛍️ Katalog Produk Modern:** Penelusuran produk yang interaktif dengan sistem filter kategori yang cerdas.
- **🔥 Promo Flash Sale:** Fitur penjualan terbatas dengan penghitung waktu mundur (*countdown*) yang real-time.
- **💎 Member Area Eksklusif:** Dashboard khusus anggota untuk melacak pesanan, poin, dan sistem **Referral** untuk mendapatkan reward.
- **🤝 Program Afiliasi:** Halaman khusus bagi mitra untuk memantau komisi, klik, dan performa konversi secara transparan.
- **🛡️ Sistem Checkout Terpadu:** Alur pembayaran yang aman dengan manajemen alamat, pemilihan kurir, dan integrasi voucher.
- **📊 Panel Admin Powerfull:** Dashboard manajemen lengkap untuk mengelola produk, kategori, diskon, hingga laporan penjualan detail.
- **📱 Responsivitas Tinggi:** Pengalaman belanja yang konsisten dan nyaman baik di desktop maupun perangkat mobile.
- **📖 Blog Petualangan:** Ruang edukasi dan inspirasi seputar tips petualangan dan review perlengkapan.

---

## 🏗️ Arsitektur Sistem

Proyek ini menggunakan pemisahan struktur yang modern:

### 🌐 [Frontend](./frontend)
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Animasi:** Framer Motion
- **State Management:** React Context API & Hooks

### ⚙️ [Backend](./backend)
- **Framework:** Laravel 13
- **Server:** Laravel Octane + RoadRunner
- **API Documentation:** Knuckles Scribe
- **Database:** MySQL / SQLite

---

## 🚀 Cara Menjalankan

### Persyaratan Sistem
- PHP >= 8.3
- Node.js >= 20
- Composer
- MySQL

### Langkah Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/FathhJynx/antarestar-website.git
   cd antarestar-explorer-hub
   ```

2. **Setup Backend**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   # Untuk Windows Dev:
   php artisan octane:start --server=roadrunner --watch
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛠️ Teknologi & Kredit

| Teknologi | Penggunaan |
| :--- | :--- |
| **Laravel 13** | Backend Core |
| **Laravel Octane** | Performance Layer |
| **RoadRunner** | High-performance PHP Server |
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Interaksi & Animasi |

---

## 👤 Pengembang

**Fathan Jamil**  
*Fullstack Developer & UI/UX Enthusiast*

- **GitHub:** [@FathhJynx](https://github.com/FathhJynx)
- **Project:** Antarestar Website Official

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.

---
<p align="center">Dibuat khusus untuk para penjelajah, oleh seorang penjelajah. 🏔️</p>
