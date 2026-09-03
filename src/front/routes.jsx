// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
//Aqui abajo se agrega lo nuevos componentes a importar 
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Admin } from "./pages/Admin";
import CoursePage from "./pages/CoursePage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />

      <Route path="/login" element={
        <div className="container mt-5 d-flex justify-content-center">
          <Login />
        </div>
      } />
      <Route path="/register" element={
        <div className="container mt-5 d-flex justify-content-center">
          <Register />
        </div>
      } />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Hay que confirmar con nuestro lider Luis las rutas de courses */}
      <Route path="/courses" element={<Courses />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/course/:theId" element={<CoursePage />} />
    </Route>
  )
);