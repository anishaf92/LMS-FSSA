import React, { createContext, useState } from "react";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([
        {
            id: 1,
            name: "React Basics",
            description: "Learn React from scratch",
            isVisible: true,
            topics: [
                {
                    id: 1,
                    name: "Introduction to React",
                    isVisible: true,
                    subtopics: [
                        { id: 1, name: "What is React?", content: "React is a JavaScript library...", isVisible: true },
                        { id: 2, name: "Components", content: "Components are the building blocks...", isVisible: true },
                    ],
                },
            ],
        },
    ]);

    const value = {
        courses,
        setCourses,
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourses = () => {
    const context = React.useContext(CourseContext);
    if (!context) {
        throw new Error("useCourses must be used within CourseProvider");
    }
    return context;
};
