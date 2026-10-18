
const express = require("express");
const router = express.Router();

const Course = require("../models/Course");

// 1. CREATE a course
router.post("/", async (req, res) => {
    try {
        const course = await Course.create(req.body);

        res.status(201).json({
            message: "Course created successfully",
            course
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 2. GET all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            count: courses.length,
            courses
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. GET a single course by ID
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({
            message: "Invalid course ID"
        });
    }
});

// 4. UPDATE a course
router.put("/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            message: "Course updated successfully",
            course
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 5. DELETE a course
router.delete("/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid course ID"
        });
    }
});

module.exports = router;
