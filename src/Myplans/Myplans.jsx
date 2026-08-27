import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import { getMyPlans, deletePlan, deleteAllPlans } from "../api/plans";
import { Bookmark, CalendarDays, Info, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    getMyPlans()
      .then(setPlans)
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(planId) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remove this plan?",
      showCancelButton: true,
      confirmButtonText: "Remove",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePlan(planId);
      setPlans(plans.filter((plan) => plan.id !== planId));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't delete",
        text: error.message,
      });
    }
  }

  async function handleDeleteAll() {
    if (plans.length === 0) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete all plans?",
      text: "This will remove every saved plan and cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete all",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAllPlans();
      setPlans([]);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Couldn't delete plans",
        text: error.message,
      });
    }
  }

  const filteredPlans =
    filter === "all" ? plans : plans.filter((plan) => plan.type === filter);

  return (
    <section className="w-full relative px-5 md:px-10 pb-16">
      <Navbar />

      <div className="flex items-center gap-2 mb-5 mt-10">
        <Bookmark className="text-(--primary-color) text-lg" size={20} />
        <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
          My Plans
        </h2>
      </div>

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          {["all", "holiday", "event"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-(family-name:--body-font) capitalize border transition-all duration-300 cursor-pointer ${
                filter === type
                  ? "bg-(--primary-color) border-(--primary-color) text-white"
                  : "bg-(--background-color) border-(--border-color) text-(--text-muted-color) hover:border-(--primary-color)"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={handleDeleteAll}
          disabled={plans.length === 0}
          className="px-4 py-1.5 rounded-full text-sm font-(family-name:--body-font) border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
        >
          Delete all
        </button>
      </div>

      {isLoading ? (
        <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
          Loading your plans...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
          No plans saved yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-4 md:p-5 rounded-2xl border border-(--border-color) bg-(--background-color) hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="px-3 py-1 rounded-full border border-(--accent-color) text-(--accent-color) text-xs font-(family-name:--body-font) font-medium capitalize">
                  {plan.type}
                </span>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="shrink-0 w-9 h-9 rounded-full border border-(--border-color) flex items-center justify-center text-(--text-muted-color) hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl font-bold truncate mb-4">
                {plan.title}
              </h3>
              {plan.subtitle && (
                <p className="font-(family-name:--body-font) flex items-center gap-1.5 mb-1 text-(--text-muted-color) text-sm truncate">
                  {plan.type == "event" ? (
                    <MapPin size={16} />
                  ) : (
                    <Info size={16} />
                  )}
                  {plan.subtitle}
                </p>
              )}
              {plan.plan_date && (
                <span className="inline-flex items-center gap-1.5 font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                  <CalendarDays size={16} />
                  {plan.plan_date}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
