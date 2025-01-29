const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = 3000

// Had to add method override to perform delete as requested. Otherwise had to use an async function inside the viewemployee handlebars file
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");
app.set("views", "./views");

// Sets our static resources folder
app.use(express.static(path.join(__dirname,"public")));

// Middleware body-parser parses JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/employeelibrary"
mongoose.connect(mongoURI);
const db = mongoose.connection;

// Check for connection
db.on("error", console.error.bind(console, "MongoDB Connection Error"))
db.once("open", ()=>{
    console.log("Connected to MongoDB")
})

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
const Employee = mongoose.model("Employee", employeeSchema, "ouremployees")

// Create routes for CRUD functionality

// Post route
app.post("/addemployee", async (req,res)=>{
    try{
        const newEmp = new Employee(req.body)
        const savedEmployee = await newEmp.save()
        res.redirect("/employees")
    }
    catch(err){
        res.status(500).json({error: "Failed to post employee data"})
    }
})

// Get Route
app.get("/employees", async (req,res) => {
    try{
        const employees = await Employee.find().lean();
        res.render("viewemployee", { employees });
        // res.json(employees)
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch employee data"})
    }
})

// Put Route

// Update feature
app.get("/updateview", async (req,res) =>{
    const employeeid =req.query.id
    const employee = await Employee.findById(employeeid).lean()
    if(!employee){
        return res.status(404).json({error: "Failed to find the employee"})
    }
    // Need to convert startDate to a string so that the field can populate (date html field expects string for value and will bitch if you give a data value)
    employee.startDate = (employee.startDate).toISOString().split('T')[0];
    // console.log(employee.startDate)
    
    res.render("updateemployee", { employee })
})

app.put("/updateemployeesubmit", (req,res)=>{
    Employee.findByIdAndUpdate(req.query.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedEmployee)=>{
        if(!updatedEmployee){
            return res.status(404).json({error:"Employee not found"})   
        }
        res.json(updatedEmployee)
    }).catch((err)=>{
        return res.status(400).json({error:"Failed to update employee"})   
    })
})









// DELETE route
app.delete("/delete", async (req,res)=>{
    try{
        console.log("How about here???")
        const employeeid = req.query.id
        const employee = Employee.findById(employeeid)
        if(!employee){
            return res.status(404).json({error: "Failed to find the employee"})
        }
        const deletedEmployee = await Employee.findByIdAndDelete(employeeid)

        res.render("deleteemployee", {message:"Employee deleted"})
    }
    catch(err){
        console.error(err);
        res.status(404).json({error: "Employee not found"})
    }
})







// Index Page
app.get("/index", (req,res) => {
    console.log("starting here")
    res.render("addemployee", {
        title:"Welcome to the Handlbars Employee CRUD Site",
        message:"Please add a new employee"
    })
})

app.use((req, res) => {
    res.writeHead(301, {'Location': "http://" + req.headers['host'] + '/index' });
    res.end()
});

app.get("/nodemon",(req,res)=>{
    res.sendStatus(500);
})

// Listen to PORT
app.listen(PORT, ()=>{
    console.log("Server running on port 3000.");
})