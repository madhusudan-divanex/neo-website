

import { faArrowRight, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PiGlobe } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";



function Header() {
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const languages = [
    {
      label: "English",
      code: "en",

    },
    {
      label: "Hindi",
      code: "hi",

    },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  useEffect(() => {
    const onScroll = () => {
      document
        .querySelector(".navbar")
        ?.classList.toggle("fixed", window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const [isOpen, setIsOpen] = useState(false);
  const [isFor, setIsFor] = useState(false);
  const [isModules, setIsModules] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsFor(false);
    setIsModules(false);
    closeMenu(); // keep your existing closeMenu logic
  };
  const institutionsDropdown = () => {
    setIsFor(!isFor);
    setIsOpen(false);
    setIsModules(false);
    closeMenu(); // keep your existing closeMenu logic
  };
  const modulesDropdown = () => {
    setIsModules(!isModules);
    setIsOpen(false);
    setIsFor(false);
    closeMenu(); // keep your existing closeMenu logic
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsModules(false);
        setIsFor(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <nav className="navbar navbar-expand-lg dv-navbar-light-box">
        <div className="container">
          <NavLink className="navbar-brand me-0" to="/">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </NavLink>
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="navbarDvSupportedContent" >

            <div className="mobile-close-btn d-lg-none">
              <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
            </div>

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0  gap-lg-2 gap-sm-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link active" onClick={closeMenu}>
                  Home
                </NavLink>
              </li>

              <li className="nav-item" ref={dropdownRef}>
                <a className="nav-link" href="#" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={toggleDropdown}>
                  Ecosystem {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </a>
                <div class="dropdown ">
                  <ul class="dropdown-menu dropdown-menu-end mt-2 nw-location-bx ">
                    <li className="prescription-item"> <a href="https://patient.neohealthcard.com/login" target="_blank" className="dropdown-item prescription-nav">Patient</a></li>
                    <li className="prescription-item"> <a href="https://doctor.neohealthcard.com/login" target="_blank" className="dropdown-item prescription-nav">Doctor</a> </li>
                    <li className="prescription-item"> <a href="https://hospitals.neohealthcard.com" target="_blank" className="dropdown-item prescription-nav">Hospital</a> </li>
                    <li className="prescription-item"> <a href="https://laboratory.neohealthcard.com" target="_blank" className="dropdown-item prescription-nav">Laboratory</a></li>
                    <li className="prescription-item"> <a href="https://pharmacy.neohealthcard.com" target="_blank" className="dropdown-item prescription-nav">Pharmacy</a> </li>
                    {/* <li className="prescription-item"> <Link to="/login" target="_blank" className="dropdown-item prescription-nav">Patient</Link></li>
                    <li className="prescription-item"> <Link to="/doctor/login" target="_blank" className="dropdown-item prescription-nav">Doctor</Link> </li> */}
                  </ul>
                </div>
              </li>

              {/* <li className="nav-item">
                <a className="nav-link" href="#" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={modulesDropdown}>
                  Modules {isModules ? <FaChevronUp /> : <FaChevronDown />}
                </a>
                <div class="dropdown ">
                  <ul class="dropdown-menu dropdown-menu-end mt-2 nw-location-bx ">
               
                  </ul>
                </div>
              </li> */}

              <li className="nav-item">
                <Link className="nav-link" to="/security" onClick={closeMenu}>
                  Security
                </Link>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={institutionsDropdown}>
                  For institutions {isFor ? <FaChevronUp /> : <FaChevronDown />}
                </a>
                <div class="dropdown">
                  <ul class="dropdown-menu dropdown-menu-end mt-2 nw-location-bx for-institutions" >
                    <li className="prescription-item"> <NavLink to="/hospital-health-system" className="dropdown-item prescription-nav">Hospitals & Health Systems</NavLink></li>
                    <li className="prescription-item"> <NavLink to="/labs-pharmacies" className="dropdown-item prescription-nav">Labs & Pharmacies</NavLink ></li>
                    <li className="prescription-item"> <NavLink to="/insurance-programs" className="dropdown-item prescription-nav">Insurance & Programs</NavLink> </li>
                    <li className="prescription-item"> <NavLink to="/government-public-health" className="dropdown-item prescription-nav">Government / Public Health</NavLink ></li>

                  </ul>
                </div>
              </li>
              <div className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle nw-address-btn d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="globe-emoji lh-1">
                    <PiGlobe size={17} />

                  </span>
                  {selectedLanguage.label}
                </a>

                <ul className="dropdown-menu dropdown-menu-end mt-2 nw-location-bx">
                  {languages.map((lang, index) => (
                    <li
                      key={index}
                      className="prescription-item"
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      <div className="prescription-nav d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">

                          {lang.label}
                        </div>

                        {selectedLanguage.code === lang.code && (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>




            </ul>


            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Link to="/select-account-type"  className="landing-thm-btn" onClick={closeMenu}>
                  Join Us <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {menuOpen && <div className="dv-mobile-overlay" onClick={closeMenu}></div>}
      </nav>
    </>
  )
}

export default Header