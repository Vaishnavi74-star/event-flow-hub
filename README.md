# 🎉 Event Flow Hub

🚀 Live Demo:
https://event-flow-hub-git-main-vaishnavi74-stars-projects.vercel.app

---

## 📌 Project Overview

Event Flow Hub is a full-stack event management platform that allows users to create, manage, and participate in events seamlessly.

It supports role-based access for Admins, Organizers, and Participants, making it suitable for college fests, hackathons, and event booking systems.

---

## ✨ Features

* 🔐 User Authentication (Sign up / Login)
* 👤 Role-based access:

  * Admin
  * Organizer
  * Participant
* 📅 Create and manage events
* 🎟️ Book tickets for events
* 📊 View event details and categories
* 💬 Feedback system
* 📍 Venue management

---

## 🛠️ Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS

### Backend

* Supabase (Database + Auth + APIs)

### Deployment

* Vercel

---

## 🗄️ Database

The project uses Supabase (PostgreSQL) with the following main tables:

* users / profiles
* events
* bookings
* categories
* payments
* venues
* feedback
* waitlist

---

## ⚙️ Environment Variables

Create a `.env` file and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

---

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/your-username/event-flow-hub.git

# Go to project folder
cd event-flow-hub

# Install dependencies
npm install

# Run project
npm run dev
```

---

## 🌐 Deployment

The project is deployed using Vercel:

* Automatic deployment via GitHub
* Environment variables configured in Vercel dashboard

---

## 🔒 Authentication Setup

Supabase Authentication is used.

Make sure to configure:

* Site URL
* Redirect URLs

in Supabase Dashboard → Authentication → URL Configuration

---

## 📸 Screenshots

(Add screenshots here if needed)

---

## 👩‍💻 Author

**Vaishnavi Deshpande**

---

## 📢 Notes

* Ensure environment variables are correctly set before deployment
* Redeploy after changing env variables
* Supabase rate limits may affect email signups in free tier

---

## ⭐ Future Improvements

* Payment gateway integration
* Real-time notifications
* Admin analytics dashboard
* Mobile responsiveness improvements

---

## 🙌 Acknowledgements

* Supabase
* Vercel
* React ecosystem

