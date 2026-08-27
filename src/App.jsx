import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CountryDetails from "./CountryDetails/CountryDetails";
import Home from "./Home/Home";
import Login from "./Login-Signup/Login";
import MyPlans from "./Myplans/Myplans";
import NotFound from "./NotFound/NotFound";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/:country/:city/:year",
      element: <CountryDetails />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/my-plans",
      element: <MyPlans />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}
