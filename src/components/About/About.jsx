import React, { useEffect } from "react";
import "./about.css";
import ScrollButton from "../../shared/ScrollButton";
import logo from "../../assets/images/logo4.jpg";
import { Container, Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation(['about']);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <section className="about mb-4 mt-3">
              <div className="section-header mb-4">
                <h2>{t('LBL_ABOUT_TITLE')}</h2>
                <img src={logo} alt="" />
              </div>

              <div className="content">
                <div className="info">
                  <h4>{t('LBL_ABOUT_SECTION_1_TITLE')}</h4>
                  <p>
                  {t('LBL_ABOUT_SECTION_1_DESC_1')}
                  </p>
                  <p>
                  {t('LBL_ABOUT_SECTION_1_DESC_2')}
                  </p>
                </div>

                <div className="info">
                  <h4>{t('LBL_ABOUT_SECTION_2_TITLE')}</h4>
                  <p>
                  {t('LBL_ABOUT_SECTION_2_DESC')}
                  </p>
                  <div className="features-grid">
                    {/* <div className="feature">
                      <div className="icon">
                        <i
                          class="ri-copper-diamond-line"
                          alt="Professional team"
                        ></i>
                      </div>
                      <h5>Professional, dedicated team</h5>
                      <p>
                        We have an experienced and dedicated team, always
                        listening to customer queries and feedback via hotline
                        and continuously connected fanpage.
                      </p>
                    </div> */}

                    <div className="feature">
                      <div className="icon">
                        <i class="ri-star-line" alt="Diverse products"></i>
                      </div>
                      <h5>{t('LBL_ABOUT_FEATURE_1_TITLE')}</h5>
                      <p>
                      {t('LBL_ABOUT_FEATURE_1_DESC')}
                      </p>
                    </div>

                    <div className="feature">
                      <div className="icon">
                        <i
                          class="ri-money-dollar-circle-line"
                          alt="Attractive prices"
                        ></i>
                      </div>
                      <h5>{t('LBL_ABOUT_FEATURE_2_TITLE')}</h5>
                      <p>
                      {t('LBL_ABOUT_FEATURE_2_DESC')}
                      </p>
                    </div>

                    <div className="feature">
                      <div className="icon">
                        <i
                          class="ri-git-repository-private-line"
                          alt="Data security"
                        ></i>
                      </div>
                      <h5>{t('LBL_ABOUT_FEATURE_3_TITLE')}</h5>
                      <p>
                      {t('LBL_ABOUT_FEATURE_3_DESC')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="info">
                  <h4>{t('LBL_ABOUT_SECTION_3_TITLE')}</h4>
                  <p>
                  {t('LBL_ABOUT_SECTION_3_DESC_1')}
                  </p>
                  <ul>
                    <p>{t('LBL_ABOUT_SERVICE_1')}</p>
                    <p>{t('LBL_ABOUT_SERVICE_2')}</p>
                    <p>
                    {t('LBL_ABOUT_SERVICE_3')}
                    </p>
                    <p>{t('LBL_ABOUT_SERVICE_4')}</p>
                    <p>
                    {t('LBL_ABOUT_SERVICE_5')}
                    </p>
                  </ul>
                  <p>
                  {t('LBL_ABOUT_SECTION_3_DESC_2')}
                  </p>
                </div>

                <div className="info">
                  <h4>{t('LBL_ABOUT_SECTION_4_TITLE')}</h4>
                  <p>
                  {t('LBL_ABOUT_SECTION_4_DESC')}
                  </p>
                  <div className="partners">
                    <a
                      className="partner"
                      href="https://www.facebook.com/profile.php?id=100028798721439"
                    >
                      <div className="partner-logo">
                        <img
                          src="https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1730600707~exp=1730604307~hmac=63d2ed023c4a722f90f9c59a0417ca2eba185a3b9323bf93f4a6ff988c6bd6d7&w=740"
                          alt="FARES Logo"
                        />
                      </div>
                      <div className="partner-info">
                        <h5>{t('LBL_ABOUT_PARTNER_1_NAME')}</h5>
                        <p className="partner-category">
                        {t('LBL_ABOUT_PARTNER_1_TITLE')}
                        </p>
                        <p>
                        {t('LBL_ABOUT_PARTNER_1_DESC')}
                        </p>
                      </div>
                    </a>

                    <a
                      className="partner"
                      href="https://www.facebook.com/nhanhhuynh244"
                    >
                      <div className="partner-logo">
                        <img
                          src="https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1730600707~exp=1730604307~hmac=63d2ed023c4a722f90f9c59a0417ca2eba185a3b9323bf93f4a6ff988c6bd6d7&w=740"
                          alt="Zestif Logo"
                        />
                      </div>
                      <div className="partner-info">
                        <h5>{t('LBL_ABOUT_PARTNER_2_NAME')}</h5>
                        <p className="partner-category">
                        {t('LBL_ABOUT_PARTNER_2_TITLE')}
                        </p>
                        <p>
                        {t('LBL_ABOUT_PARTNER_2_DESC')}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="info contact-us">
                  <h4>{t('LBL_ABOUT_SECTION_5_TITLE')}</h4>
                  <div className="contact-card">
                    <h5>
                    {t('LBL_ABOUT_COMPANY_NAME')}
                      <br />
                      {/* <span>TISTRIPS TRAVEL AND SERVICE COMPANY LIMITED</span> */}
                    </h5>
                    <p>{t('LBL_ABOUT_COMPANY_TAX')}</p>
                    <p>{t('LBL_ABOUT_COMPANY_LICENSE')}</p>
                    <p>
                    {t('LBL_ABOUT_COMPANY_ISSUER')}
                    </p>
                    <p>
                      <strong>{t('LBL_ABOUT_COMPANY_ADDRESS')}</strong> {t('LBL_ABOUT_COMPANY_ADDRESS_DESC')}
                    </p>
                    <p>
                      <strong>{t('LBL_ABOUT_COMPANY_PHONE')}</strong> {t('LBL_ABOUT_COMPANY_PHONE_DESC')}
                    </p>
                    <p>
                      <strong>{t('LBL_ABOUT_COMPANY_EMAIL')}</strong>{" "}
                      <a href="mailto:minhhoangle031211@gmail.com">
                      {t('LBL_ABOUT_COMPANY_EMAIL_DESC')}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* <ScrollButton /> */}
            </section>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
