import React from "react";
import "../styles/newsletter.css";
import { Container, Row, Col } from "reactstrap";
import maleTourist from "../assets/images/male-tourist.png";
import { useTranslation } from "react-i18next";

const NewSletter = () => {
  const { t } = useTranslation(["home"]);

  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>{t('LBL_NEW_LETTER_TITLE')}</h2>
              <div className="newsletter__input">
                <input type="email" placeholder={t('LBL_NEW_LETTER_PLACEHOLDER')} />
                <button className="btn newsletter__btn">{t('LBL_NEW_LETTER_BTN_SUBSCRIBE')}</button>
              </div>

              <p>
                {t('LBL_NEW_LETTER_DESC')}
              </p>
            </div>
          </Col>

          <Col lg="6">
            <div className="newsletter__img">
              <img src={maleTourist} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NewSletter;
