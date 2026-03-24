import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Mycourse() {
  const navigate = useNavigate();

  // For Testing
  const courses = [
    {
      id: 1,
      name: "Python",
      summary: "Learn Python Basics",
    },
    {
      id: 2,
      name: "JavaScript",
      summary: "Learn JS Fundamentals",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((course) =>
    `${course.name} ${course.summary}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 px-4 py-2 border rounded-xl"
      />

      {filteredCourses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/student/course/${course.id}`)}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-lg font-semibold mb-2">{course.name}</h2>

              <p className="text-gray-600 text-sm">{course.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Mycourse;
