# Learning Management System (LMS)

A web-based Learning Management System built using **HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB Atlas**. The application allows users to manage courses, students, lessons, and course enrollments through a simple dashboard.

## Features

- **Course Management:** Create, view, update, and delete courses.
- **Student Management:** Register students, view student records, update details, and delete students.
- **Lesson Management:** Create and manage lessons associated with courses.
- **Enrollment Management:** Enroll students in courses and view enrollment records.
- **Enrollment Status:** Update an enrollment's status to active, completed, or cancelled.
- **MongoDB Integration:** Store and retrieve application data using MongoDB Atlas.
- **REST API:** Communicate between the frontend and backend using HTTP requests.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structures the web pages |
| CSS3 | Styles the dashboard, forms, and tables |
| JavaScript | Handles frontend interactions and API requests |
| Node.js | Runs the backend JavaScript environment |
| Express.js | Creates and manages backend API routes |
| MongoDB Atlas | Cloud database for application data |
| Mongoose | Defines schemas and interacts with MongoDB |
| Git and GitHub | Version control and project hosting |

## Project Structure

```text
lms-project/
├── config/
│   └── db.js
├── models/
│   ├── Course.js
│   ├── Student.js
│   ├── Lesson.js
│   └── Enrollment.js
├── routes/
│   ├── courseRoutes.js
│   ├── studentRoutes.js
│   ├── lessonRoutes.js
│   └── enrollmentRoutes.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

*Note: This represents the intended structure. Keep only the files and folders that exist in your actual project.*

## Prerequisites

Install the following before running the application:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account
- Git, if you want to clone or contribute to the repository

## Installation and Setup

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPOSITORY` with your repository name.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Alternatively, download the repository and open the project folder in VS Code.

### 2. Install dependencies

Run the following command in the project root:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root if it does not already exist.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the placeholder with your MongoDB Atlas connection string. Do not commit the `.env` file or expose database credentials.

### 4. Start the application

Use the startup command configured in your `package.json`. If the project uses `server.js` directly, run:

```bash
node server.js
```

If a suitable `start` script is configured, you can instead run:

```bash
npm start
```

### 5. Open the application

Visit the following URL in your browser:

```text
http://localhost:5000
```

The Express server should serve the frontend and handle API requests.

## API Endpoints

The backend provides API endpoints for four main resources.

### Courses

Base URL: `/api/courses`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/courses` | Create a course |
| GET | `/api/courses` | Retrieve all courses |
| GET | `/api/courses/:id` | Retrieve a course by ID |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

### Students

Base URL: `/api/students`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Register a student |
| GET | `/api/students` | Retrieve all students |
| GET | `/api/students/:id` | Retrieve a student by ID |
| PUT | `/api/students/:id` | Update student details |
| DELETE | `/api/students/:id` | Delete a student |

### Lessons

Base URL: `/api/lessons`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/lessons` | Create a lesson |
| GET | `/api/lessons` | Retrieve all lessons |
| GET | `/api/lessons/course/:courseId` | Retrieve lessons for a course |
| GET | `/api/lessons/:id` | Retrieve a lesson by ID |
| PUT | `/api/lessons/:id` | Update a lesson |
| DELETE | `/api/lessons/:id` | Delete a lesson |

### Enrollments

Base URL: `/api/enrollments`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/enrollments` | Enroll a student in a course |
| GET | `/api/enrollments` | Retrieve all enrollments |
| GET | `/api/enrollments/:id` | Retrieve an enrollment by ID |
| PUT | `/api/enrollments/:id` | Update enrollment status |
| DELETE | `/api/enrollments/:id` | Delete an enrollment |
| GET | `/api/enrollments/student/:studentId` | Retrieve enrollments for a student |

*The endpoint list reflects the planned/currently discussed API structure. Verify the actual route files before publishing this list as a definitive inventory.*

## Database Models

The application uses Mongoose models to structure the data stored in MongoDB.

- **Course:** Stores course information, such as title, description, instructor, category, price, and duration.
- **Student:** Stores student information, such as name, email, phone number, and department.
- **Lesson:** Stores lesson details and associates lessons with courses.
- **Enrollment:** Associates students with courses and tracks enrollment status.

## How It Works

1. A user interacts with the dashboard in the browser.
2. Frontend JavaScript sends HTTP requests using `fetch()`.
3. Express.js receives the requests through the relevant API routes.
4. Mongoose interacts with MongoDB Atlas to create, retrieve, update, or delete records.
5. The backend returns a response, and the frontend updates the displayed information.

## Security Notes

- Keep database credentials and other secrets in `.env`.
- Never commit `.env` to GitHub.
- Keep `node_modules/` out of version control.
- Configure MongoDB Atlas network access carefully.
- Validate incoming data on the backend before saving it to the database.

## Future Enhancements

Potential improvements include:

- Student learning progress tracking
- Course reviews and ratings
- Dashboard analytics
- Course search, filtering, and pagination
- Authentication and role-based access control

These are planned enhancements and are not claimed as implemented features.

## Learning Objectives

This project provides practical experience with:

- Building REST APIs using Express.js
- Performing CRUD operations
- Designing MongoDB collections and Mongoose schemas
- Connecting a frontend to a backend
- Managing application configuration with environment variables
- Using Git and GitHub for version control

## Author

**Your Name**

GitHub: `https://github.com/YOUR_USERNAME`

---

*Developed as a learning project to practise full-stack web development and database integration.*
