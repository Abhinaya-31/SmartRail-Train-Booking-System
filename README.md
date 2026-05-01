# 🚂 smartRail — MERN Stack Train Booking System

A full-stack train ticket booking web application built with the MERN stack (MongoDB, Express.js, React, Node.js). Designed to simulate a simplified, realistic train booking platform similar to IRCTC.

---

## 📁 Project Structure

```text
smartRail/
├── frontend/                   # React frontend (Vite)
│   ├── index.html              # Vite entry point
│   ├── vite.config.js          # Vite configuration & proxy
│   ├── tailwind.config.js      # Tailwind CSS v3 configuration
│   ├── postcss.config.js       # PostCSS configuration for Tailwind
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx          # Top navigation
│       │   ├── TrainCard.jsx       # Train result card
│       │   ├── BookingCard.jsx     # Booking history card
│       │   └── ProtectedRoute.jsx  # Auth guard wrapper
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state (React Context)
│       ├── pages/
│       │   ├── Home.jsx            # Landing page
│       │   ├── Login.jsx           # Login form
│       │   ├── Register.jsx        # Registration form
│       │   ├── SearchTrains.jsx    # Train search + results
│       │   ├── BookTicket.jsx      # Booking form
│       │   ├── MyBookings.jsx      # User booking history
│       │   ├── AdminDashboard.jsx  # Admin panel
│       │   ├── PNRStatus.jsx       # PNR check page
│       │   └── Profile.jsx         # User profile page
│       ├── utils/
│       │   └── api.js              # Axios instance with auth interceptor
│       ├── App.jsx                 # Routes + Toaster
│       ├── index.jsx               # React entry
│       └── index.css               # Tailwind + custom classes
│
├── backend/                    # Node.js + Express backend
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, GetMe
│   │   ├── trainController.js      # Search, GetById, GetAll
│   │   ├── bookingController.js    # Create, GetMine, Cancel, GetByPNR
│   │   └── adminController.js      # AddTrain, AllBookings, DeleteTrain
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trains.js
│   │   ├── bookings.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── authMiddleware.js       # protect + adminOnly
│   ├── index.js                    # Express app entry
│   └── .env.example                # Environment variable template
│
└── database/                   # Database logic and models
    ├── models/
    │   ├── User.js                 # User schema
    │   ├── Train.js                # Train schema
    │   └── Booking.js              # Booking schema with PNR
    └── seed.js                     # DB seed script
```

---

## ⚙️ Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18, Vite, React Router v6 |
| Styling   | Tailwind CSS v3 + PostCSS       |
| HTTP      | Axios                           |
| Toast     | react-hot-toast                 |
| Backend   | Node.js + Express.js            |
| Auth      | JWT (jsonwebtoken) + bcryptjs   |
| Database  | MongoDB + Mongoose              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm

---

### 1. Clone the project

```bash
git clone <your-repo-url>
cd smartRail
```

---

### 2. Backend Setup

Open a terminal and run:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder based on `.env.example`:
```text
PORT=5000
MONGO_URI=mongodb://localhost:27017/trainbooking
JWT_SECRET=change_this_to_a_strong_secret
```

Seed the database with sample trains + admin user:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

---

### 3. Frontend Setup

Open a **new** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API calls to the backend on `http://localhost:5000` via `vite.config.js`.

---

## 🔑 Test Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@trainbook.com    | admin123  |
| User  | Register a new account | —         |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Access  | Description      |
|--------|----------------------|---------|------------------|
| POST   | /api/auth/register   | Public  | Register user    |
| POST   | /api/auth/login      | Public  | Login user       |
| GET    | /api/auth/me         | Private | Get current user |

### Trains
| Method | Endpoint                  | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| GET    | /api/trains/search        | Private | Search by route+date |
| GET    | /api/trains/:id           | Private | Get train details    |
| GET    | /api/trains               | Private | Get all trains       |

### Bookings
| Method | Endpoint                    | Access  | Description         |
|--------|-----------------------------|---------|---------------------|
| POST   | /api/bookings               | Private | Create booking      |
| GET    | /api/bookings/my            | Private | My booking history  |
| PUT    | /api/bookings/:id/cancel    | Private | Cancel booking      |

### Admin
| Method | Endpoint                    | Admin Only | Description        |
|--------|-----------------------------|------------|--------------------|
| POST   | /api/admin/trains           | ✅         | Add new train      |
| GET    | /api/admin/bookings         | ✅         | View all bookings  |
| DELETE | /api/admin/trains/:id       | ✅         | Delete train       |

---

## ✨ Features

- **User Registration & Login** with JWT authentication
- **Train Search** by source, destination, and date (with day-of-week filtering)
- **Real-time Seat Availability** check before booking
- **Ticket Booking** with automatic PNR generation
- **Seat Deduction** after booking + seat restoration on cancellation
- **Booking History** with status filter (All / Confirmed / Cancelled)
- **Cancel Booking** with confirmation prompt
- **Admin Panel** — add trains, view all bookings, delete trains
- **Protected Routes** — unauthenticated users redirected to login
- **Toast Notifications** for success/error feedback
- **Responsive UI** — beautifully themed matching UI, works on mobile and desktop

---

## 📝 Notes for Developers

- Passwords are hashed using `bcryptjs` before storing in MongoDB
- JWT tokens expire in 7 days; stored in `localStorage`
- Axios interceptor auto-attaches the Bearer token to every request
- `npm run seed` can be re-run to reset trains; it won't duplicate trains
- The `proxy` is configured in `frontend/vite.config.js` to route API calls in development without CORS issues.
- For production, set `VITE_API_URL` in the frontend `.env` to point to the backend URL.
- The project runs on **Vite** for incredibly fast development and build times instead of Create React App.

---

## 🎓 Academic Notes

This project demonstrates:
- Full MERN stack integration
- Modern build tooling with Vite and PostCSS
- RESTful API design
- JWT-based authentication flow
- Mongoose schema design with relationships
- React Context API for global state
- Component-based architecture with separation of concerns
- Protected routing on both frontend and backend
