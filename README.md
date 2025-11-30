Project Name: TaskFlow - 任務管理系統
Group Number: Three81
Group Members:

chui tsz nok (13428724)
13685544

Project Overview

This is a task management system developed using Node.js + Express, including user registration/login, task CRUD operations, an API interface, and an administrator panel (admin account only).

The system uses MongoDB Atlas as its database and is deployed on the Render free tier.

Each user can only manage their own tasks; the administrator can view/delete/reset all users.

1. Using a browser (front-end interface)

Login/Register: Access https://three81-0jmu.onrender.com/auth/login or /auth/register.

Task Management: After logging in, you will be automatically redirected to /tasks, where you can add/edit/delete/search tasks.

Change Password: After logging in, access /auth/change-password.

Admin Panel (admin only): After logging in as admin, access /admin to manage all users (delete, reset passwords, add users).


2. Use via API (using cURL, login required).

Wake up and log in (generates cookie.txt)
curl -c cookie.txt -X POST https://three81-0inu.onrender.com/auth/login -d "username=admin&password=noknok"


Create a new task
curl -b cookie.txt -X POST https://three81-0inu.onrender.com/api/tasks
 -H "Content-Type: application/json" 
 -d "{\"title\":\"Render 醒來測試\",\"status\":\"completed\",\"priority\":\"high\"}"


Update a task (replace :id with the actual task ID)
curl -b cookie.txt -X PUT https://three81-0jmu.onrender.com/api/tasks/:id 
  -H "Content-Type: application/json" 
  -d "{\"title\":\"更新標題\",\"status\":\"in-progress\"}"

  
curl -b cookie.txt -X DELETE https://three81-0inu.onrender.com/api/tasks/:id


Test account (Please use this account to log in)

Username: admin
Password: noknok


Project File Structure Description
Files/Folders: Function Description

server.js, Main Program: Sets up Express, connects to MongoDB, loads middleware (JSON/URL parsing, Session), defines routes (auth/tasks/api/admin), handles homepage/404 errors, starts the server. Includes console logs related to Render wake-up.

package.json, Project Information and Dependencies: bcrypt (password encryption), cookie-session (session management), dotenv (environment variables), ejs (template engine), express (framework), mongoose (MongoDB ORM). devDependencies: nodemon (hot reloading for development). Scripts: start/dev.

package-lock.json, Locks all dependency versions (automatically generated) to ensure consistent installation.

routes/,

Route Separation:

• auth.js: Handles login/registration/password change/logout.

• tasks.js: Task CRUD (list/add/edit/delete/search), login required.

• api.js: RESTful API (GET/POST/PUT/DELETE tasks), login required.

• admin.js: Administrator route (user management/delete/reset password/add), accessible only to admin.

views/,

EJS Templates:

• login.ejs: Login page.

• register.ejs: Registration page.

• change-password.ejs: Password change page.

• new.ejs: Add task page.

• edit.ejs: Edit task page.

• index.ejs: Task list page (containing search/action buttons).

models/,:

Mongoose Models:

• Task.js: Task structure (title/description/status/priority/owner/createdAt).

• User.js: User structure (username/password), including bcrypt encryption and comparison methods.

.env: Environment variables (not included in the submission): MONGODB_URI, SESSION_SECRET, PORT, etc.

Deployment Information

Platform: Render Web Service (Free Layer)
Website: https://three81-0jmu.onrender.com
Repository: MongoDB Atlas
Homepage: After entering the website, you will be redirected to the login page. After logging in, the task list will be displayed.
