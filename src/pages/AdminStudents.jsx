import React, { useState } from "react";

function AdminStudents() {
    const [students] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", courses: 3, status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", courses: 2, status: "Active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", courses: 4, status: "Inactive" },
        { id: 4, name: "Alice Williams", email: "alice@example.com", courses: 1, status: "Active" },
    ]);

    return (
        <div className="w-full h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Students</h1>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Add New Student
                    </button>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Courses Enrolled
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                                    <td className="px-6 py-4 text-gray-600 text-center">
                                        {student.courses}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${student.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 mr-4">
                                            Edit
                                        </button>
                                        <button className="text-red-600 hover:text-red-800">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminStudents;
