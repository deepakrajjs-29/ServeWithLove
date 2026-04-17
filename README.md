<div align="center">

# 🍽️ ServeWithLove

### A real-time food donation platform connecting Donors with NGOs to fight food waste and hunger.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📖 About The Project

**ServeWithLove** is a modern, real-time web platform designed to combat food waste and hunger by connecting food **Donors** (restaurants, event organizers, individuals) with **NGOs** (Non-Governmental Organizations). It streamlines the entire lifecycle of surplus food — from listing to pickup — before it expires.

---

## ✨ Features

- 📊 **Interactive Dashboard** — Personalized control center with metrics for Active, In-Progress, and Completed donations
- 📡 **Live Feed** — Real-time scrolling feed of all active food donations with filter (status) and sort (urgency) controls
- 🗺️ **Live Interactive Map** — Geospatial view with color-coded donation statuses (🟢 Available · 🟡 Requested · ⚫ Completed)
- ⏱️ **Urgency Scoring System** — Auto-prioritizes highly perishable items based on expiration time
- 🔄 **Donation Tracking** — Full lifecycle visibility for both Donors and NGOs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **Routing** | React Router v6 with `<ProtectedRoute>` |
| **Styling** | Tailwind CSS (glassmorphism, custom palettes) |
| **Animations** | Framer Motion |
| **Maps** | Leaflet / React-Leaflet |
| **Icons** | Lucide React |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore (real-time `onSnapshot` listeners) |

---

## 🏗️ Project Architecture

```
src/
├── App.jsx                  # Root provider — URL → Page mapping
├── firebase/
│   └── config.js            # Firebase init, exports auth & db
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── About.jsx
└── components/
    ├── LiveMap.jsx           # Lazy-loaded map module
    ├── DonationCard.jsx
    ├── DonationForm.jsx
    ├── Sidebar.jsx
    └── Navbar.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ServeWithLove.git
cd ServeWithLove

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Firebase credentials in .env

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 👤 User Roles

| Role | Capability |
|---|---|
| **Donor** | Post surplus food with location, quantity, and expiry time |
| **NGO** | Browse, claim, and collect available donations |

---

## ⚡ Technical Highlights

- **Real-time Sync** — Firestore WebSocket listeners (`onSnapshot`) push updates instantly — no page refresh needed
- **Lazy Loading** — `LiveMap.jsx` is loaded via React `<Suspense>`, reducing initial bundle size significantly
- **Clean Component Architecture** — Atomic component separation for high maintainability and scalability

---

## 📦 Build for Production

```bash
npm run build
# Output is in the /dist folder
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Made with ❤️ to reduce food waste and fight hunger.

</div>
