import { Compass, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import notFoundbg from "../assets/bg1.webp";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-dvh flex items-center justify-center overflow-hidden px-5">
      <img
        src={notFoundbg}
        alt="404"
        className="absolute inset-0 block w-full h-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="relative z-10 w-full sm:w-105 mx-auto p-7 md:p-10 bg-[#f7fafcb5] backdrop-blur-md rounded-2xl border-2 border-(--border-color) text-center">
        <div className="w-16 h-16 rounded-full bg-(--primary-color) flex items-center justify-center mx-auto mb-6">
          <Compass className="text-white" size={30} strokeWidth={1.5} />
        </div>

        <h1 className="font-(family-name:--heading-font) text-(--text-dark-color) text-[64px] font-black leading-none mb-2">
          404
        </h1>
        <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl font-bold mb-3">
          Looks like you've wandered off the map
        </h2>
        <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm mb-8 max-w-80 mx-auto">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on route.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center gap-2 bg-(--accent-color) text-white px-6 py-2.5 rounded-full font-(family-name:--heading-font) font-bold hover:bg-(--primary-color) hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <Home size={18} /> Go back home
        </button>
      </div>
    </section>
  );
}
