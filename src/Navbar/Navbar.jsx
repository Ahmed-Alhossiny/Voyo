import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logOut } from "../api/auth";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logOut();
    setMenuOpen(false);
    navigate("/");
  }

  const initial = user?.user_metadata?.name
    ? user.user_metadata.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();

  return (
    <nav className="flex sticky top-3 z-30 rounded-full left-0 right-0 px-5 py-3 bg-[#f7fafcb5] backdrop-blur-md border-2 border-(--border-color) w-full justify-between items-center">
      <Link
        to={"/"}
        className="font-(family-name:--heading-font) text-[25px] text-(--primary-color) font-black"
      >
        Voyo
      </Link>

      {loading ? null : user ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full bg-(--primary-color) text-white font-(family-name:--heading-font) font-bold flex items-center justify-center cursor-pointer hover:bg-(--accent-color) transition-all duration-300"
          >
            {initial}
          </button>
          <div
            className={`absolute top-full right-0 mt-2 w-44 rounded-xl border border-(--border-color) bg-(--background-color) shadow-lg overflow-hidden ${menuOpen ? "block" : "hidden"}`}
          >
            <Link
              to={"/"}
              className="block px-4 py-2.5 text-sm font-(family-name:--body-font) text-(--text-dark-color) hover:bg-[#e1e7eb] transition-colors"
            >
              Home
            </Link>
            <Link
              to={"/my-plans"}
              className="block px-4 py-2.5 text-sm font-(family-name:--body-font) text-(--text-dark-color) hover:bg-[#e1e7eb] transition-colors"
            >
              My Plans
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm font-(family-name:--body-font) text-(--text-dark-color) hover:bg-[#e1e7eb] transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      ) : (
        <Link
          to={"/login"}
          className="bg-(--primary-color) px-3 py-1 cursor-pointer text-white rounded-full hover:bg-(--accent-color) hover:text-white transition-all duration-300 font-(family-name:--body-font)"
        >
          Log in
        </Link>
      )}
    </nav>
  );
}
