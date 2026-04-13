# 🚀 Antarestar Explorer Hub
> **Next-Gen E-Commerce for Modern Adventurers**  
> *Crafted with ❤️ by **Fathan Jamil***

[![Laravel](https://img.shields.io/badge/Laravel-13.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![RoadRunner](https://img.shields.io/badge/RoadRunner-Enabled-F7DC6F?style=for-the-badge&logo=roadrunner)](https://roadrunner.dev/)

---

## ✨ Overview

**Antarestar Explorer Hub** is a premium, high-performance e-commerce platform designed specifically for outdoor equipment and adventure gear. Built using the latest technology stack, it offers a seamless, blazingly fast, and visually stunning shopping experience.

### 🌟 Key Features
- **⚡ Ultra-Performance:** Powered by **Laravel Octane & RoadRunner** for sub-millisecond API responses.
- **🎨 Modern UI/UX:** Responsive design using **React 19**, **Tailwind CSS**, and **Framer Motion**.
- **🛠️ Robust Backend:** Scalable architecture with Laravel 13, featuring comprehensive admin management.
- **📱 Mobile Optimized:** Designed for explorers on the go with a mobile-first approach.
- **🛡️ Security Hardened:** Implementation of security headers and strict validation protocols.

---

## 🏗️ Architecture

The project is split into two main components:

### 🌐 [Frontend](./frontend)
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Animations:** Framer Motion
- **State Management:** React Context API / Hooks

### ⚙️ [Backend](./backend)
- **Framework:** Laravel 13
- **Server:** Laravel Octane + RoadRunner
- **API Documentation:** Knuckles Scribe
- **Database:** MySQL / SQLite

---

## 🚀 Getting Started

### Prerequisites
- PHP >= 8.3
- Node.js >= 20
- Composer
- MySQL

### Installation

1. **Clone the repository**
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
   # For Windows Dev:
   php artisan octane:start --server=roadrunner --watch
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🛠️ Tech Stack & Credits

| Technology | Usage |
| :--- | :--- |
| **Laravel 13** | Backend Core |
| **Laravel Octane** | Performance Layer |
| **RoadRunner** | High-performance PHP Server |
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Interaction & Motion |
| **Lucide Icons** | Iconography |

---

## 👤 Author

**Fathan Jamil**  
*Fullstack Developer & UI Enthusiast*

- **GitHub:** [@FathhJynx](https://github.com/FathhJynx)
- **Project:** Antarestar Website

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<p align="center">Built for explorers, by an explorer. 🏔️</p>
