import axios from "axios";
import {
  ChevronDown,
  Search,
  MapPin,
  CalendarDays,
  ListChecks,
  PlaneTakeoff,
  ShieldCheck,
  Clock,
  Compass,
  Headphones,
  Star,
  ArrowLeftRight,
  Calculator,
  Equal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { logOut } from "../api/auth";
import bg1 from "../assets/bg1.webp";
import cardbg1 from "../assets/inspire-card1.avif";
import cardbg2 from "../assets/inspire-card2.avif";
import Footer from "../Footer/Footer";

const CURRENCIES = [
  ["AED", "UAE Dirham"],
  ["AFN", "AFN"],
  ["ALL", "ALL"],
  ["AMD", "AMD"],
  ["ANG", "ANG"],
  ["AOA", "AOA"],
  ["ARS", "Argentine Peso"],
  ["AUD", "Australian Dollar"],
  ["AWG", "AWG"],
  ["AZN", "AZN"],
  ["BAM", "BAM"],
  ["BBD", "BBD"],
  ["BDT", "Bangladeshi Taka"],
  ["BGN", "Bulgarian Lev"],
  ["BHD", "Bahraini Dinar"],
  ["BIF", "BIF"],
  ["BMD", "BMD"],
  ["BND", "BND"],
  ["BOB", "BOB"],
  ["BRL", "Brazilian Real"],
  ["BSD", "BSD"],
  ["BTN", "BTN"],
  ["BWP", "BWP"],
  ["BYN", "BYN"],
  ["BZD", "BZD"],
  ["CAD", "Canadian Dollar"],
  ["CDF", "CDF"],
  ["CHF", "Swiss Franc"],
  ["CLF", "CLF"],
  ["CLP", "Chilean Peso"],
  ["CNH", "CNH"],
  ["CNY", "Chinese Yuan"],
  ["COP", "Colombian Peso"],
  ["CRC", "CRC"],
  ["CUP", "CUP"],
  ["CVE", "CVE"],
  ["CZK", "Czech Koruna"],
  ["DJF", "DJF"],
  ["DKK", "Danish Krone"],
  ["DOP", "DOP"],
  ["DZD", "Algerian Dinar"],
  ["EGP", "Egyptian Pound"],
  ["ERN", "ERN"],
  ["ETB", "ETB"],
  ["EUR", "Euro"],
  ["FJD", "FJD"],
  ["FKP", "FKP"],
  ["FOK", "FOK"],
  ["GBP", "British Pound"],
  ["GEL", "GEL"],
  ["GGP", "GGP"],
  ["GHS", "Ghanaian Cedi"],
  ["GIP", "GIP"],
  ["GMD", "GMD"],
  ["GNF", "GNF"],
  ["GTQ", "GTQ"],
  ["GYD", "GYD"],
  ["HKD", "Hong Kong Dollar"],
  ["HNL", "HNL"],
  ["HRK", "Croatian Kuna"],
  ["HTG", "HTG"],
  ["HUF", "Hungarian Forint"],
  ["IDR", "Indonesian Rupiah"],
  ["ILS", "ILS"],
  ["IMP", "IMP"],
  ["INR", "Indian Rupee"],
  ["IQD", "Iraqi Dinar"],
  ["IRR", "IRR"],
  ["ISK", "Icelandic Krona"],
  ["JEP", "JEP"],
  ["JMD", "JMD"],
  ["JOD", "Jordanian Dinar"],
  ["JPY", "Japanese Yen"],
  ["KES", "Kenyan Shilling"],
  ["KGS", "KGS"],
  ["KHR", "KHR"],
  ["KID", "KID"],
  ["KMF", "KMF"],
  ["KRW", "South Korean Won"],
  ["KWD", "Kuwaiti Dinar"],
  ["KYD", "KYD"],
  ["KZT", "KZT"],
  ["LAK", "LAK"],
  ["LBP", "Lebanese Pound"],
  ["LKR", "Sri Lankan Rupee"],
  ["LRD", "LRD"],
  ["LSL", "LSL"],
  ["LYD", "Libyan Dinar"],
  ["MAD", "Moroccan Dirham"],
  ["MDL", "MDL"],
  ["MGA", "MGA"],
  ["MKD", "MKD"],
  ["MMK", "MMK"],
  ["MNT", "MNT"],
  ["MOP", "MOP"],
  ["MRU", "MRU"],
  ["MUR", "MUR"],
  ["MVR", "MVR"],
  ["MWK", "MWK"],
  ["MXN", "Mexican Peso"],
  ["MYR", "Malaysian Ringgit"],
  ["MZN", "MZN"],
  ["NAD", "NAD"],
  ["NGN", "Nigerian Naira"],
  ["NIO", "NIO"],
  ["NOK", "Norwegian Krone"],
  ["NPR", "Nepalese Rupee"],
  ["NZD", "New Zealand Dollar"],
  ["OMR", "Omani Rial"],
  ["PAB", "PAB"],
  ["PEN", "Peruvian Sol"],
  ["PGK", "PGK"],
  ["PHP", "Philippine Peso"],
  ["PKR", "Pakistani Rupee"],
  ["PLN", "Polish Zloty"],
  ["PYG", "PYG"],
  ["QAR", "Qatari Riyal"],
  ["RON", "Romanian Leu"],
  ["RSD", "Serbian Dinar"],
  ["RUB", "Russian Ruble"],
  ["RWF", "RWF"],
  ["SAR", "Saudi Riyal"],
  ["SBD", "SBD"],
  ["SCR", "SCR"],
  ["SDG", "Sudanese Pound"],
  ["SEK", "Swedish Krona"],
  ["SGD", "Singapore Dollar"],
  ["SHP", "SHP"],
  ["SLE", "SLE"],
  ["SLL", "SLL"],
  ["SOS", "SOS"],
  ["SRD", "SRD"],
  ["SSP", "SSP"],
  ["STN", "STN"],
  ["SYP", "Syrian Pound"],
  ["SZL", "SZL"],
  ["THB", "Thai Baht"],
  ["TJS", "TJS"],
  ["TMT", "TMT"],
  ["TND", "Tunisian Dinar"],
  ["TOP", "TOP"],
  ["TRY", "Turkish Lira"],
  ["TTD", "TTD"],
  ["TVD", "TVD"],
  ["TWD", "Taiwan Dollar"],
  ["TZS", "TZS"],
  ["UAH", "Ukrainian Hryvnia"],
  ["UGX", "UGX"],
  ["USD", "US Dollar"],
  ["UYU", "UYU"],
  ["UZS", "UZS"],
  ["VES", "VES"],
  ["VND", "Vietnamese Dong"],
  ["VUV", "VUV"],
  ["WST", "WST"],
  ["XAF", "XAF"],
  ["XCD", "XCD"],
  ["XCG", "XCG"],
  ["XDR", "XDR"],
  ["XOF", "XOF"],
  ["XPF", "XPF"],
  ["YER", "Yemeni Rial"],
  ["ZAR", "South African Rand"],
  ["ZMW", "ZMW"],
  ["ZWG", "ZWG"],
  ["ZWL", "ZWL"],
].map(([code, name]) => ({ code, name }));

function CurrencySelect({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = CURRENCIES.find((c) => c.code === value);
  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 min-w-0" ref={wrapperRef}>
      <label className="block font-(family-name:--body-font) text-(--text-muted-color) text-xs font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-(--border-color) bg-white/60 hover:border-(--primary-color) transition-colors"
        >
          <span className="flex items-baseline gap-2 min-w-0">
            <span className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold text-sm shrink-0">
              {selected?.code}
            </span>
            <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs truncate">
              {selected?.name}
            </span>
          </span>
          <ChevronDown
            size={16}
            className={`text-(--text-muted-color) shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full max-h-72 rounded-xl border border-(--border-color) bg-(--background-color) shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-(--border-color) shrink-0">
              <Search
                size={14}
                className="text-(--text-muted-color) shrink-0"
              />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full bg-transparent outline-none font-(family-name:--body-font) text-sm text-(--text-dark-color)"
              />
            </div>
            <div className="overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                  No matches
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-(--primary-color)/10 transition-colors ${
                      c.code === value ? "bg-(--primary-color)/10" : ""
                    }`}
                  >
                    <span className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold shrink-0">
                      {c.code}
                    </span>
                    <span className="font-(family-name:--body-font) text-(--text-muted-color) text-xs truncate">
                      {c.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [countriesOpend, setCountriesOpend] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [capitalCity, setCapitalCity] = useState("");
  const [citiesOpend, setCitiesOpend] = useState(false);
  const [selectedCapitalCity, setSelectedCapitalCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearOpened, setYearOpened] = useState(false);
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertError, setConvertError] = useState(null);
  const [popularRates, setPopularRates] = useState(null);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityLoading, setCityLoading] = useState(false);

  const mobileCountryRef = useRef(null);
  const desktopCountryRef = useRef(null);
  const mobileCityRef = useRef(null);
  const desktopCityRef = useRef(null);
  const mobileYearRef = useRef(null);
  const desktopYearRef = useRef(null);
  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  function GetCountryDetails(country) {
    axios
      .get(`https://api.restcountries.com/countries/v5?q=${country}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COUNTRY_DETAILS_KEY}`,
        },
      })
      .then((response) => {
        console.log(response);

        setCapitalCity(response.data.data.objects[0].capitals[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function GetAvailableCountries() {
    axios
      .get("https://date.nager.at/api/v3/AvailableCountries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function GetPopularRates() {
    setIsLoadingPopular(true);
    axios
      .get("https://open.er-api.com/v6/latest/USD")
      .then((response) => {
        setPopularRates(response.data.conversion_rates ?? response.data.rates);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingPopular(false);
      });
  }

  useEffect(() => {
    GetPopularRates();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      const clickedInsideDesktop =
        menuRef.current && menuRef.current.contains(e.target);
      const clickedInsideMobile =
        mobileMenuRef.current && mobileMenuRef.current.contains(e.target);

      if (!clickedInsideDesktop && !clickedInsideMobile) {
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

  function runConversion(fromCode, toCode) {
    setIsConverting(true);
    setConvertError(null);
    axios
      .get(`https://open.er-api.com/v6/latest/${fromCode}`)
      .then((response) => {
        const rates = response.data.conversion_rates ?? response.data.rates;
        const rate = rates?.[toCode];
        if (rate == null) {
          setConvertError("Exchange rate unavailable for this pair.");
          setResult(null);
          return;
        }
        setResult({
          rate,
          converted: amount * rate,
          lastUpdated: response.data.time_last_update_utc,
        });
      })
      .catch((error) => {
        console.log(error);
        setConvertError("Couldn't fetch the exchange rate.");
        setResult(null);
      })
      .finally(() => {
        setIsConverting(false);
      });
  }

  function convertCurrency() {
    runConversion(fromCurrency, toCurrency);
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  }

  function quickConvert(code) {
    setToCurrency(code);
    runConversion(fromCurrency, code);
  }

  useEffect(() => {
    GetAvailableCountries();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileCountryRef.current &&
        !mobileCountryRef.current.contains(event.target) &&
        desktopCountryRef.current &&
        !desktopCountryRef.current.contains(event.target)
      ) {
        setCountriesOpend(false);
      }

      if (
        mobileCityRef.current &&
        !mobileCityRef.current.contains(event.target) &&
        desktopCityRef.current &&
        !desktopCityRef.current.contains(event.target)
      ) {
        setCitiesOpend(false);
      }

      if (
        mobileYearRef.current &&
        !mobileYearRef.current.contains(event.target) &&
        desktopYearRef.current &&
        !desktopYearRef.current.contains(event.target)
      ) {
        setYearOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (capitalCity !== "") {
      setCityLoading(false);
    }
  }, [capitalCity]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const POPULAR_CURRENCIES = [
    { code: "EUR", name: "Euro", flagCountry: "eu" },
    { code: "GBP", name: "British Pound", flagCountry: "gb" },
    { code: "EGP", name: "Egyptian Pound", flagCountry: "eg" },
    { code: "AED", name: "UAE Dirham", flagCountry: "ae" },
    { code: "SAR", name: "Saudi Riyal", flagCountry: "sa" },
    { code: "JPY", name: "Japanese Yen", flagCountry: "jp" },
    { code: "CAD", name: "Canadian Dollar", flagCountry: "ca" },
    { code: "INR", name: "Indian Rupee", flagCountry: "in" },
  ];

  const inspireCards = [
    {
      image: `${cardbg1}`,
      title: "More places. More memories.",
      subtitle: "Turn every trip into a story worth telling.",
      btnText: "Get inspired",
    },
    {
      image: `${cardbg2}`,
      title: "Plan your route, your way",
      subtitle: "From weekend escapes to month-long adventures.",
      btnText: "Start planning",
    },
  ];

  const steps = [
    {
      icon: MapPin,
      label: "01",
      title: "Pick a country",
      description: "Search or browse the countries you can visit right now.",
    },
    {
      icon: CalendarDays,
      label: "02",
      title: "Choose your city & year",
      description: "Narrow it down to a capital city and the year you'll go.",
    },
    {
      icon: ListChecks,
      label: "03",
      title: "Compare your options",
      description: "See routes, stays, and details laid out side by side.",
    },
    {
      icon: PlaneTakeoff,
      label: "04",
      title: "Explore & go",
      description: "Lock in your plan and head off with everything sorted.",
    },
  ];

  const reasons = [
    {
      icon: ShieldCheck,
      title: "Verified information",
      description:
        "Country and city data pulled straight from trusted sources.",
    },
    {
      icon: Clock,
      title: "Plan in minutes",
      description: "Pick a country, city, and year — that's the whole flow.",
    },
    {
      icon: Compass,
      title: "Built for explorers",
      description: "Whether it's one city or a dozen, Voyo scales with you.",
    },
    {
      icon: Headphones,
      title: "Support when you need it",
      description: "Questions about your trip? We're a message away.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Voyo cut our planning time in half. We picked a country, a city, and the dates just fell into place.",
      name: "Amira Hassan",
      trip: "Trip to Lisbon, 2026",
      initials: "AH",
      star: 5,
    },
    {
      quote:
        "I've used a lot of trip planners and this is the first one that actually felt fast on mobile.",
      name: "Daniel Osei",
      trip: "Trip to Tokyo, 2026",
      initials: "DO",
      star: 3,
    },
    {
      quote:
        "The country and city search made it easy to find exactly where I was headed without any guesswork.",
      name: "Marta Ionescu",
      trip: "Trip to Cape Town, 2026",
      initials: "MI",
      star: 4,
    },
  ];

  const focusInput = (e) => {
    e.preventDefault();

    setCountriesOpend(true);

    setTimeout(() => {
      const isMobile = window.innerWidth < 768;

      const input = isMobile ? mobileInputRef.current : desktopInputRef.current;

      input?.focus();
    }, 0);
  };

  const navigate = useNavigate();

  function handleExplore() {
    if (selectedCountry === null || selectedCapitalCity === null) {
      Swal.fire({
        icon: "warning",
        title: "Missing selection",
        text: "Please select a country and a city before exploring.",
      });
      return;
    }

    navigate(
      `/${selectedCountry}/${selectedCapitalCity}/${selectedYear ? selectedYear : "2026"}`,
      {
        state: {
          country: selectedCountry,
          countryCode: selectedCountryCode,
          city: selectedCapitalCity,
          year: selectedYear === null ? "2026" : selectedYear,
        },
      },
    );
  }

  return (
    <>
      <section
        id="explore"
        className="relative w-full h-dvh flex items-center justify-center overflow-hidden"
      >
        <img
          src={bg1}
          alt=""
          className="absolute inset-0 block w-full h-full object-cover -z-10"
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5">
          {/* Mobile: original standalone card, untouched */}
          <div className="md:hidden w-full sm:w-105 mx-auto">
            <div className="p-5 bg-[#f7fafcb5] rounded-xl border-2 border-(--border-color)">
              <nav className="flex justify-between items-center">
                <Link
                  to={"/"}
                  className="font-(family-name:--heading-font) text-[25px] text-(--primary-color) font-black"
                >
                  Voyo
                </Link>
                {loading ? null : user ? (
                  <div className="relative" ref={mobileMenuRef}>
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
              <p className="font-(family-name:--heading-font) my-5 test-(--text-dark-color) text-[30px] font-bold">
                Smart & Simple Trip Planning
              </p>
              <div>
                <form action="#">
                  <div className="relative" ref={mobileCountryRef}>
                    <div
                      onClick={() => {
                        setCountriesOpend(!countriesOpend);
                      }}
                      className={`px-3 py-2 w-full cursor-pointer bg-(--background-color) border border-(--border-color) flex justify-between items-center text-(--text-muted-color) ${countriesOpend ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[10px]"}`}
                    >
                      {selectedCountry === null ? (
                        <p>Select Country</p>
                      ) : (
                        <div className="flex justify-between items-center gap-3">
                          <img
                            src={`https://flagcdn.com/${selectedCountryCode.toLowerCase()}.svg`}
                            width="30"
                            alt={selectedCountry}
                          />
                          <span>{selectedCountry}</span>
                        </div>
                      )}
                      <ChevronDown
                        className={`${countriesOpend ? "rotate-180" : ""} transition-all duration-200`}
                      />
                    </div>
                    <div
                      className={`overflow-y-auto absolute top-full left-0 right-0 h-48 border-r border-l border-(--border-color) rounded-b-xl z-20 ${countriesOpend ? "block" : "hidden"} bg-(--background-color)`}
                    >
                      <div className="relative p-3">
                        <input
                          ref={mobileInputRef}
                          type="text"
                          name="search-country"
                          id="searchCountry"
                          placeholder="Search Countries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="ps-7.5 py-1 w-full border border-(--border-color) rounded-[7px] focus:border-(--text-dark-color) focus:outline-0"
                        />
                        <Search
                          size={16}
                          className="absolute top-1/2 left-5 -translate-y-1/2 text-(--text-muted-color)"
                        />
                      </div>
                      {countriesOpend &&
                        filteredCountries.length > 0 &&
                        filteredCountries.map((country) => {
                          return (
                            <div
                              key={country.countryCode}
                              onClick={() => {
                                setSelectedCountry(country.name);
                                setSelectedCountryCode(country.countryCode);
                                setCountriesOpend(false);
                                setSearchQuery("");
                                setSelectedCapitalCity(null);
                                setCapitalCity("");
                                GetCountryDetails(country.name.toLowerCase());
                                setCityLoading(true);
                              }}
                              className="px-3 py-2 z-50 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center"
                            >
                              <div className="flex justify-between items-center gap-3">
                                <img
                                  src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
                                  width="30"
                                  alt={country.name}
                                />
                                <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                                  {country.name}
                                </p>
                              </div>
                              <p className="text-(--text-muted-color) font-(family-name:--heading-font)">
                                {country.countryCode}
                              </p>
                            </div>
                          );
                        })}
                      {countriesOpend && filteredCountries.length === 0 && (
                        <p className="px-3 py-2 text-(--text-muted-color) font-(family-name:--body-font)">
                          No countries found
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="relative" ref={mobileCityRef}>
                      <div
                        onClick={() => {
                          setCitiesOpend(!citiesOpend);
                        }}
                        className={`px-3 py-2 w-full cursor-pointer bg-(--background-color) border border-(--border-color) flex justify-between items-center text-(--text-muted-color) ${citiesOpend ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[10px]"}`}
                      >
                        <p>
                          {selectedCapitalCity === null
                            ? "Select City"
                            : selectedCapitalCity}
                        </p>
                        <ChevronDown
                          className={`${citiesOpend ? "rotate-180" : ""} transition-all duration-200`}
                        />
                      </div>
                      <div
                        className={`overflow-y-auto absolute top-full left-0 right-0 h-fit border-r border-l border-(--border-color) rounded-b-xl z-20 ${citiesOpend ? "block" : "hidden"} bg-(--background-color)`}
                      >
                        {citiesOpend && capitalCity !== "" ? (
                          <div
                            key={capitalCity.name}
                            onClick={() => {
                              setSelectedCapitalCity(capitalCity.name);
                              setCitiesOpend(false);
                            }}
                            className="px-3 py-2 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center"
                          >
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              {capitalCity.name}
                            </p>
                          </div>
                        ) : citiesOpend && cityLoading ? (
                          <div className="px-3 py-2 w-full flex justify-between items-center">
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              Loading city...
                            </p>
                          </div>
                        ) : (
                          <div className="px-3 py-2 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center">
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              Select a country first
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative" ref={mobileYearRef}>
                      <div
                        onClick={() => {
                          setYearOpened(!yearOpened);
                        }}
                        className={`px-3 py-2 w-full cursor-pointer bg-(--background-color) border border-(--border-color) flex justify-between items-center text-(--text-muted-color) ${yearOpened ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[10px]"}`}
                      >
                        <p>{selectedYear === null ? "2026" : selectedYear}</p>
                        <ChevronDown
                          className={`${yearOpened ? "rotate-180" : ""} transition-all duration-200`}
                        />
                      </div>
                      <div
                        className={`overflow-y-auto absolute top-full left-0 right-0 h-fit border-r border-l border-(--border-color) rounded-b-xl z-20 ${yearOpened ? "block" : "hidden"} bg-(--background-color)`}
                      >
                        {["2026", "2027", "2028"].map((year) => (
                          <div
                            key={year}
                            onClick={() => {
                              setSelectedYear(year);
                              setYearOpened(false);
                            }}
                            className="px-3 py-2 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center"
                          >
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              {year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleExplore}
                    type="button"
                    className="bg-(--accent-color) py-1.5 w-full cursor-pointer rounded-full font-(family-name:--heading-font) text-[20px] mt-5 hover:-translate-y-2 transition-all duration-300 hover:bg-(--primary-color) text-white"
                  >
                    Explore
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Tablet and up: one frosted panel wrapping nav + headline + form */}
          <div className="hidden md:block bg-[#f7fafcb5] backdrop-blur-md border-2 border-(--border-color) rounded-2xl lg:rounded-3xl px-8 lg:px-16 py-8 lg:py-10">
            <nav className="flex items-center justify-between mb-8 lg:mb-12">
              <Link
                to={"/"}
                className="font-(family-name:--heading-font) text-[26px] lg:text-[30px] text-(--primary-color) font-black"
              >
                Voyo
              </Link>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-7 font-(family-name:--body-font) text-(--text-dark-color) text-sm font-medium">
                  <Link
                    to={"/"}
                    className="hover:text-(--primary-color) transition-colors"
                  >
                    Home
                  </Link>
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

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
              {/* Left copy — lg and up only */}
              <div className="hidden lg:flex flex-col max-w-xl">
                <h1 className="font-(family-name:--heading-font) text-(--text-dark-color) text-[48px] xl:text-[58px] font-black leading-[1.1]">
                  Smart & Simple <br /> Trip Planning
                </h1>
                <p className="font-(family-name:--body-font) text-(--text-muted-color) text-lg mt-5 max-w-md">
                  Discover destinations, build your itinerary, and travel with
                  everything mapped out — all in one place.
                </p>
              </div>

              {/* Form — headline only shown here below lg (tablet single column) */}
              <div className="w-full flex flex-col items-center  mx-auto lg:mx-0">
                <p className="font-(family-name:--heading-font) mb-6 lg:hidden text-(--text-dark-color) text-[32px] font-bold text-center lg:text-left">
                  Smart & Simple Trip Planning
                </p>
                <form action="#" className="w-full">
                  <div className="relative" ref={desktopCountryRef}>
                    <div
                      onClick={() => {
                        setCountriesOpend(!countriesOpend);
                      }}
                      className={`px-4 py-2.5 w-full cursor-pointer bg-(--background-color) border border-(--border-color) flex justify-between items-center text-(--text-muted-color) ${countriesOpend ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[10px]"}`}
                    >
                      {selectedCountry === null ? (
                        <p className="text-[16px]">Select Country</p>
                      ) : (
                        <div className="flex justify-between items-center gap-3">
                          <img
                            src={`https://flagcdn.com/${selectedCountryCode.toLowerCase()}.svg`}
                            width="30"
                            alt={selectedCountry}
                          />
                          <span className="text-[16px]">{selectedCountry}</span>
                        </div>
                      )}
                      <ChevronDown
                        className={`${countriesOpend ? "rotate-180" : ""} transition-all duration-200`}
                      />
                    </div>
                    <div
                      className={`overflow-y-auto absolute top-full left-0 right-0 h-56 border-r border-l border-(--border-color) rounded-b-xl z-20 ${countriesOpend ? "block" : "hidden"} bg-(--background-color)`}
                    >
                      <div className="relative p-3">
                        <input
                          ref={desktopInputRef}
                          type="text"
                          name="search-country"
                          id="searchCountry"
                          placeholder="Search Countries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="ps-7.5 py-1 w-full border border-(--border-color) rounded-[7px] focus:border-(--text-dark-color) focus:outline-0"
                        />
                        <Search
                          size={16}
                          className="absolute top-1/2 left-5 -translate-y-1/2 text-(--text-muted-color)"
                        />
                      </div>
                      {countriesOpend &&
                        filteredCountries.length > 0 &&
                        filteredCountries.map((country) => {
                          return (
                            <div
                              key={country.countryCode}
                              onClick={() => {
                                setSelectedCountry(country.name);
                                setSelectedCountryCode(country.countryCode);
                                setCountriesOpend(false);
                                setSearchQuery("");
                                setSelectedCapitalCity(null);
                                setCapitalCity("");
                                GetCountryDetails(country.name.toLowerCase());
                                setCityLoading(true);
                              }}
                              className="px-3 py-2 z-50 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center"
                            >
                              <div className="flex justify-between items-center gap-3">
                                <img
                                  src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
                                  width="30"
                                  alt={country.name}
                                />
                                <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                                  {country.name}
                                </p>
                              </div>
                              <p className="text-(--text-muted-color) font-(family-name:--heading-font)">
                                {country.countryCode}
                              </p>
                            </div>
                          );
                        })}
                      {countriesOpend && filteredCountries.length === 0 && (
                        <p className="px-3 py-2 text-(--text-muted-color) font-(family-name:--body-font)">
                          No countries found
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="relative" ref={desktopCityRef}>
                      <div
                        onClick={() => {
                          setCitiesOpend(!citiesOpend);
                        }}
                        className={`px-4 py-2.5 w-full cursor-pointer bg-(--background-color) border border-(--border-color) flex justify-between items-center text-(--text-muted-color) ${citiesOpend ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[10px]"}`}
                      >
                        <p className="text-[16px]">
                          {selectedCapitalCity === null
                            ? "Select City"
                            : selectedCapitalCity}
                        </p>
                        <ChevronDown
                          className={`${citiesOpend ? "rotate-180" : ""} transition-all duration-200`}
                        />
                      </div>
                      <div
                        className={`overflow-y-auto absolute top-full left-0 right-0 h-fit border-r border-l border-(--border-color) rounded-b-xl z-20 ${citiesOpend ? "block" : "hidden"} bg-(--background-color)`}
                      >
                        {citiesOpend && capitalCity !== "" ? (
                          <div
                            key={capitalCity.name}
                            onClick={() => {
                              setSelectedCapitalCity(capitalCity.name);
                              setCitiesOpend(false);
                            }}
                            className="px-3 py-2 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center"
                          >
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              {capitalCity.name}
                            </p>
                          </div>
                        ) : citiesOpend && cityLoading ? (
                          <div className="px-3 py-2 w-full flex justify-between items-center">
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              Loading city...
                            </p>
                          </div>
                        ) : (
                          <div className="px-3 py-2 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center">
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              Select a country first
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative" ref={desktopYearRef}>
                      <div
                        onClick={() => {
                          setYearOpened(!yearOpened);
                        }}
                        className={`px-4 py-2.5 w-full cursor-pointer bg-(--background-color) border border-(--border-color) flex justify-between items-center text-(--text-muted-color) ${yearOpened ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[10px]"}`}
                      >
                        <p className="text-[16px]">
                          {selectedYear === null ? "2026" : selectedYear}
                        </p>
                        <ChevronDown
                          className={`${yearOpened ? "rotate-180" : ""} transition-all duration-200`}
                        />
                      </div>
                      <div
                        className={`overflow-y-auto absolute top-full left-0 right-0 h-fit border-r border-l border-(--border-color) rounded-b-xl z-20 ${yearOpened ? "block" : "hidden"} bg-(--background-color)`}
                      >
                        {["2026", "2027", "2028"].map((year) => (
                          <div
                            key={year}
                            onClick={() => {
                              setSelectedYear(year);
                              setYearOpened(false);
                            }}
                            className="px-3 py-2 hover:bg-[#e1e7eb] w-full cursor-pointer flex justify-between items-center"
                          >
                            <p className="text-(--text-dark-color) font-(family-name:--body-font)">
                              {year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleExplore}
                    type="button"
                    className="bg-(--accent-color) py-2.5 lg:py-3 w-full cursor-pointer rounded-full font-(family-name:--heading-font) text-[22px] mt-6 hover:-translate-y-2 transition-all duration-300 hover:bg-(--primary-color) text-white"
                  >
                    Explore
                  </button>
                </form>
                <div className="flex items-center gap-20 mt-10">
                  <div>
                    <p className="font-(family-name:--heading-font) text-(--text-dark-color) text-[28px] font-black">
                      190+
                    </p>
                    <p className="text-(--text-muted-color) text-sm">
                      Countries
                    </p>
                  </div>
                  <div>
                    <p className="font-(family-name:--heading-font) text-(--text-dark-color) text-[28px] font-black">
                      50k+
                    </p>
                    <p className="text-(--text-muted-color) text-sm">
                      Trips planned
                    </p>
                  </div>
                  <div>
                    <p className="font-(family-name:--heading-font) text-(--text-dark-color) text-[28px] font-black">
                      4.9 ★
                    </p>
                    <p className="text-(--text-muted-color) text-sm">
                      Traveler rating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="inspiration"
        className="w-full px-5 py-16 md:py-24 max-w-350 mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-3">
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-[32px] md:text-[40px] font-bold leading-tight">
            Where will you
            <br className="hidden md:block" /> go next?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inspireCards.map((card) => (
            <div
              key={card.title}
              className="relative h-80 md:h-110 rounded-2xl overflow-hidden group"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="font-(family-name:--heading-font) text-white text-[24px] md:text-[28px] font-bold mb-1">
                  {card.title}
                </p>
                <p className="font-(family-name:--body-font) text-white/85 mb-5 max-w-[320px]">
                  {card.subtitle}
                </p>
                <Link
                  onClick={focusInput}
                  to={"/"}
                  className="inline-block bg-white px-5 py-2 rounded-full font-(family-name:--body-font) text-(--text-dark-color) font-medium hover:bg-(--accent-color) hover:text-white transition-all duration-300"
                >
                  {card.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        id="how-it-works"
        className="w-full px-5 py-16 md:py-24 max-w-350 mx-auto"
      >
        <div className="text-center mb-14">
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-[32px] md:text-[40px] font-bold mb-3">
            Plan your trip in four steps
          </h2>
          <p className="font-(family-name:--body-font) text-(--text-muted-color)">
            The same flow you'll use at the top of this page, start to finish.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-5">
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-(--border-color)" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-(--background-color) border-2 border-(--primary-color) flex items-center justify-center mb-5">
                  <Icon size={20} className="text-(--primary-color)" />
                </div>
                <span className="font-(family-name:--heading-font) text-(--accent-color) text-sm font-bold mb-2">
                  {step.label}
                </span>
                <p className="font-(family-name:--heading-font) text-(--text-dark-color) text-lg font-bold mb-2">
                  {step.title}
                </p>
                <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm max-w-55">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <section
        id="testimonials"
        className="w-full px-5 py-16 md:py-24 max-w-350 mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-[32px] md:text-[40px] font-bold mb-3">
            Loved by travelers
          </h2>
          <p className="font-(family-name:--body-font) text-(--text-muted-color)">
            A few words from people who planned their trip with Voyo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl border border-(--border-color) bg-(--background-color) flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                <div className="flex gap-1 mb-4 text-(--accent-color)">
                  {Array.from({ length: t.star }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="font-(family-name:--body-font) text-(--text-dark-color) mb-6 leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-(--primary-color) flex items-center justify-center text-white text-sm font-(family-name:--heading-font) shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-(family-name:--body-font) text-(--text-dark-color) font-medium text-sm">
                    {t.name}
                  </p>
                  <p className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
                    {t.trip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        id="currency-view"
        className="w-full px-5 py-16 md:py-24 max-w-350 mx-auto"
      >
        {/* Header */}

        <div className="text-center mb-12">
          <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-[32px] md:text-[40px] font-bold mb-3">
            Currency Converter
          </h2>
          <p className="font-(family-name:--body-font) text-(--text-muted-color)">
            Convert between currencies with live exchange rates — essential for
            travel planning.
          </p>
        </div>

        {/* Converter card */}
        <div className="p-5 md:p-7 rounded-2xl border border-(--border-color) bg-(--background-color) mb-6">
          <div className="mb-5">
            <label className="block font-(family-name:--body-font) text-(--text-muted-color) text-xs font-medium mb-1.5">
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="1"
              onChange={(e) =>
                setAmount(
                  e.target.value !== "" ? parseFloat(e.target.value) : 0,
                )
              }
              className="w-full px-4 py-2.5 rounded-xl border border-(--border-color) bg-white/60 font-(family-name:--heading-font) text-(--text-dark-color) text-lg font-bold outline-none focus:border-(--primary-color) transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-5">
            <CurrencySelect
              label="From"
              value={fromCurrency}
              onChange={setFromCurrency}
            />

            <button
              type="button"
              onClick={swapCurrencies}
              aria-label="Swap currencies"
              className="self-center sm:mb-px shrink-0 w-10 h-10 rounded-full bg-(--primary-color) text-white flex items-center justify-center hover:bg-(--accent-color) transition-all duration-300 rotate-90 sm:rotate-0"
            >
              <ArrowLeftRight size={16} />
            </button>

            <CurrencySelect
              label="To"
              value={toCurrency}
              onChange={setToCurrency}
            />
          </div>

          <button
            onClick={convertCurrency}
            disabled={isConverting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-(--primary-color) text-white px-6 py-2.5 rounded-full font-(family-name:--heading-font) font-bold hover:bg-(--accent-color) transition-all duration-300 disabled:opacity-60 cursor-pointer"
          >
            <Calculator size={16} />
            {isConverting ? "Converting..." : "Convert"}
          </button>

          {convertError && (
            <p className="mt-4 font-(family-name:--body-font) text-(--text-muted-color) text-sm">
              {convertError}
            </p>
          )}

          {result && (
            <div className="mt-6 pt-6 border-t border-(--border-color)">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-3">
                <div className="text-center">
                  <div className="font-(family-name:--heading-font) text-(--text-dark-color) text-2xl sm:text-3xl font-black">
                    {amount.toLocaleString()}
                  </div>
                  <div className="font-(family-name:--body-font) text-(--text-muted-color) text-xs font-medium">
                    {fromCurrency}
                  </div>
                </div>
                <Equal className="text-(--primary-color) shrink-0" size={20} />
                <div className="text-center">
                  <div className="font-(family-name:--heading-font) text-(--accent-color) text-2xl sm:text-3xl font-black">
                    {result.converted.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="font-(family-name:--body-font) text-(--text-muted-color) text-xs font-medium">
                    {toCurrency}
                  </div>
                </div>
              </div>
              <p className="text-center font-(family-name:--body-font) text-(--text-muted-color) text-sm">
                1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
              </p>
              {result.lastUpdated && (
                <p className="text-center font-(family-name:--body-font) text-(--text-muted-color) text-xs mt-1">
                  Last updated: {result.lastUpdated}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Popular currencies */}
        <div className="p-5 md:p-7 rounded-2xl border border-(--border-color) bg-(--background-color)">
          <div className="flex items-center gap-2 mb-5">
            <Star className="text-(--primary-color)" size={20} />
            <h2 className="font-(family-name:--heading-font) text-(--text-dark-color) text-lg font-bold">
              Quick Convert
            </h2>
          </div>

          {isLoadingPopular ? (
            <div className="p-7 flex items-center justify-center text-(--text-muted-color) font-(family-name:--body-font) text-sm">
              Loading rates...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {POPULAR_CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => quickConvert(currency.code)}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-(--border-color) bg-white/50 hover:border-(--primary-color) hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <img
                    src={`https://flagcdn.com/w40/${currency.flagCountry}.png`}
                    alt={currency.code}
                    className="w-8 h-6 object-cover rounded shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-(family-name:--heading-font) text-(--text-dark-color) text-sm font-bold">
                      {currency.code}
                    </div>
                    <div className="font-(family-name:--body-font) text-(--text-muted-color) text-xs truncate">
                      {currency.name}
                    </div>
                  </div>
                  <div className="font-(family-name:--heading-font) text-(--primary-color) text-sm font-bold shrink-0">
                    {popularRates?.[currency.code]?.toFixed(4) ?? "—"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <section id="footer" className="w-full px-5 py-16 md:py-20">
        <div className="max-w-275 mx-auto rounded-2xl bg-(--primary-color) px-8 py-14 md:py-20 text-center flex flex-col items-center">
          <h2 className="font-(family-name:--heading-font) text-white text-[28px] md:text-[38px] font-bold mb-3 max-w-140">
            Your next trip is a few clicks away
          </h2>
          <p className="font-(family-name:--body-font) text-white/80 mb-8 max-w-110">
            Pick a country, a city, and a year — Voyo handles the rest.
          </p>
          <a
            onClick={focusInput}
            href="#"
            className="bg-(--accent-color) px-8 py-3 rounded-full font-(family-name:--heading-font) text-[18px] text-white hover:-translate-y-1 hover:bg-white hover:text-(--text-dark-color) transition-all duration-300"
          >
            Start planning
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
