import React from "react";
import "./footer.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["footer"]);
  const year = new Date().getFullYear();

  const quick__links = [
    {
      path: "/homepage",
      display: t('LBL_HOME'),
    },
    {
      path: "/blogs",
      display: t('LBL_BLOG'),
    },
    {
      path: "/tours",
      display: t('LBL_TOUR'),
    },
    {
      path: "/hotel",
      display: t('LBL_HOTEL'),
    },
    {
      path: "/weather",
      display: t('LBL_WEATHER'),
    },
    {
      path: "/about",
      display: t('LBL_ABOUT'),
    },
  ];

  const quick__links2 = [
    {
      path: "/gallery",
      display: t('LBL_GALLERY'),
    },
    {
      path: "/login",
      display: t('LBL_LOGIN'),
    },
    {
      path: "/register",
      display: t('LBL_REGISTER'),
    },
  ];

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <img src={logo} alt="" />
              <p>{t("LBL_FOOTER_DESC")}</p>

              <div className="social__links d-flex align-items-center gap-4">
                <span>
                  <Link to="#">
                    <i class="ri-youtube-line"></i>
                  </Link>
                </span>

                <span>
                  <Link to="#">
                    <i class="ri-github-fill"></i>
                  </Link>
                </span>

                <span>
                  <Link to="#">
                    <i class="ri-facebook-circle-line"></i>
                  </Link>
                </span>

                <span>
                  <Link to="#">
                    <i class="ri-instagram-line"></i>
                  </Link>
                </span>
              </div>
            </div>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">{t('LBL_DISCOVERY')}</h5>

            <ListGroup className="footer__quick-links">
              {quick__links.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">{t('LBL_QUICK_LINK')}</h5>

            <ListGroup className="footer__quick-links">
              {quick__links2.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">{t('LBL_CONTACT')}</h5>

            <ListGroup className="footer__quick-links">
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <span>
                    <i class="ri-map-pin-line"></i>
                  </span>
                  {t('LBL_ADDRESS')}:
                </h6>
                <p className="mb-0">Ho Chi Minh, Viet Nam</p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <span>
                    <i class="ri-mail-send-line"></i>
                  </span>
                  {t('LBL_EMAIL')}:
                </h6>
                <p className="mb-0">minhhoangle031211@gmail.com</p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <span>
                    <i class="ri-phone-line"></i>
                  </span>
                  {t('LBL_PHONE')}:
                </h6>
                <p className="mb-0">0386343954</p>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg="12" className="text-center pt-5">
            <p className="copyright">
              <i class="ri-copyright-line"></i> Copyright {year}. Design in
              internet. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
