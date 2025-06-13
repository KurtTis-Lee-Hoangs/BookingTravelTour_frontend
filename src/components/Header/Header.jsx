import React, { useRef, useState, useEffect, useContext } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo4.jpg";
// import logo from "../../assets/images/logo.png";
import "./header.css";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import { toast } from "react-toastify";
import LanguageToggle from "../../shared/LanguageToggle";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation(['header'])
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const nav__links = [
    {path: "/homepage",display: t('LBL_HOME')},
    {path: "/blogs",display: t('LBL_BLOG')},
    {path: "/tours",display: t('LBL_TOUR')},
    {path: "/hotel",display: t('LBL_HOTEL')},
    {path: "/weather",display: t('LBL_WEATHER')},
    {path: "/about",display: t('LBL_ABOUT')},
  ];

  const logout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error during logout:", result.message);
        alert(result.message || "Logout failed. Please try again.");
        toast.error(result.message || "Logout failed. Please try again.");
      } else {
        // Clear user data and redirect to homepage
        dispatch({ type: "LOGOUT" });
        navigate("/");
        toast.success("Logout success!")
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Logout failed. Please try again.");
      toast.error("Logout failed. Please try again.", err);
    }
  };

  // Sticky header functionality
  // useEffect(() => {
  //   const stickyheaderFunc = () => {
  //     if (headerRef.current) {
  //       window.addEventListener("scroll", () => {
  //         if (
  //           document.body.scrollTop > 80 ||
  //           document.documentElement.scrollTop > 80
  //         ) {
  //           headerRef.current.classList.add("sticky__header");
  //         } else {
  //           headerRef.current.classList.remove("sticky__header");
  //         }
  //       });
  //     }
  //   };

  //   // stickyheaderFunc();
  //   // Attach the event listener
  //   window.addEventListener("scroll", stickyheaderFunc);
  //   return () => window.removeEventListener("scroll", stickyheaderFunc);
  // }, []);

  const stickyHeaderFunc = () => {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      headerRef.current.classList.add("sticky__header");
    } else {
      headerRef.current.classList.remove("sticky__header");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", stickyHeaderFunc);

    return () => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener("scroll", stickyHeaderFunc);
    };
  }, []);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle menu item selection
  const handleMenuItemClick = () => {
    setDropdownOpen(false);
  };

  // useEffect(() => {
  //   // console.log(user);
  //   // console.log(isMobile);
  // });

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <Link to="/" className={`logo ${user ? "logged-in" : ""}`}>
              <img src={logo} alt="" />
            </Link>

            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li key={index} className="nav__item">
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__right d-flex align-items-center gap-4">
              {isMobile &&
                user && ( // Show mobile menu only if the user is logged in
                  <span
                    className="mobile__menu"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <i className="ri-menu-line"></i>
                  </span>
                )}

              {dropdownOpen && isMobile && (
                <div
                  className={`dropdown__menu ${dropdownOpen ? "active" : ""}`}
                >
                  <div className="user__info">
                    {user && (
                      <>
                        <img
                          src={user.avatar}
                          className="user__img"
                          alt="User Avatar"
                        />
                        <h5 className="mb-0">{user.username}</h5>
                      </>
                    )}
                  </div>
                  <ul className="menu d-flex flex-column">
                  <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/homepage">{t('LBL_HOME')}</NavLink>
                    </li>
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/blogs">{t('LBL_BLOG')}</NavLink>
                    </li>
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/tours">{t('LBL_TOUR')}</NavLink>
                    </li>
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/hotel">{t('LBL_HOTEL')}</NavLink>
                    </li>
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/weather">{t('LBL_WEATHER')}</NavLink>
                    </li>
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/about">{t('LBL_ABOUT')}</NavLink>
                    </li>
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <NavLink to="/profile">{t('LBL_PROFILE')}</NavLink>
                    </li>
                    {user && user.role === "admin" && (
                      <li className="nav__item" onClick={handleMenuItemClick}>
                        <NavLink to="/admin">{t('LBL_ADMIN_PANEL')}</NavLink>
                      </li>
                    )}
                    <li className="nav__item" onClick={handleMenuItemClick}>
                      <Button className="btn btn-dark w-100" onClick={logout}>
                        {t('LBL_BTN_LOGOUT')}
                      </Button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Show Login and Register buttons when the user is not logged in */}
              {!user ? (
                <>
                  <Button className="btn secondary__btn" style={{ width: "112px" }}>
                    <Link to="/login">{t('LBL_LOGIN')}</Link>
                  </Button>

                  <Button className="btn primary__btn" style={{ width: "112px" }}>
                    <Link to="/register">{t('LBL_REGISTER')}</Link>
                  </Button>
                </>
              ) : (
                // Show user avatar and dropdown when logged in and screen size is larger than 768px
                !isMobile && (
                  <div
                    className="user__menu"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    style={{ position: "relative" }}
                  >
                    <img
                      src={user.avatar}
                      className="user__img"
                      alt="User Avatar"
                    />
                    {dropdownOpen && (
                      <div className="dropdown__menu">
                        <h5 className="mb-0">{t('LBL_USER')}: {user.username}</h5>
                        <Link
                          to="/profile"
                          className="dropdown__item profile-item"
                        >
                          {t('LBL_PROFILE')}
                        </Link>
                        <Link
                          to="/history"
                          className="dropdown__item profile-item"
                        >
                          {t('LBL_BOOKING_HISTORY')}
                        </Link>
                        <Link
                          to="/hotelBooking"
                          className="dropdown__item profile-item"
                        >
                          {t('LBL_HOTEL_BOOKING_HISTORY')}
                        </Link>
                        <Link
                          to="/favourite"
                          className="dropdown__item profile-item"
                        >
                          {t('LBL_FAVOURITE_TOUR')}
                        </Link>
                        {user && user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="dropdown__item profile-item"
                          >
                            {t('LBL_ADMIN_PANEL')}
                          </Link>
                        )}
                        <Button
                          className="btn btn-dark dropdown__item w-100"
                          onClick={logout}
                        >
                          {t('LBL_BTN_LOGOUT')}
                        </Button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="language-switcher">
              <LanguageToggle />
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
