const lessonRoutes = require("./routes/lessonRoutes");
const studentRoutes = require("./routes/studentRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");


dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const startServer = async () => {
    await connectDB();

    app.listen(process.env.PORT || 5000, () => {
        console.log("Server running on port 5000");
    });
};

startServer();