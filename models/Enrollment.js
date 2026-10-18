
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active"
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Prevent the same student from enrolling in the same course twice.
enrollmentSchema.index(
    { student: 1, course: 1 },
    { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
