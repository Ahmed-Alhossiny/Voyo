import axios from "axios";
import {
  CalendarDays,
  Flag,
  Heart,
  MapPinned,
  MapPin,
  Ticket,
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Gauge,
  Clock,
  Landmark,
  Users,
  Ruler,
  Globe,
  Phone,
  Car,
  CalendarRange,
  Coins,
  Languages,
  Map,
  Calendar,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { savePlan, getSavedExternalIds } from "../api/plans";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { logOut } from "../api/auth";
import Footer from "../Footer/Footer";

function parseUtcOffsetMinutes(tzString) {
  const match = /UTC([+-])(\d{2}):(\d{2})/.exec(tzString || "");
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  return sign * (hours * 60 + minutes);
}

export default function CountryDetails() {
  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [holidaysData, setHolidaysData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState(new Set());

  const { state } = useLocation();
  const params = useParams();

  const countryText = state?.country ?? params.country;
  const city = state?.city ?? params.city;
  const year = state?.year ?? params.year;

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

  function GetCountryDetails(country) {
    setIsLoading(true);
    setError(null);
    axios
      .get(`https://api.restcountries.com/countries/v5?q=${country}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COUNTRY_DETAILS_KEY}`,
        },
      })
      .then((response) => {
        setCountryData(response.data.data.objects[0]);
      })
      .catch((error) => {
        console.log(error);
        setError("Couldn't load country details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function GetCountryHolidays(year, countryCode) {
    axios
      .get(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
        {},
      )
      .then((response) => {
        console.log(response);
        setHolidaysData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function GetCountryEvents(city, countryCode) {
    setIsLoadingEvents(true);
    setEventsError(null);
    axios
      .get("https://app.ticketmaster.com/discovery/v2/events.json", {
        params: {
          apikey: `${import.meta.env.VITE_COUNTRY_EVENTS_KEY}`,
          city,
          countryCode: countryCode?.toUpperCase(),
          size: 20,
        },
      })
      .then((response) => {
        console.log(response);

        setEventsData(response.data?._embedded?.events ?? []);
      })
      .catch((error) => {
        console.log(error);
        setEventsError("Couldn't load events.");
      })
      .finally(() => {
        setIsLoadingEvents(false);
      });
  }

  function GetCountryWeather(lat, lng) {
    if (lat == null || lng == null) {
      setIsLoadingWeather(false);
      setWeatherError(null);
      setWeather(null);
      return;
    }
    setIsLoadingWeather(true);
    setWeatherError(null);
    axios
      .get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: lat,
          longitude: lng,
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index",
          hourly: "temperature_2m,weather_code,precipitation_probability",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant",
          timezone: "auto",
        },
      })
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
        setWeatherError("Couldn't load the weather forecast.");
      })
      .finally(() => {
        setIsLoadingWeather(false);
      });
  }

  useEffect(() => {
    if (countryData) {
      const capital = city || countryData.capitals?.[0]?.name;
      GetCountryEvents(capital, countryData.codes.alpha_2);
    }
  }, [countryData]);

  useEffect(() => {
    GetCountryDetails(countryText);
  }, []);

  useEffect(() => {
    if (countryData) {
      GetCountryHolidays(year, countryData.codes.alpha_2);
    }
  }, [countryData]);

  useEffect(() => {
    const offsetString = countryData?.timezones?.[0];
    if (!offsetString) return;

    const offsetMinutes = parseUtcOffsetMinutes(offsetString);

    function tick() {
      const target = new Date(Date.now() + offsetMinutes * 60000);
      setLocalTime(
        target.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",

          timeZone: "UTC",
        }),
      );
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [countryData]);

  useEffect(() => {
    if (countryData) {
      const { lat, lng } = countryData.coordinates || {};
      GetCountryWeather(lat, lng);
    }
  }, [countryData]);

  useEffect(() => {
    if (user) {
      getSavedExternalIds()
        .then((ids) => setSavedIds(new Set(ids)))
        .catch((error) => console.log(error));
    }
  }, [user]);

  if (isLoading && window.innerWidth < 768) {
    return (
      <section className="w-full px-5 md:px-10 relative">
        <nav className="flex sticky top-3 rounded-full left-0 right-0 px-5 py-3 bg-[#f7fafcb5] backdrop-blur-md border-2 border-(--border-color)  w-full justify-between items-center">
          <a
            href="/"
            className="font-(family-name:--heading-font) text-[25px] text-(--primary-color) font-black"
          >
            Voyo
          </a>
          <button className="bg-(--primary-color) px-3 py-1 cursor-pointer text-white rounded-full hover:bg-(--accent-color) hover:text-white transition-all duration-300 font-(family-name:--body-font)">
            Log in
          </button>
        </nav>
        <div className="flex items-center gap-2 mb-5 mt-10">
          <Flag className="text-(--primary-color) text-lg" />
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
            Country Information
          </h2>
        </div>
        <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
          Loading country details...
        </div>
      </section>
    );
  } else if (isLoading && !window.innerWidth < 768) {
    return (
      <section className="w-full px-5 md:px-10 relative">
        <nav className="flex sticky top-3 bg-[#f7fafcb5] px-5 py-3 backdrop-blur-md border-2 border-(--border-color) rounded-full left-0 right-0 items-center justify-between mb-8 lg:mb-12">
          <a
            href="/"
            className="font-(family-name:--heading-font) text-[26px] lg:text-[30px] text-(--primary-color) font-black"
          >
            Voyo
          </a>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-7 font-(family-name:--body-font) text-(--text-dark-color) text-sm font-medium">
              <a
                href="/"
                className="hover:text-(--primary-color) transition-colors"
              >
                Home
              </a>
              <a
                href="#inspiration"
                className="hover:text-(--primary-color) transition-colors"
              >
                Inspiration
              </a>
              <a
                href="#how-it-works"
                className="hover:text-(--primary-color) transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="hover:text-(--primary-color) transition-colors"
              >
                Testimonials
              </a>
            </div>
            <button className="bg-(--primary-color) px-4 py-1.5 cursor-pointer text-white rounded-full hover:bg-(--accent-color) hover:text-white transition-all duration-300 font-(family-name:--body-font) text-sm">
              Log in
            </button>
          </div>
        </nav>
        <div className="flex items-center gap-2 mb-5 mt-10">
          <Flag className="text-(--primary-color) text-lg" />
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
            Country Information
          </h2>
        </div>
        <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
          Loading country details...
        </div>
      </section>
    );
  }

  if (error || !countryData) {
    return (
      <section className="w-full">
        <div className="flex items-center gap-2 mb-5">
          <Flag className="text-(--primary-color) text-lg" />
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
            Country Information
          </h2>
        </div>
        <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col items-center justify-center gap-3 text-center">
          <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm">
            {error || "No country data available."}
          </p>
          <button onClick={() => GetCountryDetails(countryText)}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  const WEATHER_MAP = {
    0: { Icon: Sun, desc: "Clear Sky", theme: "clear" },
    1: { Icon: Sun, desc: "Mainly Clear", theme: "clear" },
    2: { Icon: CloudSun, desc: "Partly Cloudy", theme: "cloudy" },
    3: { Icon: Cloud, desc: "Overcast", theme: "cloudy" },
    45: { Icon: CloudFog, desc: "Foggy", theme: "foggy" },
    48: { Icon: CloudFog, desc: "Depositing Rime Fog", theme: "foggy" },
    51: { Icon: CloudDrizzle, desc: "Light Drizzle", theme: "rainy" },
    53: { Icon: CloudDrizzle, desc: "Moderate Drizzle", theme: "rainy" },
    55: { Icon: CloudDrizzle, desc: "Dense Drizzle", theme: "rainy" },
    61: { Icon: CloudRain, desc: "Slight Rain", theme: "rainy" },
    63: { Icon: CloudRain, desc: "Moderate Rain", theme: "rainy" },
    65: { Icon: CloudRainWind, desc: "Heavy Rain", theme: "rainy" },
    66: { Icon: CloudRain, desc: "Light Freezing Rain", theme: "rainy" },
    67: { Icon: CloudRainWind, desc: "Heavy Freezing Rain", theme: "rainy" },
    71: { Icon: CloudSnow, desc: "Slight Snow", theme: "snowy" },
    73: { Icon: CloudSnow, desc: "Moderate Snow", theme: "snowy" },
    75: { Icon: CloudSnow, desc: "Heavy Snow", theme: "snowy" },
    77: { Icon: Snowflake, desc: "Snow Grains", theme: "snowy" },
    80: { Icon: CloudRainWind, desc: "Slight Showers", theme: "rainy" },
    81: { Icon: CloudRainWind, desc: "Moderate Showers", theme: "rainy" },
    82: { Icon: CloudRainWind, desc: "Violent Showers", theme: "rainy" },
    85: { Icon: CloudSnow, desc: "Slight Snow Showers", theme: "snowy" },
    86: { Icon: CloudSnow, desc: "Heavy Snow Showers", theme: "snowy" },
    95: { Icon: CloudLightning, desc: "Thunderstorm", theme: "stormy" },
    96: { Icon: CloudLightning, desc: "Thunderstorm w/ Hail", theme: "stormy" },
    99: {
      Icon: CloudLightning,
      desc: "Thunderstorm w/ Heavy Hail",
      theme: "stormy",
    },
  };

  const WEATHER_THEME = {
    clear: "from-[#FDB813] via-[#FF8C42] to-(--accent-color)",
    cloudy: "from-[#93A5B1] to-[#64748B]",
    foggy: "from-[#B8C4CE] to-[#8A97A0]",
    rainy: "from-[#4F7CAC] to-[#2D5F8A]",
    snowy: "from-[#A8D8EA] to-[#6FA8C9]",
    stormy: "from-[#3E4A61] to-[#1F2937]",
  };

  const COMPASS_POINTS = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  function getWindDirection(deg) {
    if (deg == null) return "—";
    return COMPASS_POINTS[Math.round(deg / 22.5) % 16];
  }

  function getUvLabel(uv) {
    if (uv == null) return "—";
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very High";
    return "Extreme";
  }

  function formatClock(isoString) {
    if (!isoString) return "—";
    const [, timePart] = isoString.split("T");
    const [hourStr, minuteStr] = timePart.split(":");
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minuteStr} ${period}`;
  }

  function formatHourLabel(isoString) {
    const [, timePart] = isoString.split("T");
    const hour = parseInt(timePart.split(":")[0], 10);
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  }

  function getDayProgress(nowIso, sunriseIso, sunsetIso) {
    const now = new Date(nowIso).getTime();
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();
    if (!now || !rise || !set || set <= rise) return 0;
    const pct = ((now - rise) / (set - rise)) * 100;
    return Math.min(100, Math.max(0, pct));
  }

  const country = countryData;
  const borders = (country.borders || []).slice(0, 6);

  return (
    <>
      <main className="w-full relative px-5 md:px-10">
        {window.innerWidth < 768 ? (
          <nav className="flex sticky z-50 top-3 rounded-full left-0 right-0 px-5 py-3 bg-[#f7fafcb5] backdrop-blur-md border-2 border-(--border-color)  w-full justify-between items-center">
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
        ) : (
          <nav className="flex sticky z-50 top-3 bg-[#f7fafcb5] px-5 py-3 backdrop-blur-md border-2 border-(--border-color) rounded-full left-0 right-0 items-center justify-between mb-8 lg:mb-12">
            <Link
              to={"/"}
              className="font-(family-name:--heading-font) text-[26px] lg:text-[30px] text-(--primary-color) font-black"
            >
              Voyo
            </Link>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-7 font-(family-name:--body-font) text-(--text-dark-color) text-sm font-medium">
                <a
                  href="#info"
                  className="hover:text-(--primary-color) transition-colors"
                >
                  Info
                </a>
                <a
                  href="#holidays"
                  className="hover:text-(--primary-color) transition-colors"
                >
                  Holidays
                </a>
                <a
                  href="#events"
                  className="hover:text-(--primary-color) transition-colors"
                >
                  Events
                </a>
                <a
                  href="#weather"
                  className="hover:text-(--primary-color) transition-colors"
                >
                  Weather
                </a>
              </div>
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
            </div>
          </nav>
        )}
        <section id="info">
          <div className="flex items-center gap-2 mb-5 mt-10">
            <Flag className="text-(--primary-color) text-lg" />
            <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
              Country Information
            </h2>
          </div>

          <div className="p-5 md:p-7 rounded-2xl border border-(--border-color) bg-(--background-color)">
            <div className="flex items-center gap-4 pb-5 mb-5 border-b border-(--border-color)">
              <img
                src={`https://flagcdn.com/w160/${country.codes.alpha_2.toLowerCase()}.png`}
                alt={country.names.common}
                className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg border border-(--border-color) shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) text-lg md:text-xl font-bold truncate">
                  {country.names.common}
                </h3>
                <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm truncate">
                  {country.names.official}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-1 font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  <MapPin size={16} /> {country.region} • {country.subregion}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 px-4 py-2.5 rounded-full bg-(--primary-color) w-fit max-w-full">
              <Clock className="text-white" />
              <span
                id="country-local-time"
                className="font-(family-name:--heading-font) text-white font-bold tracking-wide"
              >
                {localTime}
              </span>
              <span className="font-(family-name:--body-font) text-white/75 text-xs shrink-0">
                {country.timezones?.[0] ?? "—"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <Landmark className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Capital
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate">
                  {country.capitals?.[0]?.name ?? "—"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <Users className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Population
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate">
                  {country.population ?? "—"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <Ruler className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Area
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate">
                  {country.area?.kilometers ?? "—"} km²
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <Globe className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Continent
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate">
                  {country.continents?.[0] ?? "—"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <Phone className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Calling Code
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate">
                  +{country.calling_codes?.[0] ?? "—"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <Car className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Driving Side
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate capitalize">
                  {country.cars?.driving_side ?? "—"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                <CalendarRange className="text-(--primary-color)" size={18} />
                <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                  Week Starts
                </span>
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate capitalize">
                  {country.date?.start_of_week ?? "—"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 pt-5 border-t border-(--border-color)">
              <div>
                <h4 className="flex items-center gap-2 font-(family-name:--heading-font) text-(--text-dark-color) font-bold text-sm mb-2.5">
                  <Coins className="text-(--primary-color)" size={16} />{" "}
                  Currency
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full border border-(--border-color) text-(--text-dark-color) text-xs font-(family-name:--body-font)">
                    {country.currencies?.[0]?.name ?? "—"} (
                    {country.currencies?.[0]?.code ?? "—"}{" "}
                    {country.currencies?.[0]?.symbol ?? ""})
                  </span>
                </div>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-(family-name:--heading-font) text-(--text-dark-color) font-bold text-sm mb-2.5">
                  <Languages className="text-(--primary-color)" size={16} />{" "}
                  Languages
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full border border-(--border-color) text-(--text-dark-color) text-xs font-(family-name:--body-font)">
                    {country.languages?.[0]?.name ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-7">
              <h4 className="flex items-center gap-2 font-(family-name:--heading-font) text-(--text-dark-color) font-bold text-sm mb-2.5">
                <Map className="text-(--primary-color)" size={16} /> Neighbors
              </h4>
              <div className="flex flex-wrap gap-2">
                {borders.length > 0 ? (
                  borders.map((code) => (
                    <span
                      key={code}
                      className="px-3 py-1 rounded-full border border-(--accent-color) text-(--accent-color) text-xs font-(family-name:--body-font) font-medium"
                    >
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                    No bordering countries
                  </span>
                )}
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/place/${country.names.common}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-(--accent-color) text-white px-6 py-2.5 rounded-full font-(family-name:--heading-font) font-bold hover:bg-(--primary-color) hover:-translate-y-1 transition-all duration-300"
            >
              <MapPinned /> View on Google Maps
            </a>
          </div>
        </section>
        <section id="holidays">
          <div className="flex items-center justify-between mb-5 mt-16">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-(--primary-color) text-lg" />
              <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
                Country Holidays
              </h2>
            </div>
            <div className="px-5 py-2 rounded-full bg-[#f7fafcb5] backdrop-blur-md border-2 border-(--border-color)">
              <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-base font-bold">
                {year}
              </span>
            </div>
          </div>

          {!holidaysData ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
              Loading holidays...
            </div>
          ) : holidaysData.length === 0 ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col items-center justify-center gap-3 text-center">
              <CalendarDays className="text-(--primary-color)" size={28} />
              <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold">
                No Holidays Found
              </h3>
              <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                We couldn't find any public holidays for this country in {year}.
              </p>
            </div>
          ) : (
            <div className="md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 gap-3">
              {(() => {
                const holidayCards = [];
                for (let x = 0; x < holidaysData.length; x++) {
                  const holiday = holidaysData[x];
                  const dateObj = new Date(holiday.date);
                  const dayNumber = dateObj.getDate();
                  const shortMonth = dateObj.toLocaleString("en-US", {
                    month: "short",
                  });
                  const weekday = dateObj.toLocaleString("en-US", {
                    weekday: "long",
                  });
                  const externalId = `${country.codes.alpha_2}-holiday-${holiday.date}`;
                  const isSaved = savedIds.has(externalId);

                  holidayCards.push(
                    <div
                      key={holiday.localName}
                      className="p-4 mb-3 md:p-5 rounded-2xl border border-(--border-color) bg-(--background-color) hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-(--primary-color) text-white shrink-0">
                          <span className="font-(family-name:--heading-font) text-lg font-black leading-none">
                            {dayNumber}
                          </span>
                          <span className="font-(family-name:--body-font) text-[10px] uppercase tracking-wide">
                            {shortMonth}
                          </span>
                        </div>
                        <button
                          onClick={async () => {
                            if (isSaved) return;
                            try {
                              await savePlan({
                                type: "holiday",
                                title: holiday.localName,
                                subtitle: holiday.name,
                                planDate: `${dayNumber} ${shortMonth} ${year}`,
                                country: countryText,
                                externalId,
                              });
                              setSavedIds((prev) =>
                                new Set(prev).add(externalId),
                              );
                              Swal.fire({
                                icon: "success",
                                title: "Saved to My Plans",
                                timer: 1200,
                                showConfirmButton: false,
                              });
                            } catch (error) {
                              Swal.fire({
                                icon: "error",
                                title: "Couldn't save",
                                text: "Log in first to save plans",
                              });
                            }
                          }}
                          className={`cursor-pointer shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
                            isSaved
                              ? "text-(--accent-color) border-(--accent-color)"
                              : "text-(--text-muted-color) border-(--border-color) hover:text-(--accent-color) hover:border-(--accent-color)"
                          }`}
                        >
                          <Heart
                            size={16}
                            fill={isSaved ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) text-base font-bold truncate mb-1">
                        {holiday.localName}
                      </h3>
                      <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm truncate mb-4">
                        {holiday.name}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-(--border-color)">
                        <span className="inline-flex items-center gap-1.5 font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                          <Calendar
                            className="text-(--primary-color)"
                            size={14}
                          />
                          {weekday}
                        </span>
                        <span className="px-3 py-1 rounded-full border border-(--accent-color) text-(--accent-color) text-xs font-(family-name:--body-font) font-medium">
                          {holiday.types[0]}
                        </span>
                      </div>
                    </div>,
                  );
                }
                return holidayCards;
              })()}
            </div>
          )}
        </section>
        <section id="events">
          <div className="flex items-center justify-between mb-5 mt-16">
            <div className="flex items-center gap-2">
              <Ticket className="text-(--primary-color) text-lg" />
              <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
                Local Events
              </h2>
            </div>
            {city && (
              <div className="px-5 py-2 rounded-full bg-[#f7fafcb5] backdrop-blur-md border-2 border-(--border-color)">
                <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-base font-bold">
                  {city}
                </span>
              </div>
            )}
          </div>

          {isLoadingEvents ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
              Loading events...
            </div>
          ) : eventsError ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col items-center justify-center gap-3 text-center">
              <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                {eventsError}
              </p>
              <button
                onClick={() =>
                  GetCountryEvents(
                    city || countryData.capitals?.[0]?.name,
                    countryData.codes.alpha_2,
                  )
                }
                className="bg-(--accent-color) px-5 py-1.5 rounded-full text-white text-sm font-(family-name:--body-font) hover:bg-(--primary-color) transition-all duration-300"
              >
                Try again
              </button>
            </div>
          ) : !eventsData || eventsData.length === 0 ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col items-center justify-center gap-3 text-center">
              <Ticket className="text-(--primary-color)" size={28} />
              <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold">
                No Events Found
              </h3>
              <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                We couldn't find any upcoming events for this destination right
                now.
              </p>
            </div>
          ) : (
            <div className="md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 gap-3">
              {eventsData.map((event) => {
                const venue = event._embedded?.venues?.[0];
                const dateObj = new Date(event.dates.start.localDate);
                const formatted = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                });
                const timeStr = event.dates.start.localTime
                  ? event.dates.start.localTime.slice(0, 5)
                  : null;
                const eventExternalId = `event-${event.id}`;
                const isEventSaved = savedIds.has(eventExternalId);

                return (
                  <div
                    key={event.id}
                    className="mb-3 rounded-2xl border border-(--border-color) bg-(--background-color) overflow-hidden hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={event.images?.[0]?.url}
                        alt={event.name}
                        className="w-full h-40 object-cover"
                      />
                      {event.classifications?.[0]?.segment?.name && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-(--primary-color) text-white text-xs font-(family-name:--body-font) font-medium">
                          {event.classifications[0].segment.name}
                        </span>
                      )}
                      <button
                        onClick={async () => {
                          if (isEventSaved) return;
                          try {
                            await savePlan({
                              type: "event",
                              title: event.name,
                              subtitle:
                                event._embedded?.venues?.[0]?.name ?? "",
                              planDate: formatted,
                              country: `${venue.name}, ${venue.city?.name}`,
                              externalId: eventExternalId,
                            });
                            setSavedIds((prev) =>
                              new Set(prev).add(eventExternalId),
                            );
                            Swal.fire({
                              icon: "success",
                              title: "Saved to My Plans",
                              timer: 1200,
                              showConfirmButton: false,
                            });
                          } catch {
                            Swal.fire({
                              icon: "error",
                              title: "Couldn't save",
                              text: "Log in first to save plans",
                            });
                          }
                        }}
                        className={`cursor-pointer absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm border flex items-center justify-center transition-colors ${
                          isEventSaved
                            ? "text-(--accent-color) border-(--accent-color)"
                            : "text-(--text-muted-color) border-(--border-color) hover:text-(--accent-color) hover:border-(--accent-color)"
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={isEventSaved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="p-4 md:p-5">
                      <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) text-base font-bold truncate mb-1">
                        {event.name}
                      </h3>
                      {venue && (
                        <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm truncate mb-4 flex items-center gap-1.5">
                          <MapPin
                            size={13}
                            className="text-(--primary-color) shrink-0"
                          />
                          {venue.name}, {venue.city?.name}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-(--border-color)">
                        <span className="inline-flex items-center gap-1.5 font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                          <CalendarDays
                            size={14}
                            className="text-(--primary-color)"
                          />
                          {formatted}
                          {timeStr ? ` · ${timeStr}` : ""}
                        </span>
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--accent-color) text-white text-xs font-(family-name:--body-font) font-medium hover:bg-(--primary-color) transition-all duration-300"
                        >
                          <Ticket size={13} /> Buy Tickets
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <section id="weather">
          <div className="flex items-center gap-2 mb-5 mt-16">
            <Sun className="text-(--primary-color) text-lg" size={22} />
            <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-xl md:text-2xl font-bold">
              Weather Forecast
            </h2>
          </div>

          {isLoadingWeather ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
              Loading weather...
            </div>
          ) : weatherError ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col items-center justify-center gap-3 text-center">
              <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                {weatherError}
              </p>
              <button
                onClick={() => {
                  const { lat, lng } = countryData.coordinates || {};
                  GetCountryWeather(lat, lng);
                }}
                className="bg-(--accent-color) px-5 py-1.5 rounded-full text-white text-sm font-(family-name:--body-font) hover:bg-(--primary-color) transition-all duration-300"
              >
                Try again
              </button>
            </div>
          ) : !weather ? (
            <div className="p-7 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col items-center justify-center gap-3 text-center">
              <MapPin className="text-(--primary-color)" size={28} />
              <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold">
                No Coordinates Found
              </h3>
              <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                We couldn't find coordinates for this capital, so we can't fetch
                a forecast.
              </p>
            </div>
          ) : (
            (() => {
              const condition =
                WEATHER_MAP[weather.current.weather_code] || WEATHER_MAP[0];
              const ConditionIcon = condition.Icon;
              const gradient = WEATHER_THEME[condition.theme];
              const tempUnit = weather.current_units.temperature_2m;
              const dayProgress = getDayProgress(
                weather.current.time,
                weather.daily.sunrise[0],
                weather.daily.sunset[0],
              );
              const formattedDate = new Date(
                weather.current.time,
              ).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              });
              const timezoneLabel = weather.timezone
                .replace(/_/g, " ")
                .split("/")
                .join(" / ");

              return (
                <>
                  {/* Hero card */}
                  <div
                    className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 bg-linear-to-br ${gradient} mb-4`}
                  >
                    <div className="relative flex items-center gap-2 mb-6 text-white/90 font-(family-name:--body-font) text-xs sm:text-sm flex-wrap">
                      <MapPin size={14} />
                      <span>{timezoneLabel}</span>
                      <span className="opacity-75">· {formattedDate}</span>
                    </div>

                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <ConditionIcon
                          className="text-white shrink-0"
                          size={56}
                          strokeWidth={1.5}
                        />
                        <div className="flex items-start">
                          <span className="font-(family-name:--heading-font) text-white text-5xl sm:text-6xl font-black leading-none">
                            {Math.round(weather.current.temperature_2m)}
                          </span>
                          <span className="font-(family-name:--heading-font) text-white text-2xl font-bold mt-1">
                            {tempUnit}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-(family-name:--heading-font) text-white text-lg font-bold">
                          {condition.desc}
                        </div>
                        <div className="font-(family-name:--body-font) text-white/85 text-sm mb-2">
                          Feels like{" "}
                          {Math.round(weather.current.apparent_temperature)}
                          {tempUnit}
                        </div>
                        <div className="flex items-center gap-3 sm:justify-end font-(family-name:--body-font) text-white text-sm">
                          <span className="inline-flex items-center gap-1">
                            <ArrowUp size={14} />
                            {Math.round(weather.daily.temperature_2m_max[0])}°
                          </span>
                          <span className="inline-flex items-center gap-1 text-white/80">
                            <ArrowDown size={14} />
                            {Math.round(weather.daily.temperature_2m_min[0])}°
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                    <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                      <Droplets className="text-(--primary-color)" size={18} />
                      <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                        Humidity
                      </span>
                      <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold">
                        {weather.current.relative_humidity_2m}%
                      </span>
                      <div className="w-full h-1.5 rounded-full bg-(--border-color) overflow-hidden">
                        <div
                          className="h-full rounded-full bg-(--primary-color)"
                          style={{
                            width: `${weather.current.relative_humidity_2m}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                      <Wind className="text-(--primary-color)" size={18} />
                      <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                        Wind
                      </span>
                      <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold truncate">
                        {weather.current.wind_speed_10m}{" "}
                        {weather.current_units.wind_speed_10m}
                      </span>
                      <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                        {getWindDirection(weather.current.wind_direction_10m)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                      <Gauge className="text-(--primary-color)" size={18} />
                      <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                        UV Index
                      </span>
                      <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold">
                        {weather.current.uv_index}
                      </span>
                      <span className="font-(family-name:--body-font) text-(--accent-color) text-xs font-medium">
                        {getUvLabel(weather.current.uv_index)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex flex-col gap-1.5">
                      <CloudRain className="text-(--primary-color)" size={18} />
                      <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                        Precipitation
                      </span>
                      <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold">
                        {weather.daily.precipitation_probability_max[0]}%
                      </span>
                      <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                        {weather.daily.precipitation_sum[0]}mm expected
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-3 lg:col-span-1 p-3.5 rounded-xl border border-(--border-color) bg-white/50 flex items-center justify-between gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <Sunrise className="text-(--primary-color)" size={18} />
                        <span className="font-(family-name:--body-font) text-(--text-muted-color) text-[10px]">
                          Sunrise
                        </span>
                        <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-xs font-bold">
                          {formatClock(weather.daily.sunrise[0])}
                        </span>
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-(--border-color) relative overflow-hidden">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-(--accent-color)"
                          style={{ left: `calc(${dayProgress}% - 4px)` }}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Sunset className="text-(--primary-color)" size={18} />
                        <span className="font-(family-name:--body-font) text-(--text-muted-color) text-[10px]">
                          Sunset
                        </span>
                        <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-xs font-bold">
                          {formatClock(weather.daily.sunset[0])}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly forecast — horizontal scroll on all breakpoints */}
                  <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold mb-2.5">
                    Hourly Forecast
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-3 mb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-(--border-color) [&::-webkit-scrollbar-thumb]:rounded-full">
                    {weather.hourly.time.slice(0, 24).map((time, i) => {
                      const hourCondition =
                        WEATHER_MAP[weather.hourly.weather_code[i]] ||
                        WEATHER_MAP[0];
                      const HourIcon = hourCondition.Icon;
                      return (
                        <div
                          key={time}
                          className="snap-start shrink-0 w-17 p-3 rounded-xl border border-(--border-color) bg-(--background-color) flex flex-col items-center gap-2"
                        >
                          <span className="font-(family-name:--body-font) text-(--text-muted-color) text-[11px] whitespace-nowrap">
                            {formatHourLabel(time)}
                          </span>
                          <HourIcon
                            className="text-(--primary-color)"
                            size={20}
                          />
                          <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold">
                            {Math.round(weather.hourly.temperature_2m[i])}°
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 7-day forecast — horizontal scroll on mobile, full-width grid from md up */}
                  <h3 className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold mb-2.5">
                    7-Day Forecast
                  </h3>
                  <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-(--border-color) [&::-webkit-scrollbar-thumb]:rounded-full">
                    {weather.daily.time.map((isoDate, i) => {
                      const dayCondition =
                        WEATHER_MAP[weather.daily.weather_code[i]] ||
                        WEATHER_MAP[0];
                      const DayIcon = dayCondition.Icon;
                      const dateObj = new Date(isoDate);
                      const dayLabel = dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                        timeZone: "UTC",
                      });
                      const dayDate = dateObj.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        timeZone: "UTC",
                      });

                      return (
                        <div
                          key={isoDate}
                          className="snap-start shrink-0 w-27.5 md:w-auto p-3.5 rounded-xl border border-(--border-color) bg-(--background-color) flex flex-col items-center gap-2 text-center hover:-translate-y-1 transition-all duration-300"
                        >
                          <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-xs font-bold">
                            {dayLabel}
                          </span>
                          <span className="font-(family-name:--body-font) text-(--text-muted-color) text-[11px]">
                            {dayDate}
                          </span>
                          <DayIcon
                            className="text-(--primary-color)"
                            size={24}
                          />
                          <div className="flex items-center gap-1.5 font-(family-name:--body-font) text-xs">
                            <span className="text-(--text-dark-color) font-bold">
                              {Math.round(weather.daily.temperature_2m_max[i])}°
                            </span>
                            <span className="text-(--text-muted-color)">
                              {Math.round(weather.daily.temperature_2m_min[i])}°
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()
          )}
        </section>
        <Footer />
      </main>
    </>
  );
}
