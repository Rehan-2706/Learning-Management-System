const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        instructor: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            default: 0,
            min: 0
        },
        duration: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);