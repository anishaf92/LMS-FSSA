import { RouterProvider } from "react-router-dom";
import MainRoutes from "./routers/MainRoutes";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    <CourseProvider>
      <RouterProvider router={MainRoutes} />
    </CourseProvider>
  );
}

export default App;