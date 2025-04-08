import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import vietnam from "../assets/images/flag-vietnam.png";
import uk from "../assets/images/flag-uk.png";
import {useTranslation} from "react-i18next";

const LanguageToggle = () => {
  const {i18n} = useTranslation();

  // Take the language from localstorage, if not, the default is "en"
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const [gradient, setGradient] = useState("");

  useEffect(() => {
    // Update color when loading page
    setGradient(
      language === "vi"
        ? "linear-gradient(to right, #FFA351, #FF7E01)"
        : "linear-gradient(to left, #FFA351, #FF7E01)"
    );
  }, [language]);

  useEffect(() => {
    // Save language to localStorage whenever changing
    localStorage.setItem("lang", language);
  }, [language]);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  }

  return (
    <div className="d-flex align-items-center">
      <div
        className="position-relative d-flex align-items-center justify-content-between"
        style={{
          width: "110px",
          height: "40px",
          borderRadius: "20px",
          padding: "5px",
          background: gradient,
          transition: "background 0.5s ease-in-out",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
          userSelect: "none"
        }}
        onClick={() => handleLanguageChange(language === "en" ? "vi" : "en")}
      >
        {/* EN / VI Labels */}
        <span
          className="fw-semibold"
          style={{
            marginLeft: "12px",
            fontSize: "14px",
            color: language === "en" ? "#fff" : "#FFD6B3",
            transition: "color 0.3s ease",
            userSelect: "none"
          }}
        >
          EN
        </span>
        <span
          className="fw-semibold"
          style={{
            marginRight: "12px",
            fontSize: "14px",
            color: language === "vi" ? "#fff" : "#FFD6B3",
            transition: "color 0.3s ease",
            userSelect: "none"
          }}
        >
          VI
        </span>

        {/* Toggle Button */}
        <Button
          className="position-absolute d-flex align-items-center justify-content-center"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            left: language === "en" ? "72px" : "5px",
            transition: "left 0.3s ease-in-out, background 0.4s ease-in-out",
            background: "white",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            padding: "0",
            userSelect: "none"
          }}
        >
          <img
            src={language === "vi" ? vietnam : uk}
            alt="flag"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              transition: "transform 0.2s ease",
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default LanguageToggle;
