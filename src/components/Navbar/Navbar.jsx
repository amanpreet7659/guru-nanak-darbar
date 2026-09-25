import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import menu_icon from "../../assets/menu-icon.png";
import Logo from "../../assets/svg/logo";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "../../i18n";

const SIDE_BUTTONS_KEY = "gnd_side_buttons_pos";

const DEFAULT_SIDE = [
  { id: "about", top: 38 },
  { id: "contact", top: 48 },
];

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [waheguruOpen, setWaheguruOpen] = useState(false);
  const [sideButtons, setSideButtons] = useState(DEFAULT_SIDE);
  const [draggingId, setDraggingId] = useState(null);
  const popoverRef = useRef(null);
  const dragRef = useRef({
    id: null,
    startY: 0,
    startTop: 0,
    moved: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDE_BUTTONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === 2 &&
          parsed.every((item) => item?.id && typeof item.top === "number")
        ) {
          setSideButtons(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setWaheguruOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!draggingId) return undefined;

    const onMove = (event) => {
      const clientY = event.touches?.[0]?.clientY ?? event.clientY;
      if (clientY == null) return;

      if (event.cancelable && event.touches) {
        event.preventDefault();
      }

      const deltaY = clientY - dragRef.current.startY;

      if (!dragRef.current.moved && Math.abs(deltaY) < 6) {
        return;
      }

      dragRef.current.moved = true;

      const deltaPercent = (deltaY / window.innerHeight) * 100;
      let nextTop = dragRef.current.startTop + deltaPercent;
      nextTop = Math.min(88, Math.max(12, nextTop));

      setSideButtons((prev) =>
        prev.map((item) =>
          item.id === draggingId ? { ...item, top: nextTop } : item
        )
      );
    };

    const onUp = () => {
      const wasDrag = dragRef.current.moved;
      const id = dragRef.current.id;

      if (wasDrag) {
        setSideButtons((prev) => {
          try {
            localStorage.setItem(SIDE_BUTTONS_KEY, JSON.stringify(prev));
          } catch {
            // ignore
          }
          return prev;
        });
      }

      setDraggingId(null);
      dragRef.current = { id: null, startY: 0, startTop: 0, moved: false };

      if (!wasDrag && id) {
        const meta = {
          about: () => goHomeSection("about", -150),
          contact: () => goHomeSection("contact", -260),
        };
        meta[id]?.();
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingId, location.pathname]);

  const toggleMenu = () => {
    setMobileMenu((prev) => !prev);
    setWaheguruOpen(false);
  };

  const closeMenu = () => {
    setMobileMenu(false);
    setWaheguruOpen(false);
  };

  const goHomeSection = (sectionId, offset = 0) => {
    closeMenu();

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const startDrag = (id, event) => {
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const current = sideButtons.find((item) => item.id === id);

    dragRef.current = {
      id,
      startY: clientY,
      startTop: current?.top ?? 40,
      moved: false,
    };
    setDraggingId(id);
  };

  const sideMeta = {
    about: {
      label: t("common.aboutUs"),
      icon: "bi-info-circle",
    },
    contact: {
      label: t("common.contactUs"),
      icon: "bi-envelope",
    },
  };

  return (
    <>
      <nav className={`maincontainer ${sticky ? "dark-nav" : "light-nav"}`}>
        <Logo height="100px" width="500px" />

        <ul className={mobileMenu ? "" : "hide-mobile-menu"}>
          <li>
            <button
              type="button"
              className="nav-text-btn"
              onClick={() => {
                closeMenu();
                navigate("/");
              }}
            >
              {t("common.home")}
            </button>
          </li>

          <li className="nav-dropdown-item" ref={popoverRef}>
            <button
              type="button"
              className={`nav-dropdown-trigger ${waheguruOpen ? "is-open" : ""}`}
              aria-expanded={waheguruOpen}
              aria-haspopup="true"
              onClick={() => setWaheguruOpen((open) => !open)}
            >
              <span className="nav-dropdown-trigger-icon">
                <i className="bi bi-flower1" aria-hidden="true" />
              </span>
              <span>{t("nav.waheguruSimran")}</span>
              <i
                className={`bi ${waheguruOpen ? "bi-chevron-up" : "bi-chevron-down"}`}
                aria-hidden="true"
              />
            </button>

            {waheguruOpen && (
              <div className="nav-dropdown-panel" role="menu">
                <div className="nav-dropdown-heading">
                  <div className="nav-dropdown-kicker">
                    {t("nav.annualProgram")}
                  </div>
                  <div className="nav-dropdown-title">
                    {t("nav.waheguruSimran")}
                  </div>
                  <p className="nav-dropdown-copy">{t("nav.dropdownCopy")}</p>
                </div>

                <RouterLink
                  to="/waheguru-simran/register"
                  className="nav-dropdown-option"
                  role="menuitem"
                  onClick={closeMenu}
                >
                  <span className="nav-dropdown-option-icon start">
                    <i className="bi bi-person-plus-fill" aria-hidden="true" />
                  </span>
                  <span className="nav-dropdown-option-text">
                    <strong>{t("nav.startRegistration")}</strong>
                    <small>{t("nav.startRegistrationDesc")}</small>
                  </span>
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </RouterLink>

                <RouterLink
                  to="/waheguru-simran/submit"
                  className="nav-dropdown-option"
                  role="menuitem"
                  onClick={closeMenu}
                >
                  <span className="nav-dropdown-option-icon submit">
                    <i className="bi bi-journal-check" aria-hidden="true" />
                  </span>
                  <span className="nav-dropdown-option-text">
                    <strong>{t("nav.submitRegistration")}</strong>
                    <small>{t("nav.submitRegistrationDesc")}</small>
                  </span>
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </RouterLink>
              </div>
            )}
          </li>

          <li>
            <RouterLink to="/admin/login" onClick={closeMenu}>
              {t("common.adminLogin")}
            </RouterLink>
          </li>

          <li className="nav-lang-item">
            <LanguageSwitcher />
          </li>

          <li className="nav-mobile-only">
            <button
              type="button"
              className="nav-text-btn"
              onClick={() => goHomeSection("about", -150)}
            >
              {t("common.aboutUs")}
            </button>
          </li>
          <li className="nav-mobile-only">
            <button
              type="button"
              className="nav-text-btn"
              onClick={() => goHomeSection("contact", -260)}
            >
              {t("common.contactUs")}
            </button>
          </li>
        </ul>

        <img
          src={menu_icon}
          alt=""
          className="menu-icon"
          onClick={toggleMenu}
        />
      </nav>

      <div className="side-action-rail" aria-label="Quick links">
        {sideButtons.map((item) => {
          const meta = sideMeta[item.id];
          if (!meta) return null;

          return (
            <button
              key={item.id}
              type="button"
              className={`side-action-btn ${draggingId === item.id ? "is-dragging" : ""}`}
              style={{ top: `${item.top}%` }}
              title={`${meta.label} · ${t("nav.dragToMove")}`}
              onMouseDown={(event) => startDrag(item.id, event)}
              onTouchStart={(event) => startDrag(item.id, event)}
            >
              <span className="side-action-grip" aria-hidden="true">
                ⋮
              </span>
              <i className={`bi ${meta.icon}`} aria-hidden="true" />
              <span className="side-action-label">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;
