import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CourseView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ SAMPLE DATA (fallback)
  const sampleData = {
    id: 1,
    title: "Python Programming",
    description:
      "Learn Python from basics to advanced topics including OOP, data structures, and algorithms",
    sections: [
      {
        title: "INTRODUCTION",
        topics: [
          {
            id: 1,
            title: "Welcome to Python",
            content:
              "Python is one of the most popular programming languages in the world.",
          },
          {
            id: 2,
            title: "Installation & Setup",
            content: "Download Python from python.org and install it.",
          },
        ],
      },
      {
        title: "PYTHON BASICS",
        topics: [
          {
            id: 3,
            title: "Variables & Types",
            content: "Variables are used to store data in Python.",
          },
          {
            id: 4,
            title: "Strings",
            content: "Strings are sequences of characters.",
          },
        ],
      },
    ],
  };

  // 🔥 Fetch API
  useEffect(() => {
    fetch(`http://localhost:8000/course/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setActiveTopic(data.sections[0]?.topics[0]);
      })
      .catch((err) => {
        console.log("Using sample data 🚀", err);
        setCourse(sampleData);
        setActiveTopic(sampleData.sections[0].topics[0]);
      });
  }, [id]);

  if (!course) {
    return <p className="p-6">Loading...</p>;
  }

  // 🔍 Search filter
  const filteredSections = course.sections.map((section) => ({
    ...section,
    topics: section.topics.filter((topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="flex h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <div className="w-72 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Course Topics</h2>

        {filteredSections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xs text-gray-400 mb-2">
              {section.title}
            </h3>

            {section.topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-2 rounded-lg cursor-pointer mb-1 ${
                  activeTopic?.id === topic.id
                    ? "bg-purple-100 text-purple-600 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {topic.title}
              </div>
            ))}
          </div>
        ))}

        {/* Back */}
        <button
          onClick={() => navigate("/student")}
          className="mt-6 w-full py-2 border rounded-xl hover:bg-gray-100"
        >
          ← Back to Courses
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-sm text-gray-500">
              {course.description}
            </p>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          />
        </div>

        {/* CONTENT */}
        {activeTopic ? (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              {activeTopic.title}
            </h2>

            <p className="text-gray-600 whitespace-pre-line">
              {activeTopic.content}
            </p>
          </div>
        ) : (
          <p>Select a topic</p>
        )}
      </div>
    </div>
  );
}

export default CourseView;