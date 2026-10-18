const endpoints = {
    courses: "/api/courses",
    lessons: "/api/lessons",
    students: "/api/students",
    enrollments: "/api/enrollments"
};

const titles = {
    courses: "Courses",
    lessons: "Lessons",
    students: "Students",
    enrollments: "Enrollments"
};

document.addEventListener("DOMContentLoaded", () => {
    showSection("courses");
});

// ---------------- COMMON FUNCTIONS ----------------

async function requestJSON(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { message: text || "Unexpected server response." };
    }

    if (!response.ok) {
        throw new Error(
            data.message || data.error || `Request failed (${response.status}).`
        );
    }

    return data;
}

function getItems(data, section) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[section])) return data[section];
    if (Array.isArray(data?.data)) return data.data;
    return [];
}

function unwrapItem(data, key) {
    return data?.[key] || data?.data || data;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getDisplayName(item, section) {
    if (section === "enrollments") {
        const student = item.student;
        const course = item.course;

        const studentName =
            typeof student === "object" ? student?.name : "Unknown student";

        const courseName =
            typeof course === "object" ? course?.title : "Unknown course";

        return `${studentName || "Unknown student"} — ${courseName || "Unknown course"}`;
    }

    if (section === "lessons") {
        return item.title || "Untitled lesson";
    }

    return item.title || item.name || "Untitled";
}

function getExtra(item, section) {
    if (section === "courses") return item.category || "";
    if (section === "students") return item.email || "";

    if (section === "lessons") {
        return item.course?.title || item.courseTitle || "Course not available";
    }

    if (section === "enrollments") {
        return item.status || "active";
    }

    return "";
}

function getExtraHeading(section) {
    if (section === "courses") return "Category";
    if (section === "students") return "Email";
    if (section === "lessons") return "Course";
    return "Status";
}

function hasActions(section) {
    return ["courses", "students", "lessons", "enrollments"].includes(section);
}

// ---------------- DISPLAY MODULES ----------------

async function showSection(section) {
    const content = document.getElementById("content");

    if (!content || !endpoints[section]) return;

    content.innerHTML = `
        <h2>${titles[section]}</h2>
        <p>Loading...</p>
    `;

    try {
        const data = await requestJSON(endpoints[section]);
        const items = getItems(data, section);

        if (!items.length) {
            content.innerHTML = `
                <div class="section-heading">
                    <h2>${titles[section]}</h2>
                    <button type="button"
                        onclick="showForm('${section}')">
                        Add New
                    </button>
                </div>
                <p>No ${titles[section].toLowerCase()} found.</p>
            `;
            return;
        }

        const rows = items.map(item => {
            const id = String(item._id || item.id || "");
            const safeId = escapeHTML(id);
            const name = getDisplayName(item, section);
            const extra = getExtra(item, section);

            let actions = "";

            if (section === "courses") {
                actions = `
                    <button type="button" class="edit-button"
                        onclick="editCourse('${safeId}')">
                        Edit
                    </button>

                    <button type="button" class="delete-button"
                        onclick="deleteCourse('${safeId}')">
                        Delete
                    </button>
                `;
            }

            if (section === "students") {
                actions = `
                    <button type="button" class="edit-button"
                        onclick="editStudent('${safeId}')">
                        Edit
                    </button>

                    <button type="button" class="delete-button"
                        onclick="deleteStudent('${safeId}')">
                        Delete
                    </button>
                `;
            }

            if (section === "lessons") {
                actions = `
                    <button type="button" class="edit-button"
                        onclick="editLesson('${safeId}')">
                        Edit
                    </button>

                    <button type="button" class="delete-button"
                        onclick="deleteLesson('${safeId}')">
                        Delete
                    </button>
                `;
            }

            if (section === "enrollments") {
                const status = [
                    "active",
                    "completed",
                    "cancelled"
                ].includes(item.status) ? item.status : "active";

                actions = `
                    <select id="status-${safeId}"
                        aria-label="Enrollment status">
                        <option value="active"
                            ${status === "active" ? "selected" : ""}>
                            Active
                        </option>

                        <option value="completed"
                            ${status === "completed" ? "selected" : ""}>
                            Completed
                        </option>

                        <option value="cancelled"
                            ${status === "cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>
                    </select>

                    <button type="button" class="edit-button"
                        onclick="updateEnrollmentStatus('${safeId}')">
                        Update Status
                    </button>

                    <button type="button" class="delete-button"
                        onclick="deleteEnrollment('${safeId}')">
                        Delete
                    </button>
                `;
            }

            return `
                <tr>
                    <td>${escapeHTML(name)}</td>
                    <td>${escapeHTML(extra)}</td>
                    <td class="id-cell">${escapeHTML(id || "N/A")}</td>

                    ${hasActions(section)
                        ? `<td class="actions-cell">${actions}</td>`
                        : ""}
                </tr>
            `;
        }).join("");

        content.innerHTML = `
            <div class="section-heading">
                <div>
                    <h2>${titles[section]}</h2>
                    <p>Total: ${items.length}</p>
                </div>

                <button type="button"
                    onclick="showForm('${section}')">
                    Add New
                </button>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name / Details</th>
                            <th>${getExtraHeading(section)}</th>
                            <th>ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>${rows}</tbody>
                </table>
            </div>

            <button type="button" class="secondary-button"
                onclick="showSection('${section}')">
                Refresh
            </button>
        `;
    } catch (error) {
        content.innerHTML = `
            <h2>${titles[section]}</h2>
            <p class="error-message">${escapeHTML(error.message)}</p>

            <button type="button"
                onclick="showSection('${section}')">
                Try Again
            </button>
        `;

        console.error(`Error loading ${section}:`, error);
    }
}

function showForm(section) {
    if (section === "courses") showCourseForm();
    else if (section === "students") showStudentForm();
    else if (section === "lessons") showLessonForm();
    else if (section === "enrollments") showEnrollmentForm();
}

// ==================================================
// COURSES
// ==================================================

function showCourseForm(course = null) {
    const content = document.getElementById("content");
    const editing = Boolean(course);

    content.innerHTML = `
        <h2>${editing ? "Edit Course" : "Add New Course"}</h2>

        <form id="courseForm">
            <label for="courseTitle">Course Title</label>
            <input id="courseTitle" name="title"
                value="${escapeHTML(course?.title || "")}" required>

            <label for="courseDescription">Description</label>
            <textarea id="courseDescription" name="description"
                required>${escapeHTML(course?.description || "")}</textarea>

            <label for="courseInstructor">Instructor</label>
            <input id="courseInstructor" name="instructor"
                value="${escapeHTML(course?.instructor || "")}" required>

            <label for="courseCategory">Category</label>
            <input id="courseCategory" name="category"
                value="${escapeHTML(course?.category || "")}" required>

            <label for="coursePrice">Price</label>
            <input id="coursePrice" name="price"
                type="number" min="0" step="any"
                value="${course?.price ?? 0}" required>

            <label for="courseDuration">Duration (hours)</label>
            <input id="courseDuration" name="duration"
                type="number" min="1" step="1"
                value="${course?.duration ?? ""}" required>

            <div class="form-actions">
                <button type="submit" id="courseSubmit">
                    ${editing ? "Update Course" : "Create Course"}
                </button>

                <button type="button" class="secondary-button"
                    onclick="showSection('courses')">
                    Cancel
                </button>
            </div>

            <p id="courseMessage" role="status"></p>
        </form>
    `;

    document.getElementById("courseForm")
        .addEventListener("submit", event => {
            if (editing) updateCourse(event, course._id);
            else createCourse(event);
        });
}

function readCourseForm(form) {
    return {
        title: form.elements.title.value.trim(),
        description: form.elements.description.value.trim(),
        instructor: form.elements.instructor.value.trim(),
        category: form.elements.category.value.trim(),
        price: Number(form.elements.price.value),
        duration: Number(form.elements.duration.value)
    };
}

function validateCourse(course, message) {
    if (
        !course.title ||
        !course.description ||
        !course.instructor ||
        !course.category ||
        !Number.isFinite(course.price) ||
        course.price < 0 ||
        !Number.isInteger(course.duration) ||
        course.duration < 1
    ) {
        message.textContent = "Please enter valid course details.";
        return false;
    }

    return true;
}

async function createCourse(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("courseMessage");
    const button = document.getElementById("courseSubmit");
    const course = readCourseForm(form);

    if (!validateCourse(course, message)) return;

    button.disabled = true;
    message.textContent = "Creating course...";

    try {
        await requestJSON(endpoints.courses, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(course)
        });

        message.textContent = "Course created successfully!";
        setTimeout(() => showSection("courses"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function editCourse(id) {
    try {
        const data = await requestJSON(
            `${endpoints.courses}/${encodeURIComponent(id)}`
        );

        const course = unwrapItem(data, "course");

        if (!course?._id) {
            throw new Error("Course not found.");
        }

        showCourseForm(course);
    } catch (error) {
        alert(`Could not open course: ${error.message}`);
    }
}

async function updateCourse(event, id) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("courseMessage");
    const button = document.getElementById("courseSubmit");
    const course = readCourseForm(form);

    if (!validateCourse(course, message)) return;

    button.disabled = true;
    message.textContent = "Updating course...";

    try {
        await requestJSON(
            `${endpoints.courses}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course)
            }
        );

        message.textContent = "Course updated successfully!";
        setTimeout(() => showSection("courses"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function deleteCourse(id) {
    if (!confirm("Delete this course? Related lessons or enrollments may remain.")) {
        return;
    }

    try {
        await requestJSON(
            `${endpoints.courses}/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        alert("Course deleted successfully.");
        showSection("courses");
    } catch (error) {
        alert(`Could not delete course: ${error.message}`);
    }
}

// ==================================================
// STUDENTS
// ==================================================

function showStudentForm(student = null) {
    const content = document.getElementById("content");
    const editing = Boolean(student);

    content.innerHTML = `
        <h2>${editing ? "Edit Student" : "Register New Student"}</h2>

        <form id="studentForm">
            <label for="studentName">Full Name</label>
            <input id="studentName" name="name"
                value="${escapeHTML(student?.name || "")}" required>

            <label for="studentEmail">Email Address</label>
            <input id="studentEmail" name="email" type="email"
                value="${escapeHTML(student?.email || "")}" required>

            <label for="studentPhone">Phone Number</label>
            <input id="studentPhone" name="phone" type="tel"
                value="${escapeHTML(student?.phone || "")}">

            <label for="studentDepartment">Department</label>
            <input id="studentDepartment" name="department"
                value="${escapeHTML(student?.department || "")}">

            <div class="form-actions">
                <button type="submit" id="studentSubmit">
                    ${editing ? "Update Student" : "Register Student"}
                </button>

                <button type="button" class="secondary-button"
                    onclick="showSection('students')">
                    Cancel
                </button>
            </div>

            <p id="studentMessage" role="status"></p>
        </form>
    `;

    document.getElementById("studentForm")
        .addEventListener("submit", event => {
            if (editing) updateStudent(event, student._id);
            else createStudent(event);
        });
}

function readStudentForm(form) {
    return {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        department: form.elements.department.value.trim()
    };
}

async function createStudent(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("studentMessage");
    const button = document.getElementById("studentSubmit");
    const student = readStudentForm(form);

    if (!student.name || !student.email) {
        message.textContent = "Name and email are required.";
        return;
    }

    button.disabled = true;
    message.textContent = "Registering student...";

    try {
        await requestJSON(endpoints.students, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        message.textContent = "Student registered successfully!";
        setTimeout(() => showSection("students"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function editStudent(id) {
    try {
        const data = await requestJSON(
            `${endpoints.students}/${encodeURIComponent(id)}`
        );

        const student = unwrapItem(data, "student");

        if (!student?._id) {
            throw new Error("Student not found.");
        }

        showStudentForm(student);
    } catch (error) {
        alert(`Could not open student: ${error.message}`);
    }
}

async function updateStudent(event, id) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("studentMessage");
    const button = document.getElementById("studentSubmit");
    const student = readStudentForm(form);

    if (!student.name || !student.email) {
        message.textContent = "Name and email are required.";
        return;
    }

    button.disabled = true;
    message.textContent = "Updating student...";

    try {
        await requestJSON(
            `${endpoints.students}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            }
        );

        message.textContent = "Student updated successfully!";
        setTimeout(() => showSection("students"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function deleteStudent(id) {
    if (!confirm("Delete this student? Their enrollments may be affected.")) {
        return;
    }

    try {
        await requestJSON(
            `${endpoints.students}/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        alert("Student deleted successfully.");
        showSection("students");
    } catch (error) {
        alert(`Could not delete student: ${error.message}`);
    }
}

// ==================================================
// LESSONS
// ==================================================

async function loadCourses() {
    const data = await requestJSON(endpoints.courses);
    return getItems(data, "courses");
}

function showLessonForm(lesson = null) {
    const content = document.getElementById("content");
    const editing = Boolean(lesson);

    content.innerHTML = `
        <h2>${editing ? "Edit Lesson" : "Add New Lesson"}</h2>

        <form id="lessonForm">
            <label for="lessonTitle">Lesson Title</label>
            <input id="lessonTitle" name="title"
                value="${escapeHTML(lesson?.title || "")}" required>

            <label for="lessonDescription">Description</label>
            <textarea id="lessonDescription" name="description"
                required>${escapeHTML(lesson?.description || "")}</textarea>

            <label for="lessonCourse">Course</label>
            <select id="lessonCourse" name="course" required>
                <option value="">Loading courses...</option>
            </select>

            <label for="lessonOrder">Lesson Order</label>
            <input id="lessonOrder" name="order" type="number"
                min="1" step="1" value="${lesson?.order ?? 1}" required>

            <label for="lessonDuration">Duration (minutes)</label>
            <input id="lessonDuration" name="duration" type="number"
                min="1" step="1" value="${lesson?.duration ?? 10}" required>

            <div class="form-actions">
                <button type="submit" id="lessonSubmit">
                    ${editing ? "Update Lesson" : "Create Lesson"}
                </button>

                <button type="button" class="secondary-button"
                    onclick="showSection('lessons')">
                    Cancel
                </button>
            </div>

            <p id="lessonMessage" role="status"></p>
        </form>
    `;

    const selectedCourse = lesson?.course?._id || lesson?.course || "";

    loadLessonCourseOptions(selectedCourse).catch(error => {
        const message = document.getElementById("lessonMessage");
        if (message) {
            message.textContent = `Could not load courses: ${error.message}`;
        }
    });

    document.getElementById("lessonForm")
        .addEventListener("submit", event => {
            if (editing) updateLesson(event, lesson._id);
            else createLesson(event);
        });
}

async function loadLessonCourseOptions(selectedCourseId = "") {
    const select = document.getElementById("lessonCourse");
    const courses = await loadCourses();

    if (!select) return;

    if (!courses.length) {
        select.innerHTML = '<option value="">Create a course first</option>';
        return;
    }

    select.innerHTML =
        '<option value="">Select a course</option>' +
        courses.map(course => `
            <option value="${escapeHTML(course._id)}"
                ${String(course._id) === String(selectedCourseId) ? "selected" : ""}>
                ${escapeHTML(course.title)}
            </option>
        `).join("");
}

function readLessonForm(form) {
    return {
        title: form.elements.title.value.trim(),
        description: form.elements.description.value.trim(),
        course: form.elements.course.value,
        order: Number(form.elements.order.value),
        duration: Number(form.elements.duration.value)
    };
}

function validateLesson(lesson, message) {
    if (
        !lesson.title ||
        !lesson.description ||
        !lesson.course ||
        !Number.isInteger(lesson.order) ||
        lesson.order < 1 ||
        !Number.isInteger(lesson.duration) ||
        lesson.duration < 1
    ) {
        message.textContent = "Please complete all lesson fields with valid values.";
        return false;
    }

    return true;
}

async function createLesson(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("lessonMessage");
    const button = document.getElementById("lessonSubmit");
    const lesson = readLessonForm(form);

    if (!validateLesson(lesson, message)) return;

    button.disabled = true;
    message.textContent = "Creating lesson...";

    try {
        await requestJSON(endpoints.lessons, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lesson)
        });

        message.textContent = "Lesson created successfully!";
        setTimeout(() => showSection("lessons"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function editLesson(id) {
    try {
        const data = await requestJSON(
            `${endpoints.lessons}/${encodeURIComponent(id)}`
        );

        const lesson = unwrapItem(data, "lesson");

        if (!lesson?._id) {
            throw new Error("Lesson not found.");
        }

        showLessonForm(lesson);
    } catch (error) {
        alert(`Could not open lesson: ${error.message}`);
    }
}

async function updateLesson(event, id) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("lessonMessage");
    const button = document.getElementById("lessonSubmit");
    const lesson = readLessonForm(form);

    if (!validateLesson(lesson, message)) return;

    button.disabled = true;
    message.textContent = "Updating lesson...";

    try {
        await requestJSON(
            `${endpoints.lessons}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lesson)
            }
        );

        message.textContent = "Lesson updated successfully!";
        setTimeout(() => showSection("lessons"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function deleteLesson(id) {
    if (!confirm("Delete this lesson?")) return;

    try {
        await requestJSON(
            `${endpoints.lessons}/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        alert("Lesson deleted successfully.");
        showSection("lessons");
    } catch (error) {
        alert(`Could not delete lesson: ${error.message}`);
    }
}

// ==================================================
// ENROLLMENTS
// ==================================================

function showEnrollmentForm() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>Enroll Student in a Course</h2>

        <form id="enrollmentForm">
            <label for="enrollmentStudent">Student</label>
            <select id="enrollmentStudent" name="student" required>
                <option value="">Loading students...</option>
            </select>

            <label for="enrollmentCourse">Course</label>
            <select id="enrollmentCourse" name="course" required>
                <option value="">Loading courses...</option>
            </select>

            <div class="form-actions">
                <button type="submit" id="enrollmentSubmit">
                    Create Enrollment
                </button>

                <button type="button" class="secondary-button"
                    onclick="showSection('enrollments')">
                    Cancel
                </button>
            </div>

            <p id="enrollmentMessage" role="status"></p>
        </form>
    `;

    loadEnrollmentOptions().catch(error => {
        const message = document.getElementById("enrollmentMessage");
        if (message) {
            message.textContent = `Could not load options: ${error.message}`;
        }
    });

    document.getElementById("enrollmentForm")
        .addEventListener("submit", createEnrollment);
}

async function loadEnrollmentOptions() {
    const [studentData, courseData] = await Promise.all([
        requestJSON(endpoints.students),
        requestJSON(endpoints.courses)
    ]);

    const students = getItems(studentData, "students");
    const courses = getItems(courseData, "courses");

    const studentSelect = document.getElementById("enrollmentStudent");
    const courseSelect = document.getElementById("enrollmentCourse");

    if (studentSelect) {
        studentSelect.innerHTML = students.length
            ? '<option value="">Select a student</option>' +
              students.map(student => `
                <option value="${escapeHTML(student._id)}">
                    ${escapeHTML(student.name)} (${escapeHTML(student.email)})
                </option>
              `).join("")
            : '<option value="">No students available — add a student first</option>';
    }

    if (courseSelect) {
        courseSelect.innerHTML = courses.length
            ? '<option value="">Select a course</option>' +
              courses.map(course => `
                <option value="${escapeHTML(course._id)}">
                    ${escapeHTML(course.title)}
                </option>
              `).join("")
            : '<option value="">No courses available — add a course first</option>';
    }
}

async function createEnrollment(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("enrollmentMessage");
    const button = document.getElementById("enrollmentSubmit");

    const enrollment = {
        student: form.elements.student.value,
        course: form.elements.course.value
    };

    if (!enrollment.student || !enrollment.course) {
        message.textContent = "Please select both a student and a course.";
        return;
    }

    button.disabled = true;
    message.textContent = "Creating enrollment...";

    try {
        await requestJSON(endpoints.enrollments, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enrollment)
        });

        message.textContent = "Enrollment created successfully!";
        setTimeout(() => showSection("enrollments"), 700);
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

async function updateEnrollmentStatus(id) {
    const select = document.getElementById(`status-${id}`);

    if (!select) {
        alert("Could not find the enrollment status selector.");
        return;
    }

    try {
        await requestJSON(
            `${endpoints.enrollments}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: select.value })
            }
        );

        alert("Enrollment status updated successfully.");
        showSection("enrollments");
    } catch (error) {
        alert(`Could not update enrollment: ${error.message}`);
    }
}

async function deleteEnrollment(id) {
    if (!confirm("Delete this enrollment?")) return;

    try {
        await requestJSON(
            `${endpoints.enrollments}/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        alert("Enrollment deleted successfully.");
        showSection("enrollments");
    } catch (error) {
        alert(`Could not delete enrollment: ${error.message}`);
    }
}