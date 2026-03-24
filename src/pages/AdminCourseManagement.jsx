import React, { useState } from "react";
import RichTextEditor from "../components/RichTextEditor";
import { useCourses } from "../context/CourseContext";

function AdminCourseManagement() {
    const { courses, setCourses } = useCourses();

    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [editingSubtopic, setEditingSubtopic] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [editAllModal, setEditAllModal] = useState(null); // For combined edit modal
    const [formData, setFormData] = useState({ name: "", description: "" });

    // Handle Course Operations
    const addCourse = () => {
        if (!formData.name) return;
        const newCourse = {
            id: Date.now(),
            name: formData.name,
            description: formData.description,
            isVisible: true,
            topics: [],
        };
        setCourses([...courses, newCourse]);
        setFormData({ name: "", description: "" });
        setShowForm(false);
    };

    const updateCourse = () => {
        setCourses(
            courses.map((c) =>
                c.id === editingCourse.id ? { ...c, name: formData.name, description: formData.description } : c
            )
        );
        setEditingCourse(null);
        setFormData({ name: "", description: "" });
    };

    const deleteCourse = (id) => {
        setCourses(courses.filter((c) => c.id !== id));
    };

    const toggleCourseVisibility = (courseId) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId ? { ...c, isVisible: !c.isVisible } : c
            )
        );
    };

    // Handle Topic Operations
    const addTopic = (courseId) => {
        if (!formData.name) return;
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: [
                            ...c.topics,
                            {
                                id: Date.now(),
                                name: formData.name,
                                isVisible: true,
                                subtopics: [],
                            },
                        ],
                    }
                    : c
            )
        );
        setFormData({ name: "", description: "" });
        setShowForm(false);
    };

    const updateTopic = (courseId) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: c.topics.map((t) =>
                            t.id === editingTopic.id ? { ...t, name: formData.name } : t
                        ),
                    }
                    : c
            )
        );
        setEditingTopic(null);
        setFormData({ name: "", description: "" });
    };

    const deleteTopic = (courseId, topicId) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? { ...c, topics: c.topics.filter((t) => t.id !== topicId) }
                    : c
            )
        );
    };

    const toggleTopicVisibility = (courseId, topicId) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: c.topics.map((t) =>
                            t.id === topicId ? { ...t, isVisible: !t.isVisible } : t
                        ),
                    }
                    : c
            )
        );
    };

    // Handle Subtopic Operations
    const addSubtopic = (courseId, topicId) => {
        if (!formData.name) return;
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: c.topics.map((t) =>
                            t.id === topicId
                                ? {
                                    ...t,
                                    subtopics: [
                                        ...t.subtopics,
                                        {
                                            id: Date.now(),
                                            name: formData.name,
                                            content: "",
                                            isVisible: true,
                                        },
                                    ],
                                }
                                : t
                        ),
                    }
                    : c
            )
        );
        setFormData({ name: "", description: "" });
        setShowForm(false);
    };

    const updateSubtopicFull = (courseId, topicId, subtopicId, updates) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: c.topics.map((t) =>
                            t.id === topicId
                                ? {
                                    ...t,
                                    subtopics: t.subtopics.map((st) =>
                                        st.id === subtopicId ? { ...st, ...updates } : st
                                    ),
                                }
                                : t
                        ),
                    }
                    : c
            )
        );
    };

    const deleteSubtopic = (courseId, topicId, subtopicId) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: c.topics.map((t) =>
                            t.id === topicId
                                ? {
                                    ...t,
                                    subtopics: t.subtopics.filter((st) => st.id !== subtopicId),
                                }
                                : t
                        ),
                    }
                    : c
            )
        );
    };

    const toggleSubtopicVisibility = (courseId, topicId, subtopicId) => {
        setCourses(
            courses.map((c) =>
                c.id === courseId
                    ? {
                        ...c,
                        topics: c.topics.map((t) =>
                            t.id === topicId
                                ? {
                                    ...t,
                                    subtopics: t.subtopics.map((st) =>
                                        st.id === subtopicId ? { ...st, isVisible: !st.isVisible } : st
                                    ),
                                }
                                : t
                        ),
                    }
                    : c
            )
        );
    };

    return (
        <div className="w-full bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Course Management</h1>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingCourse(null);
                            setEditingTopic(null);
                            setSelectedCourse(null);
                            setSelectedTopic(null);
                            setFormData({ name: "", description: "" });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        + Add New Course
                    </button>
                </div>

                {/* Add/Edit Course Form */}
                {showForm && !selectedCourse && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingCourse ? "Edit Course" : "Add New Course"}
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Course Description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={editingCourse ? updateCourse : addCourse}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                                >
                                    {editingCourse ? "Update Course" : "Create Course"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingCourse(null);
                                        setFormData({ name: "", description: "" });
                                    }}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses List */}
                <div className="space-y-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2" style={{ borderColor: course.isVisible ? '#3b82f6' : '#d1d5db' }}>
                            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                                <div className="cursor-pointer flex-1" onClick={() => setSelectedCourse(course)}>
                                    <h2 className="text-2xl font-bold">{course.name}</h2>
                                    <p className="text-blue-100">{course.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleCourseVisibility(course.id)}
                                        className={`px-3 py-1 rounded text-sm font-semibold ${course.isVisible
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-500 hover:bg-gray-600"
                                            } text-white`}
                                        title={course.isVisible ? "Hide Course" : "Show Course"}
                                    >
                                        {course.isVisible ? "&#128065; Visible" : "&#128683; Hidden"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingCourse(course);
                                            setFormData({ name: course.name, description: course.description });
                                            setShowForm(true);
                                        }}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                    >
                                        &#9999; Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCourse(course.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    >
                                        &#128465; Delete
                                    </button>
                                </div>
                            </div>

                            {/* Topics List */}
                            {selectedCourse?.id === course.id && (
                                <div className="p-6 bg-gray-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold">Topics</h3>
                                        <button
                                            onClick={() => {
                                                setShowForm(true);
                                                setSelectedTopic(null);
                                                setFormData({ name: "", description: "" });
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                        >
                                            + Add Topic
                                        </button>
                                    </div>

                                    {/* Add Topic Form */}
                                    {showForm && !selectedTopic && (
                                        <div className="bg-white p-4 rounded-lg mb-4 border-l-4 border-green-600">
                                            <input
                                                type="text"
                                                placeholder="Topic Name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                className="w-full px-4 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={
                                                        editingTopic
                                                            ? () => updateTopic(course.id)
                                                            : () => addTopic(course.id)
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                                >
                                                    {editingTopic ? "Update" : "Add"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowForm(false);
                                                        setEditingTopic(null);
                                                        setFormData({ name: "", description: "" });
                                                    }}
                                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {course.topics.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className="bg-white rounded-lg border border-gray-300 overflow-hidden"
                                            style={{ borderLeft: topic.isVisible ? '4px solid #6366f1' : '4px solid #d1d5db' }}
                                        >
                                            <div className="bg-indigo-500 text-white p-3 flex justify-between items-center">
                                                <div
                                                    className="cursor-pointer flex-1"
                                                    onClick={() => setSelectedTopic(topic)}
                                                >
                                                    <h4 className="font-bold">{topic.name}</h4>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleTopicVisibility(course.id, topic.id)}
                                                        className={`px-2 py-1 rounded text-sm font-semibold ${topic.isVisible
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : "bg-gray-500 hover:bg-gray-600"
                                                            } text-white`}
                                                        title={topic.isVisible ? "Hide Topic" : "Show Topic"}
                                                    >
                                                        {topic.isVisible ? "&#128065;" : "&#128683;"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingTopic(topic);
                                                            setFormData({ name: topic.name, description: "" });
                                                            setShowForm(true);
                                                        }}
                                                        className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-sm"
                                                    >
                                                        &#9999;
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTopic(course.id, topic.id)}
                                                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
                                                    >
                                                        &#128465;
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtopics */}
                                            {selectedTopic?.id === topic.id && (
                                                <div className="p-4 bg-gray-50">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h5 className="font-bold text-gray-700">Subtopics</h5>
                                                        <button
                                                            onClick={() => {
                                                                setShowForm(true);
                                                                setEditingSubtopic(null);
                                                                setFormData({ name: "", description: "" });
                                                            }}
                                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            + Add Subtopic
                                                        </button>
                                                    </div>

                                                    {/* Add Subtopic Form */}
                                                    {showForm && selectedTopic?.id === topic.id && (
                                                        <div className="bg-white p-3 rounded-lg mb-3 border-l-4 border-purple-600">
                                                            <input
                                                                type="text"
                                                                placeholder="Subtopic Name"
                                                                value={formData.name}
                                                                onChange={(e) =>
                                                                    setFormData({
                                                                        ...formData,
                                                                        name: e.target.value,
                                                                    })
                                                                }
                                                                className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        addSubtopic(course.id, topic.id)
                                                                    }
                                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Add
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setShowForm(false);
                                                                        setFormData({
                                                                            name: "",
                                                                            description: "",
                                                                        });
                                                                    }}
                                                                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Subtopics List */}
                                                    <div className="space-y-3">
                                                        {topic.subtopics.map((subtopic) => (
                                                            <div
                                                                key={subtopic.id}
                                                                className="bg-white p-3 rounded border-l-4"
                                                                style={{ borderColor: subtopic.isVisible ? '#8b5cf6' : '#d1d5db' }}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <h6 className="font-semibold text-gray-800">
                                                                            {subtopic.name}
                                                                        </h6>
                                                                        {subtopic.content && (
                                                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                                {subtopic.content.substring(0, 100)}...
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-2 ml-4">
                                                                        <button
                                                                            onClick={() =>
                                                                                setEditAllModal({
                                                                                    courseId: course.id,
                                                                                    courseName: course.name,
                                                                                    topicId: topic.id,
                                                                                    topicName: topic.name,
                                                                                    subtopicId: subtopic.id,
                                                                                    subtopicName: subtopic.name,
                                                                                    content: subtopic.content,
                                                                                })
                                                                            }
                                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                                                                        >
                                                                            &#9999; Edit All
                                                                        </button>
                                                                        <button
                                                                            onClick={() => toggleSubtopicVisibility(course.id, topic.id, subtopic.id)}
                                                                            className={`px-2 py-1 rounded text-sm font-semibold ${subtopic.isVisible
                                                                                ? "bg-green-500 hover:bg-green-600"
                                                                                : "bg-gray-500 hover:bg-gray-600"
                                                                                } text-white`}
                                                                            title={subtopic.isVisible ? "Hide Subtopic" : "Show Subtopic"}
                                                                        >
                                                                            {subtopic.isVisible ? "&#128065;" : "&#128683;"}
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                deleteSubtopic(
                                                                                    course.id,
                                                                                    topic.id,
                                                                                    subtopic.id
                                                                                )
                                                                            }
                                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                                        >
                                                                            &#128465;
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Combined Edit Modal */}
                {editAllModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-auto">
                            <div className="bg-blue-600 text-white p-6 sticky top-0 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Edit Course Content</h2>
                                    <p className="text-blue-100 text-sm">Course: {editAllModal.courseName}</p>
                                </div>
                                <button
                                    onClick={() => setEditAllModal(null)}
                                    className="text-white text-2xl hover:bg-blue-700 px-2 py-1 rounded"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Topic Section */}
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        &#128218; Topic Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editAllModal.topicName}
                                        onChange={(e) =>
                                            setEditAllModal({
                                                ...editAllModal,
                                                topicName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter topic name"
                                    />
                                </div>

                                {/* Subtopic Section */}
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        &#128196; Subtopic Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editAllModal.subtopicName}
                                        onChange={(e) =>
                                            setEditAllModal({
                                                ...editAllModal,
                                                subtopicName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter subtopic name"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        &#9997; Content
                                    </label>
                                    <RichTextEditor
                                        initialContent={editAllModal.content}
                                        onSave={(content) => {
                                            updateSubtopicFull(
                                                editAllModal.courseId,
                                                editAllModal.topicId,
                                                editAllModal.subtopicId,
                                                {
                                                    name: editAllModal.subtopicName,
                                                    content: content,
                                                }
                                            );
                                            // Also update topic if name changed
                                            if (editAllModal.topicName) {
                                                setCourses(
                                                    courses.map((c) =>
                                                        c.id === editAllModal.courseId
                                                            ? {
                                                                ...c,
                                                                topics: c.topics.map((t) =>
                                                                    t.id === editAllModal.topicId
                                                                        ? { ...t, name: editAllModal.topicName }
                                                                        : t
                                                                ),
                                                            }
                                                            : c
                                                    )
                                                );
                                            }
                                            setEditAllModal(null);
                                            alert("All changes saved successfully!");
                                        }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 justify-end pt-4">
                                    <button
                                        onClick={() => setEditAllModal(null)}
                                        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminCourseManagement;
