# 🚂 SmartRail — Train Booking System

A full-stack train ticket booking web application built using the MERN Stack (MongoDB, Express.js, React, Node.js).  
This project simulates a realistic train booking platform with features like search, booking, cancellation, PNR tracking, admin control, and PDF ticket generation.

---

## Project Architecture

```
Frontend (React)
        ↓
Backend API (Node.js + Express)
        ↓
Database (MongoDB)
```

### Flow
User → UI → API → Backend → Database → Response → UI  

---

## Project Structure

```text
smartRail/
├── frontend/                   # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── TrainCard.jsx
│       │   ├── BookingCard.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── SearchTrains.jsx
│       │   ├── BookTicket.jsx
│       │   ├── MyBookings.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── PNRStatus.jsx
│       │   └── Profile.jsx
│       ├── utils/
│       │   └── api.js
│       ├── App.jsx
│       ├── index.jsx
│       └── index.css
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── trainController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── trains.js
│   │   ├── bookings.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── index.js
│   └── .env.example
│
└── database/
    ├── models/
    │   ├── User.js
    │   ├── Train.js
    │   └── Booking.js
    └── seed.js
```

---

## Tech Stack

- **Frontend:** React, React Router, Axios  
- **Styling:** Tailwind CSS  
- **Backend:** Node.js, Express  
- **Authentication:** JWT, bcrypt  
- **Database:** MongoDB, Mongoose  

---

## Features

### 👤 User
- Registration & Login (JWT Authentication)  
- Search trains (source → destination → date)  
- View train details  
- Ticket booking & cancellation  
- Booking history  
- PNR status check  
- PDF ticket download  

---

### 🚆 Train
- Train number & name  
- Source & destination  
- Timings  
- Seat availability  
- Fare details  

---

### 🎟️ Booking
- Seat availability validation  
- Fare calculation  
- PNR generation  
- Seat deduction & restoration  
- PDF ticket generation  

---

### 🧑‍💼 Admin
- Add new trains  
- Delete trains  
- View all bookings  

---

## Workflow

### Step 1: User Login
User logs in → JWT token generated  

### Step 2: Search Train
User enters details → backend filters trains  

### Step 3: Book Ticket
- Check availability  
- Deduct seats  
- Create booking  
- Generate PNR  

### Step 4: Cancel Ticket
- Update status  
- Restore seats  

### Step 5: Download Ticket
- PDF ticket download  

---

## API Design

### Auth
- POST /api/auth/register  
- POST /api/auth/login  

### Trains
- GET /api/trains  
- GET /api/trains/search  

### Bookings
- POST /api/bookings  
- GET /api/bookings/my  
- PUT /api/bookings/:id/cancel  

### Admin
- POST /api/admin/trains  
- GET /api/admin/bookings  
- DELETE /api/admin/trains/:id  

---

## Security Features

- Password hashing using bcrypt  
- JWT authentication  
- Protected routes using middleware  

---

## Getting Started

### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Test Credentials

Admin  
Email: admin@trainbook.com  
Password: admin123  

---

## Key Concepts Used

- MERN Stack Architecture  
- REST API  
- JWT Authentication  
- Middleware  
- MVC Pattern  
- CRUD Operations  
- React Hooks  
- Context API  

---

## Conclusion

smartRail demonstrates a complete MERN stack application with secure authentication, structured architecture, and real-world booking functionality.
