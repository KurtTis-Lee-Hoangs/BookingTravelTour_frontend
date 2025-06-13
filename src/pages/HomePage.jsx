import React from "react";
import "../styles/homepage.css";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/hero-img01.jpg";
import heroImg2 from "../assets/images/hero-img02.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import worldImg from "../assets/images/world.png";
import experienceImg from "../assets/images/experience.png";
import Subtitle from "../shared/Subtitle";
import SearchBar from "../components/SearchTour/SearchBar";
import ServiceList from "../services/ServiceList";
import ForeignTours from "../components/Foreign-tours/Foreign.Tours";
import DomesticTours from "../components/Domestic-tours/Domestic.Tours";
import MasonryImagesGallery from "../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../components/Testimonial/Testimonials";
import NewSletter from "../shared/NewSletter";
import ScrollButton from "../shared/ScrollButton";
import { useTranslation } from "react-i18next";
import ChatBot from "../shared/ChatBot";

const HomePage = () => {
  const { t } = useTranslation(['home']);
  window.scrollTo(0, 0);

  return (
    <>
      <div>
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={t('LBL_SUBTITLE_TITLE_1')} />
                  <img src={worldImg} alt="" />
                </div>

                <h1>
                  {/* Travel opens the door to creating */}
                  {t('LBL_CONTENT_TITLE')}
                  {/* <span className="highlight"> memories</span> */}
                  <span className="highlight"> {t('LBL_MEMORIES')}</span>
                </h1>
                <p>
                  {/* Travel is not just about exploring new destinations. It’s
                  about opening up opportunities to create unforgettable
                  memories. Each journey offers unique experiences, from moments
                  of awe in breathtaking landscapes to meaningful encounters
                  with new people and cultures. These memories are not merely
                  photographs or stories to tell but are profound emotions, life
                  lessons, and lasting values that stay with us forever.
                  Therefore, travel is not only a journey across physical spaces
                  but also a path of self-discovery and growth. */}
                  {t('LBL_CONTENT_DESC')}
                </p>
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" controls autoPlay loop muted />
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={heroImg2} alt="" />
              </div>
            </Col>

            <SearchBar />
          </Row>
        </Container>
      </div>

      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">{t('LBL_WE_SERVE')}</h5>
              <h2 className="services__title">{t('LBL_WE_SERVE_DESC_TITLE')}</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      {/* Our foreign tours */}
      <div>
        <Container>
          <Row>
            <Col lg="12" className="mb-4">
              <Subtitle subtitle={t('LBL_SUBTITLE_EXPLORE')} />
              <h2 className="featured__tour-title">{t('LBL_OUR_FOREIGN_TOURS')}</h2>
            </Col>
            <ForeignTours />
          </Row>
        </Container>
      </div>

      {/* Our domestic tours */}
      <div>
        <Container>
          <Row>
            <Col lg="12" className="mb-3">
              <Subtitle subtitle={t('LBL_SUBTITLE_EXPLORE')} />
              {/* <h2 className="featured__tour-title">Our featured tours</h2> */}
              <h2 className="featured__tour-title">{t('LBL_OUR_DOMESTIC_TOURS')}</h2>
            </Col>
            <DomesticTours />
          </Row>
        </Container>
      </div>

      <div className="mt-4">
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={t('LBL_SUBTITLE_EXPERIENCE')} />

                <h2>
                  {t('LBL_EXPERIENCE_TITLE_1')} <br /> {t('LBL_EXPERIENCE_TITLE_2')}
                </h2>
                <p>
                  {t('LBL_EXPERIENCE_DESC_1')}
                  <br />
                  {t('LBL_EXPERIENCE_DESC_2')}
                </p>
              </div>

              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>{t('LBL_EXPERIENCE_COUNTER_SUCCESSFUL_TOUR')}</span>
                  <h6>{t('LBL_EXPERIENCE_SUCCESSFUL_TOUR')}</h6>
                </div>

                <div className="counter__box">
                  <span>{t('LBL_EXPERIENCE_COUNTER_REGULAR_CLIENTS')}</span>
                  <h6>{t('LBL_EXPERIENCE_REGULAR_CLIENTS')}</h6>
                </div>

                <div className="counter__box">
                  <span>{t('LBL_EXPERIENCE_COUNTER_YEARS_EXPERIENCE')}</span>
                  <h6>{t('LBL_EXPERIENCE_YEARS_EXPERIENCE')}</h6>
                </div>
              </div>
            </Col>

            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="experienceImg" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Images */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={t('LBL_SUBTITLE_GALLERY')} />
              <h2 className="gallery__title">
                {t('LBL_GALLERY_TITLE')}
              </h2>
            </Col>

            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <div>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={t('LBL_SUBTITLE_TESTIMONIALS')} />
              <h2 className="testimonial__title">{t('LBL_TESTIMONIALS_TITLE')}</h2>
            </Col>

            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </div>
      {/* <ScrollButton /> */}

      {/* <ChatBot /> */}

      <NewSletter />
    </>
  );
};

export default HomePage;
