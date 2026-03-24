import React from "react";

function WhyFSSA() {
  return (
    <div className="px-16 py-16 text-center">
      <h2 className="text-3xl font-bold mb-12">Why FSSA</h2>

      <div className="grid grid-cols-3 gap-10">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            Structured Courses
          </h3>
          <p className="text-gray-600 text-sm">
            Courses are planned and guided by coaches to help students
            learn step by step with clear direction.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            Skill-Based Learning
          </h3>
          <p className="text-gray-600 text-sm">
            Students learn by working on practical tasks and activities
            that help them build real, usable skills.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            Progress Tracking
          </h3>
          <p className="text-gray-600 text-sm">
            Student progress is checked every month, and a report is
            provided to show learning and performance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhyFSSA;