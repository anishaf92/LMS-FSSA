import { Link } from "react-router-dom";
import logo from "../assets/fssa.png";

function Navbar() {
  return (
    <div className="flex items-center justify-between px-10 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-blue-600">FSSA</h1>
      </div>

      <div className="flex items-center gap-8 text-sm font-medium">
        <Link to="/admin" className="hover:text-blue-600">
          Courses
        </Link>

        <Link to="/student" className="hover:text-blue-600">
          My Learning
        </Link>

        <Link to="/admin" className="hover:text-blue-600">
          Admin
        </Link>

        <Link
          to="/login"
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
