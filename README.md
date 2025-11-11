Map-App

Map App is a full-stack MERN application with Admin and User roles, designed for creating, exploring, and managing blogs across multiple categories like Technology, Sports, Entertainment, and Devotional. It is secure, user-friendly, and fully responsive.

Features

Admin & User Roles

Users can create, edit, and view blogs.

Admin can manage all blogs, moderate content, and delete inappropriate posts.

Multiple Blog Categories

Technology, Sports, Entertainment, Devotional, and more.

Users can choose categories while creating blogs.

Search & Filter

Search blogs by title or keywords.

Filter blogs by category for easier discovery.

Authentication & Authorization

JWT-based secure login system.

Ensures only authorized users can perform certain actions.

Image Uploads

Integrated with Cloudinary for storing blog images efficiently.

Responsive UI

Modern and clean interface.

Works well on both desktop and mobile devices.

Tech Stack

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT

Image Storage: Cloudinary

Installation

Clone the repository:

git clone https://github.com/your-username/map-app.git


Install backend dependencies:

cd backend
npm install


Install frontend dependencies:

cd frontend
npm install


Create a .env file in the backend with your MongoDB URI, JWT secret, and Cloudinary credentials.

Start the backend server:

cd backend
npm run dev


Start the frontend server:

cd frontend
npm start


Open http://localhost:3000 in your browser.

Folder Structure
backend/       # Node.js + Express API
frontend/      # React.js frontend

Contribution

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.