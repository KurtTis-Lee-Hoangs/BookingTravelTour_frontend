import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/thank-you.css";
import { useTranslation } from "react-i18next";

const ThankYou = () => {
  const { t } = useTranslation(['thankyou']);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i class="ri-checkbox-circle-line"></i>
              </span>

              <h1 className="mb-3 fw-semibold">{t('LBL_THANK_YOU')}</h1>

              {/* <h3 className="mb-4">Your tour is booked</h3> */}

              <Link to="/homepage" className="btn primary__btn w-25">
                {/* <Link to="/homepage"></Link> */}
                {t('LBL_BACK_TO_HOME')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;
