const express = require("express")
const router = express.Router()
const Employee = require("../models/Employee")
const {isAuthenticated} = require("./auth"); // Import our authentication routes

// Get Route
router.get("/employees", isAuthenticated, async (req,res) => {
    try{
        const employees = await Employee.find().lean();
        res.render("viewemployee", { employees });
        // res.json(employees)
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch employee data"})
    }
})

// Post routes
router.get("/addemployee", isAuthenticated, (req,res) => {
    res.render("addemployeepage", {
        title:"Welcome to the Handlbars Employee CRUD Site",
        message:"Please add a new employee"
    })
})

router.post("/addemployee", isAuthenticated, async (req,res)=>{
    try{
        const newEmp = new Employee(req.body)
        const savedEmployee = await newEmp.save()
        res.redirect("/employees")
    }
    catch(err){
        res.status(500).json({error: "Failed to post employee data"})
    }
})

// Put Routes
router.get("/updateview", isAuthenticated, async (req,res) =>{
    const employeeid = req.query.id
    const employee = await Employee.findById(employeeid).lean()
    if(!employee){
        return res.status(404).json({error: "Failed to find the employee"})
    }
    // Need to convert startDate to a string so that the field can populate (date html field expects string for value and will bitch if you give a data value)
    employee.startDate = (employee.startDate).toISOString().split('T')[0];
    // console.log(employee.startDate)
    
    res.render("updateemployee", { employee })
})

// route for updating a submitted employee
router.put("/updateemployeesubmit", isAuthenticated, (req,res)=>{
    Employee.findByIdAndUpdate(req.query.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedEmployee)=>{
        if(!updatedEmployee){
            return res.status(404).json({error:"Employee not found"})   
        }
        res.redirect("/employees")
    }).catch((err)=>{
        return res.status(400).json({error:"Failed to update employee"})   
    })
})

// DELETE route
router.delete("/delete", isAuthenticated, async (req,res)=>{
    try{
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

module.exports = router