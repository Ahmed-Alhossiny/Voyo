import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logIn, signUp } from "../api/auth";
import useAuth from "../hooks/useAuth";
import signBg from "../assets/log-sign.jpg";

export default function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  function handleFlipToSignup(e) {
    e.preventDefault();
    setIsFlipped(true);
  }

  function handleFlipToLogin(e) {
    e.preventDefault();
    setIsFlipped(false);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing info",
        text: "Please fill in both fields.",
      });
      return;
    }

    setIsLoginSubmitting(true);
    try {
      await logIn(loginEmail, loginPassword);
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Login failed", text: error.message });
    } finally {
      setIsLoginSubmitting(false);
    }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing info",
        text: "Please fill in all fields.",
      });
      return;
    }

    setIsSignupSubmitting(true);
    try {
      await signUp(signupEmail, signupPassword, signupName);
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Signup failed", text: error.message });
    } finally {
      setIsSignupSubmitting(false);
    }
  }

  return (
    <section className="w-full h-dvh relative flex items-center justify-center px-5">
      <img
        src={signBg}
        alt="logBg"
        className="absolute inset-0 block w-full h-full object-cover -z-10"
      />
      <div className="w-full sm:w-105 h-120 perspective-[1500px]">
        <div
          className="relative w-full h-full transform-3d transition-transform duration-700 ease-in-out"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div className="absolute inset-0 backface-hidden p-7 bg-(--background-color) rounded-2xl border-2 border-(--border-color) flex flex-col items-center justify-center">
            <Link
              to={"/"}
              className="font-(family-name:--heading-font) text-[30px] text-(--primary-color) font-black block text-center mb-6"
            >
              Voyo
            </Link>
            <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-2xl font-bold text-center mb-6">
              Welcome back
            </h2>
            <form
              onSubmit={handleLoginSubmit}
              className="flex w-full flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="px-4 py-2.5 w-full rounded-[10px] bg-white border border-(--border-color) text-(--text-dark-color) focus:border-(--primary-color) focus:outline-0"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="px-4 py-2.5 w-full rounded-[10px] bg-white border border-(--border-color) text-(--text-dark-color) focus:border-(--primary-color) focus:outline-0"
              />
              <button
                type="submit"
                disabled={isLoginSubmitting}
                className="bg-(--accent-color) py-2.5 w-full cursor-pointer rounded-full font-(family-name:--heading-font) text-lg mt-2 hover:-translate-y-1 transition-all duration-300 hover:bg-(--primary-color) text-white disabled:opacity-60"
              >
                {isLoginSubmitting ? "Logging in..." : "Log in"}
              </button>
            </form>
            <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm text-center mt-5">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={handleFlipToSignup}
                className="text-(--primary-color) font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>

          <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] p-7 bg-(--background-color) rounded-2xl border-2 border-(--border-color) flex flex-col items-center justify-center">
            <Link
              to={"/"}
              className="font-(family-name:--heading-font) text-[30px] text-(--primary-color) font-black block text-center mb-6"
            >
              Voyo
            </Link>
            <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-2xl font-bold text-center mb-6">
              Create your account
            </h2>
            <form
              onSubmit={handleSignupSubmit}
              className="flex w-full flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Full name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="px-4 py-2.5 w-full rounded-[10px] bg-white border border-(--border-color) text-(--text-dark-color) focus:border-(--primary-color) focus:outline-0"
              />
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="px-4 py-2.5 w-full rounded-[10px] bg-white border border-(--border-color) text-(--text-dark-color) focus:border-(--primary-color) focus:outline-0"
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="px-4 py-2.5 w-full rounded-[10px] bg-white border border-(--border-color) text-(--text-dark-color) focus:border-(--primary-color) focus:outline-0"
              />
              <button
                type="submit"
                disabled={isSignupSubmitting}
                className="bg-(--accent-color) py-2.5 w-full cursor-pointer rounded-full font-(family-name:--heading-font) text-lg mt-2 hover:-translate-y-1 transition-all duration-300 hover:bg-(--primary-color) text-white disabled:opacity-60"
              >
                {isSignupSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </form>
            <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm text-center mt-5">
              Already have an account?{" "}
              <a
                href="#"
                onClick={handleFlipToLogin}
                className="text-(--primary-color) font-medium hover:underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
