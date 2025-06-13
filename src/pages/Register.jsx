import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/login.css";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation(['register']);

  const [credentials, setCredentials] = useState({
    userName: undefined,
    email: undefined,
    password: undefined
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    // alert("Registered successfully!");
    // navigate("/login");

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
      const result = await res.json();

      if(!result.ok) {
        alert(result.message);
      }

      dispatch({ type: "REGISTER_SUCCESS" });
      navigate("/login");
      // alert("Registered successfully!");
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>{t('LBL_REGISTER')}</h2>

                <Form onSubmit={handleClick}>
                <FormGroup>
                    <input
                      type="text"
                      placeholder={t('LBL_REGISTER_PLACEHOLDER_USERNAME')}
                      required
                      id="username"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="email"
                      placeholder={t('LBL_REGISTER_PLACEHOLDER_EMAIL')}
                      required
                      id="email"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="password"
                      placeholder={t('LBL_REGISTER_PLACEHOLDER_PASSWORD')}
                      required
                      id="password"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                  >
                    {t('LBL_REGISTER_BTN_CREATE_ACCOUNT')}
                  </Button>
                </Form>
                <p>
                  {t('LBL_REGISTER_HAVE_ACCOUNT')} <Link to="/login">{t('LBL_REGISTER_BTN_LOGIN')}</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
