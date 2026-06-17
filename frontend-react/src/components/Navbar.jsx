import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const authPages = ["/login", "/register"];

  // Hide navbar on login/register pages
  if (authPages.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
<header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-50">
  
  {/* LEFT */}
  <Link
    to="/dashboard"
    className="flex items-center gap-3"
  >
    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
      I
    </div>

    <span className="text-2xl font-bold text-gray-900">
      InterviewHub
    </span>
  </Link>

  {/* RIGHT */}
  {user && (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-gray-800">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
      >
        Logout
      </button>
    </div>
  )}
</header>
  );
};

export default Navbar;