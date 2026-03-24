import React, { useState } from "react";

function AdminDashboard() {
    const [courses] = useState([
        { id: 1, name: "React Basics", instructor: "John", students: 45 },
        { id: 2, name: "JavaScript Advanced", instructor: "Jane", students: 38 },
        { id: 3, name: "Web Development", instructor: "Mike", students: 52 },
        { id: 4, name: "Node.js Mastery", instructor: "Sarah", students: 41 },
        { id: 5, name: "Database Design", instructor: "David", students: 35 },
        { id: 6, name: "CSS & Design", instructor: "Lisa", students: 48 },
        { id: 7, name: "API Development", instructor: "Tom", students: 39 },
        { id: 8, name: "Testing & QA", instructor: "Emma", students: 42 },
        { id: 9, name: "DevOps Essentials", instructor: "Chris", students: 37 },
    ]);

    const [students] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", courses: 3, status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", courses: 2, status: "Active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", courses: 4, status: "Inactive" },
        { id: 4, name: "Alice Williams", email: "alice@example.com", courses: 1, status: "Active" },
        { id: 5, name: "Charlie Brown", email: "charlie@example.com", courses: 5, status: "Active" },
        { id: 6, name: "Diana Prince", email: "diana@example.com", courses: 2, status: "Active" },
        { id: 7, name: "Ethan Hunt", email: "ethan@example.com", courses: 3, status: "Inactive" },
        { id: 8, name: "Fiona Green", email: "fiona@example.com", courses: 4, status: "Active" },
    ]);

    const totalCourses = courses.length;
    const totalStudents = students.length;
    const totalEnrollments = courses.reduce((sum, course) => sum + course.students, 0);

    return (
        <div className="w-full h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Statistics Cards */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">
                            Total Courses
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">
                            Total Students
                        </h3>
                        <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
                        <h3 className="text-gray-600 text-sm font-semibold mb-2">
                            Total Enrollments
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">{totalEnrollments}</p>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Welcome to Admin Panel
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Manage your courses, students, and monitor platform activity from
                        this dashboard.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>View and manage all courses</li>
                        <li>Monitor student progress and enrollments</li>
                        <li>Create and publish new courses</li>
                        <li>Track platform analytics</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
