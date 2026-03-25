import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";

import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";

import AdminDashboard from "../pages/AdminDashboard";
import AdminMycourse from "../pages/Adminmycourse";
import AdminStudents from "../pages/AdminStudents";
import AdminCourseManagement from "../pages/AdminCourseManagement";

import Mycourse from "../pages/mycourse";
import CourseView from "../pages/CourseView";

const MainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // Admin Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "my-course",
        element: <AdminMycourse />,
      },
      {
        path: "course-management",
        element: <AdminCourseManagement />,
      },
      {
        path: "students",
        element: <AdminStudents />, 
      },
    ],
  },

  // Student Routes
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <Mycourse />,
      },
      {
        path: "course/:id",
        element: <CourseView />,
      },
    ],
  },
]);

export default MainRoutes;