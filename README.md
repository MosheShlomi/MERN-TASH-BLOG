# 🌟 MERN Blog Template  

A **MERN (MongoDB, Express, React, Node.js)** blog template designed to serve as a starting point for creating dynamic blogs. This template provides essential features and a clean structure, making it easy to extend and customize.  

## 🚀 Features  

### 🖥️ Backend:  
- ⚡ **Node.js** with **Express** for building RESTful APIs.  
- 📂 **MongoDB** for database management, with **Mongoose** for schema modeling.  
- 🔐 **JWT Authentication** for secure user login and session management.  

### 🎨 Frontend:  
- ⚛️ **React** for building the user interface.  
- 🛠️ **Redux Toolkit** for state management.  
- 🎨 **Tailwind CSS** for responsive and modern styling.  
- 🧭 **React Router DOM** for dynamic navigation.  
- ☁️ **Firebase** integration for file uploads and saving posts.  
- ✍️ Rich text editing with `react-quill`.  
- 🕒 Additional libraries: `moment` for date handling, `react-icons` for beautiful icons.  

## 🛠️ Installation  

1. Clone the Repository 
```bash  
git clone --branch MERN-BLOG-TEMPLATE https://github.com/MosheShlomi/MERN-TASH-BLOG.git  
cd MERN-TASH-BLOG  
```

2. Install dependencies

```bash
npm install
```

Run it also in client directory.

3. Create a .env file in the root directory and add the following

```bash
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

And inside client directory also create a .env file and add the following

```bash
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
```

4. Start the backend server:

```bash
npm run dev
```

Start the frontend inside client directory:

```bash
npm run dev
```