import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/fssa.png";

function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex">
      <div
        className={`${open ? "w-64" : "w-16"
          } h-screen bg-blue-600 text-white transition-all duration-300 flex flex-col px-4 py-5`}
      >
        {/* Top */}
        <div className="flex items-center justify-between mb-10">
          {open && (
            <div className="flex items-center gap-2">
              <img src={logo} className="w-8 h-8" />
              <h1 className="text-xl font-bold">Admin</h1>
            </div>
          )}

          {/* Hamburger */}
          <div
            className="space-y-1 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-6 text-base font-medium">
          {open && (
            <>
              <Link to="/admin" className="hover:text-gray-200">
                Dashboard
              </Link>

              <Link to="/admin/my-course" className="hover:text-gray-200">
                My Course
              </Link>

              <Link to="/admin/course-management" className="hover:text-gray-200">
                Course Management
              </Link>

              <Link to="/admin/students" className="hover:text-gray-200">
                Students
              </Link>
              {/* 
              <Link to="/admin/attendance" className="hover:text-gray-200">
                Attendance
              </Link>

              <Link to="/admin/results" className="hover:text-gray-200">
                Results
              </Link> */}
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          {open && (
            <button
              onClick={handleLogout}
              className="w-full bg-white text-blue-600 py-2 rounded-lg mt-6 font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
