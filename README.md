# Employee CRUD Application
This repository contains my current class work and assignments for Open Source Web Development

Inside this repo is the project EmpApp. The project is a sample CRUD (Create, Read, Update, Delete) application designed to manage employee data. It allows users to register, log in, and log out, and provides functionality to add, view, update, and delete employee records.

The application features protected routes and basic error/field validation for a better user experience.

## Project Features

### User Authentication:

User registration and login functionality.
Secure password hashing with bcrypt.
Sessions for maintaining login state (using express-session or JSON Web Tokens (JWT)).
Logout functionality.

### Employee Management:

Add, view, update, and delete employee records.
Employee data is stored in a MongoDB database via Mongoose.
Protected Routes:

Certain routes (such as adding, updating, and deleting employee records) are protected and require the user to be logged in.

### Field and Error Validation:

Basic field and error validation are implemented to ensure the data is properly handled.

## Technologies Used

### Backend:

Node.js.
Express.js.

### Database:

MongoDB (Mongoose for data modeling).

### Authentication:

bcrypt for password hashing.
express-session or JSON Web Tokens (JWT) for session management.

### Templating Engine:

Handlebars for rendering views.

## Project Setup:

Run the command npm install to download all dependecies.

Run nodemon app.js to start the application.

Visit [localhost:3000](http://localhost:3000/)

Navbar/header dynamically changes based on whether the user is logged in or out.

Login page to login.

Register page to register a new user. Usernames and Emails can not be duplicates. Basic field validation from W4 Class.

Upon logging in, the user can start adding employees by navigating to add employee, or view all employees with View Employees.

Delete and update features available from view employees.

Logout only available at dashboard I didn't feel like adding it to header even though it would have taken like 30 seconds.