
const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// 1. CREATE a student
router.post("/", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            message: "Student created successfully",
            student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A student with this email already exists"
            });
        }

        res.status(400).json({
            message: error.message
        });
    }
});

// 2. GET all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json({
            count: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. GET one student by ID
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Invalid student ID"
        });
    }
});

// 4. UPDATE a student
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already belongs to another student"
            });
        }

        res.status(400).json({
            message: error.message
        });
    }
});

// 5. DELETE a student
router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid student ID"
        });
    }
});

module.exports = router;
