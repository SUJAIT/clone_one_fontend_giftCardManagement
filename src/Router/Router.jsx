import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminDashBoard from "../DashBoard/AdminDashBoard";
import BuyerDashboard from "../DashBoard/BuyerDashBoard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/regesterPage";
import DollarUpload from "../components/DollarStore/DollarUpload";
import TwoDollarInput from "../components/DollarStore/TwoDollarInput";
import FiveDollarInput from "../components/DollarStore/FiveDollarInput";
import DollarBuyPage from "../components/DollarBuyStore/DollarBuyPage";
import DollarStatus from "../pages/DollarStatus";
import Unauthorize from "../pages/Unauthorize";
import RoleRoute from "../Middleware/ProtectRoute";
import UploadedHistory from "../pages/UploadedHistory";
// import RoleRoute from "../middleware/RoleRoute"; // ✅ Import middleware

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorize />,
      },

      // ✅ Admin-only routes
      {
        element: <RoleRoute allowedRole="admin" />,
        children: [
          {
            path: "/admin-dashboard",
            element: <AdminDashBoard />,
          },
          {
            path: "/dollar-upload",
            element: <DollarUpload />,
          },
          {
            path: "/2$-upload",
            element: <TwoDollarInput />,
          },
          {
            path: "/5$-upload",
            element: <FiveDollarInput />,
          },
          {
            path: "/uploaded-history",
            element: <UploadedHistory/>,
          },
        ],
      },

      // ✅ Buyer-only routes
      {
        element: <RoleRoute allowedRole="buyer" />,
        children: [
          {
            path: "/buyer-dashboard",
            element: <BuyerDashboard />,
          },
          {
            path: "/dollar-buy",
            element: <DollarBuyPage />,
          },
        ],
      },

      // ✅ Common route (accessible by both)
      {
        path: "/dollar-status",
        element: <DollarStatus />,
      },
    ],
  },
]);
