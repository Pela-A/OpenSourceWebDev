# Employee CRUD Application
This repository contains my current class work and assignments for Open Source Web Development


Inside this repo is the project EmpApp. The project is a sample CRUD (Create, Read, Update, Delete) application designed to manage employee data. It allows users to register, log in, and log out, and provides functionality to add, view, update, and delete employee records.

The application features protected routes and basic error/field validation for a better user experience.

This was built for the

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

Node.js
Express.js

### Database:

MongoDB (Mongoose for data modeling)

### Authentication:

bcrypt for password hashing
express-session or JSON Web Tokens (JWT) for session management

### Templating Engine:

Handlebars for rendering views