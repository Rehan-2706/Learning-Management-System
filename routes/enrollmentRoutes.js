
const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

// 1. CREATE an enrollment
router.post("/", async (req, res) => {
    try {
        const { student, course } = req.body;

        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const enrollment = await Enrollment.create({
            student,
            course
        });

        res.status(201).json({
            message: "Student enrolled successfully",
            enrollment
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Student is already enrolled in this course"
            });
        }

        res.status(400).json({
            message: error.message
        });
    }
});

// 2. GET all enrollments
router.get("/", async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name email")
            .populate("course", "title");

        res.status(200).json({
            count: enrollments.length,
            enrollments
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. GET one enrollment by ID
router.get("/:id", async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate("student", "name email")
            .populate("course", "title");

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json(enrollment);
    } catch (error) {
        res.status(400).json({
            message: "Invalid enrollment ID"
        });
    }
});

// 4. UPDATE enrollment status
router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["active", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid enrollment status"
            });
        }

        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json({
            message: "Enrollment status updated successfully",
            enrollment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 5. DELETE an enrollment
router.delete("/:id", async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(
            req.params.id
        );

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment not found"
            });
        }

        res.status(200).json({
            message: "Enrollment deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid enrollment ID"
        });
    }
});

// 6. GET enrollments for one student
router.get("/student/:studentId", async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.params.studentId
        }).populate("course", "title category");

        res.status(200).json({
            count: enrollments.length,
            enrollments
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid student ID"
        });
    }
});

module.exports = router;
