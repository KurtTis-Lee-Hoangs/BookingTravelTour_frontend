import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/success.css";
import successImg from "../assets/images/register.png";
import { useTranslation } from "react-i18next";

const RegistrationSuccess = () => {
  const { t } = useTranslation(['register']);
  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col lg="12" className="m-auto text-center">
          <div className="success__container">
            <div className="success__img">
              <img src={successImg} alt="Success" />
            </div>
            <h2>{t('LBL_REGISTER_SUCCESS')}</h2>
            <p>
              {t('LBL_REGISTER_SUCCESS_DESC')}
              
            </p>
            <Button
              className="btn secondary__btn auth__btn"
              onClick={() => navigate("/login")}
            >
              {t('LBL_REGISTER_SUCCESS_GO_TO_LOGIN')}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default RegistrationSuccess;
