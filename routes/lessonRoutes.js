
const express = require("express");
const router = express.Router();

const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// 1. CREATE a lesson
router.post("/", async (req, res) => {
    try {
        const { title, content, videoUrl, order, course } = req.body;

        const courseExists = await Course.findById(course);

        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const lesson = await Lesson.create({
            title,
            content,
            videoUrl,
            order,
            course
        });

        res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 2. GET all lessons
router.get("/", async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .populate("course", "title");

        res.status(200).json({
            count: lessons.length,
            lessons
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 3. GET lessons for a specific course
router.get("/course/:courseId", async (req, res) => {
    try {
        const lessons = await Lesson.find({
            course: req.params.courseId
        }).sort({ order: 1 });

        res.status(200).json({
            count: lessons.length,
            lessons
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid course ID"
        });
    }
});

// 4. GET one lesson
router.get("/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
            .populate("course", "title");

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({
            message: "Invalid lesson ID"
        });
    }
});

// 5. UPDATE a lesson
router.put("/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 6. DELETE a lesson
router.delete("/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(
            req.params.id
        );

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            message: "Lesson deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid lesson ID"
        });
    }
});

module.exports = router;
