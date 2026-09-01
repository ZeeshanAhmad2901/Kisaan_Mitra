# 🌾 Kisaan Mitra

A smart digital platform designed to streamline agricultural procurement by connecting farmers with procurement centres through slot booking, queue management, notifications, and real-time tracking.

## 📌 About the Project

Kisaan Mitra aims to reduce long waiting times and overcrowding at procurement centres by providing farmers with a convenient digital system for booking procurement slots and tracking their status.

The platform also provides tools for procurement-centre operators and administrators to manage bookings, queues, vehicles, and platform-level analytics.

## ✨ Key Features

### 👨‍🌾 Farmer
- Farmer registration and login
- OTP-based authentication
- Browse and select procurement centres
- Book procurement slots
- Select crop and vehicle details
- View booking history
- QR/token-based booking confirmation
- Track booking and queue status
- Multilingual interface support

### 🏢 Procurement Centre / Mandi Owner
- Dashboard with real-time statistics
- View and manage today's bookings
- Real-time queue tracking
- Gate and queue management
- Monitor waiting times
- Throughput and performance analytics
- Reports and operational management

### 👨‍💼 Super Admin
- Platform dashboard
- Manage procurement centres
- Manage centre owners
- Approve centre-owner registrations
- Platform-wide analytics
- State-wise statistics
- System settings

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State Management:** Zustand
- **Internationalization:** i18next + react-i18next
- **Charts & Analytics:** Chart-based dashboard components
- **API Communication:** REST API
- **Package Manager:** npm

## 📁 Project Structure

```text
Kisaan_Mitra/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── farmer/
│   │   ├── mandiOwner/
│   │   ├── superAdmin/
│   │   ├── shared/
│   │   └── ui/
│   ├── config/
│   ├── hooks/
│   ├── pages/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── farmer/
│   │   ├── mandiOwner/
│   │   └── superAdmin/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── i18n.ts
├── .env.example
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md