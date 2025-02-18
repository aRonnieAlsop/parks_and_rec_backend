# Parks & Rec Backend 🏞

This repository contains the backend for the 🏸 Parks & Recreation ⚽︎ application, built using **Express.js** and **SQLite3**. The backend handles database interactions for both **public users** and **administrative users**, allowing them to make requests to fetch, add, and modify program data.

## Features
- 🏕 **Public User Access**: Users can sign up for and pay for programs.
- ⚷ **Admin User Access**: Admins can manage programs and view participant rosters.
- 🖼 **Image Upload Support**: Admins can upload images for programs.
- ⚡︎ **RESTful API**: Provides endpoints for querying and managing data.
- 🗂 **SQLite3 Database**: Lightweight and easy to manage.
- 🔗 **CORS Enabled**: Allows frontend applications to interact with the backend.

## 🔧 How It Works
The **public user** and **administrative user** applications interact with this backend via API requests:

### **Public User Application**
- Can send **GET** requests to view available programs.
- Can send **POST** requests to sign up for a program and submit payment.
- Upon successful signup, the user will be added to a **program roster**.

### **Administrative User Application**
- Can send **GET, POST, PUT, and DELETE** requests.
- Can **add, update, or remove programs**.
- Can **view participant rosters** for each program.
- Can **upload images** for programs.
- Has limited access to user data to **protect privacy** while allowing program management.

## 📂 Image Uploads (Multer)
This backend includes **image upload functionality** using [Multer](https://www.npmjs.com/package/multer), a middleware for handling file uploads in **Express.js**.  
- **Admins** can upload program images, which are stored locally in the `uploads/` folder.
- Images can be retrieved via a public endpoint and displayed on the **public user site**.

### **Why Multer?**
- 📂 **Handles file uploads easily**  
- 🛠 **Supports storage configuration**  
- 🚀 **Lightweight and efficient for Express apps**  

## 🔧 Scalability Considerations
This project currently uses **SQLite3** for its database, which is ideal for local development and small-scale applications due to its simplicity and ease of use. However, for **real-world deployment** handling **multiple concurrent users**, it would be necessary to migrate to a **more scalable database** such as:

- **PostgreSQL** – Great for structured data with strong relational capabilities.
- **MySQL** – A widely used relational database with high scalability.
- **MongoDB** – A NoSQL option for applications needing flexibility in data storage.
- **Firebase Firestore** – A cloud-based solution with real-time syncing for dynamic applications.

## 🔗 Related Repositories
- 🛠 **Admin User Frontend**: [GitHub - aRonnieAlsop/admin_user_parks_-_rec](https://github.com/aRonnieAlsop/admin_user_parks_-_rec)  
  The **admin user application** interacts with this backend, allowing management of programs, including **adding, updating, deleting, and uploading images**.

## 🛠 Setup
To run the server locally:
```sh
git clone https://github.com/aRonnieAlsop/parks_and_rec_backend.git
cd parks_and_rec_backend
npm install
npm run dev
