# 📌 Project Management Dashboard

A full‑stack **Project Management Dashboard** built with **Next.js**, **Node.js**, and **AWS Services**. This application helps teams organize, track, and collaborate on projects more efficiently. Users can:

* Manage and assign tasks to team members
* Prioritize tasks (low, medium, high)
* Set timelines and deadlines
* Drag and drop tasks across workflow stages: **To Do → In Progress → Under Review → Completed**
* Visualize project and team data in interactive graphs

---

<img width="1839" height="881" alt="image" src="https://github.com/user-attachments/assets/ec29b3e4-f93a-4ef5-95e4-5c6300e9222f" />

[**Visit Live version**](https://main.d2rkgcgqjm6o35.amplifyapp.com)



## 🚀 Features

* 🔐 Authentication & authorization via **AWS Cognito**
* 📂 File storage using **AWS S3**
* 📊 Graphs & analytics for task progress
* 🗂️ Kanban‑style drag‑and‑drop task board
* 👥 Team & role management
* 📅 Task deadlines and priority tracking
* 📈 Dashboard views with data visualization

---

## 🛠️ Tech Stack

**Frontend:**

* Next.js (React framework)
* Tailwind CSS (styling)
* Redux Toolkit + RTK Query (state management & API)
* Material UI Data Grid (tabular views)

**Backend:**

* Node.js with Express
* Prisma (ORM)
* PostgreSQL

**Database:**

* PostgreSQL (managed with PgAdmin)

**Cloud & DevOps:**

* AWS EC2 (server hosting)
* AWS RDS (PostgreSQL database)
* AWS Amplify (frontend hosting)
* AWS API Gateway
* AWS Lambda (serverless functions)
* AWS S3 (file storage)
* AWS Cognito (authentication)

---

## ⚙️ Getting Started

### ✅ Prerequisites

Ensure you have the following installed:

* Git
* Node.js & npm
* PostgreSQL
* PgAdmin

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd project-management
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd client
   npm install

   # Backend
   cd ../server
   npm install
   ```

3. **Set up database**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

4. **Configure environment variables**

   * In `/server/.env`:

     ```env
     PORT=5000
     DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>
     ```
   * In `/client/.env.local`:

     ```env
     NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
     ```

5. **Run the project**

   ```bash
   # Start backend
   cd server
   npm run dev

   # Start frontend
   cd ../client
   npm run dev
   ```

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

* **Frontend** deployed via **AWS Amplify**
* **Backend** deployed on **AWS EC2** with API Gateway + Lambda
* **Database** hosted on **AWS RDS**

---

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 📧 Contact

For questions or feedback, reach out at: **elbairabennaji@gmail.com**
