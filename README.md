# <img src="./docs/logo.png" alt="Recovery Vault Logo" width="32" height="32" align="left" style="margin-right: 8px;"> Recovery Code Vault

A secure, client-side app for managing recovery codes with AES-256 encryption. Features a nostalgic Green Steam (VGUI) aesthetic.

![Dashboard Screenshot](./docs/screenshots/dashboard.png)

## Features
- **AES-256 Encryption** – Codes are encrypted locally before storage
- **Zero Server** – Everything stays on your machine
- **Auto-Import** – Drag & drop `.txt` files to import codes
- **Usage Tracking** – Mark codes as used and monitor remaining balance

## Quick Start
```bash
git clone https://github.com/DaksshDev/RecoveryCodesVault.git
cd RecoveryCodesVault
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack
React • Vite • Zustand • CryptoJS • Tailwind CSS • [VGUI CSS](https://github.com/AlpyneDreams/vgui.css)

## Styling
Uses authentic VGUI styles from `./client/public/vgui/styles` based on the [vgui.css framework](https://github.com/AlpyneDreams/vgui.css).

---
*Secure. Simple. Local.*

**Thanks to [VGUI CSS](https://github.com/AlpyneDreams/vgui.css) for the amazing design system.**