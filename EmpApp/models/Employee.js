const mongoose = require("mongoose")

// Mongoose Schema and Model
const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    department: String,
    startDate: Date,
    jobTitle: String,
    salary: Number
},{ versionKey: false } // Disables the `__v` field
)

module.exports = mongoose.model("Employee", employeeSchema, "ouremployees")
