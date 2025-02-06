# Tash Blog

## 📜 Overview

The **Tash Blog** is a community-driven blog designed to provide essential information and updates for soldiers in the IDF regarding **Tash (ת"ש)** benefits. This platform allows users to access guides, tips, and the latest regulations while also contributing their own knowledge and experiences. 

The blog creates a space where soldiers can support one another by sharing insights about rights, benefits, and challenges, especially for those in special circumstances like married soldiers.

## 🚀 Features

- **User-Generated Content**: Users can create posts, pending admin approval before publication.
- **Interactive Community**: Registered users can comment on posts and participate in discussions.
- **Like & Save Posts**: Users can like posts to highlight valuable information.
- **Up-to-Date Information**: The blog covers topics such as:
  - Soldier rights and Tash conditions
  - Updates on new laws and regulations
  - Useful tips for navigating military life
- **Dashboard for Users & Admins**:
  - Each user has a **personal dashboard** to track and manage their posts.
  - **Admins** have access to a dashboard for managing all posts and viewing platform statistics.
- **Email Notifications**: Integrated **Formspree** to allow users to send emails directly from the blog.


## 🛠️ Built With

### **Backend**
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
### **Frontend**
- **Library**: [React](https://reactjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Rich Text Editing**: [React Quill](https://www.npmjs.com/package/react-quill)
- **UI Components**: [Flowbite React](https://flowbite-react.com/)

## 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MosheShlomi/MERN-TASH-BLOG.git
   cd MERN-TASH-BLOG
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
    ```

3. **Set Up Firebase**: 
   Create a .env file in the project root and add your config keys:
   ```
    MONGO_URL=mongodb+srv://<your_mongo_url>
    JWT_SECRET=<your_jwt_secret>
    VITE_FIREBASE_API_KEY=<your_firebase_key>
    VITE_FORMSPREE_ID=<your_formspree_id>
   ```

5. **Run the Development Backend**:
   ```bash
   npm run dev
   ```

6. **Run the Development Frontend**:
   ```bash
   cd client && npm run dev
   ```

## 🌐 Live Demo

Check out the live demo on the internet - [Tash Blog](https://tash-blog.com/) or just search **תש בלוג** in Google.
