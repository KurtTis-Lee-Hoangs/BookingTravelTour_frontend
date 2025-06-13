import React, { useState, useEffect } from "react";
import CommonSection from "../../shared/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router-dom";
import TourCard from "../Tour/TourCard";
import NewSletter from "../../shared/NewSletter";
import ScrollButton from "../../shared/ScrollButton";
import { useTranslation } from "react-i18next";

const SearchResultList = () => {
  const { t } = useTranslation(['tour']);
  const location = useLocation();

  const [data] = useState(location.state);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CommonSection title={t('LBL_TOUR_SEARCH_RESULT')} />
      <section>
        <Container>
          <Row>
            <h2 className="mb-5">{t('LBL_TOUR_BY_SEARCH')}</h2>
            {data.length === 0 ? (
              <h2 className="text-center">{t('LBL_NO_TOUR_FOUND')}</h2>
            ) : (
              data?.map((tour) => (
                <Col lg="3" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
      {/* <ScrollButton /> */}
      <NewSletter />
    </>
  );
};

export default SearchResultList;
