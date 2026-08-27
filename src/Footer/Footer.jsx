const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M18.9 3H21l-6.55 7.49L22.5 21h-6.35l-4.98-6.53L5.4 21H3.28l7.01-8.01L1.5 3h6.5l4.5 5.95L18.9 3Zm-1.11 16.17h1.17L7.27 4.75H6l11.79 14.42Z" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.53-1.5H16.5V4.3C16.05 4.24 14.9 4.1 13.6 4.1c-2.72 0-4.6 1.66-4.6 4.7v2.7H6.5v3H9v7.5h4.5Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full px-5 pt-14 mt-20 pb-8 border-t border-(--border-color)">
      <div className="max-w-350 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <p className="font-(family-name:--heading-font) text-[25px] text-(--primary-color) font-black mb-3">
              Voyo
            </p>
            <p className="font-(family-name:--body-font) text-(--text-muted-color) text-sm max-w-65">
              Smart, simple trip planning — pick where and when, we'll handle
              the rest.
            </p>
            <div className="flex gap-3 mt-5">
              {[InstagramIcon, TwitterIcon, FacebookIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-(--border-color) flex items-center justify-center text-(--text-muted-color) hover:bg-(--primary-color) hover:text-white hover:border-(--primary-color) transition-all duration-300"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold mb-4">
              Explore
            </p>
            <ul className="flex flex-col gap-3 font-(family-name:--body-font) text-(--text-muted-color) text-sm">
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Travel journal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Host
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold mb-4">
              Company
            </p>
            <ul className="flex flex-col gap-3 font-(family-name:--body-font) text-(--text-muted-color) text-sm">
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-(family-name:--heading-font) text-(--text-dark-color) font-bold mb-4">
              Support
            </p>
            <ul className="flex flex-col gap-3 font-(family-name:--body-font) text-(--text-muted-color) text-sm">
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-(--primary-color)">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-(--border-color) flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
            © {new Date().getFullYear()} Voyo. All rights reserved.
          </p>
          <p className="font-(family-name:--body-font) text-(--text-muted-color) text-xs">
            Made for travelers who plan ahead.
          </p>
        </div>
      </div>
    </footer>
  );
}
