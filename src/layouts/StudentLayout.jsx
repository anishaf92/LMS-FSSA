import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";

function StudentLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
