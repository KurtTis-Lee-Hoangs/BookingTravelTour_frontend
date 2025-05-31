// import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import TourCard from "./TourCard";
import { BASE_URL } from "../../utils/config";
import useFetch from "../../hooks/useFetch";
import "./similar-tours.css";

const SimilarTours = ({ city, currentTourId }) => {
  // Lấy tất cả các tour
  const { data: allTours, loading, error } = useFetch(`${BASE_URL}/tours`);

  // Lọc các tour có city tương tự và khác id
  //   const similarTours =
  //     allTours?.filter(
  //       (tour) => tour.city === city && tour._id !== currentTourId
  //     ) || [];

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const extractKeywords = (cityStr) =>
    normalize(cityStr)
      .split("-")
      .map((s) => s.trim());

  const currentCityKeywords = extractKeywords(city);

  const similarTours =
    allTours?.filter((tour) => {
      const tourKeywords = extractKeywords(tour.city);
      const hasCommonKeyword = currentCityKeywords.some((kw) =>
        tourKeywords.includes(kw)
      );
      return hasCommonKeyword && tour._id !== currentTourId;
    }) || [];

  if (loading) return <p>Loading similar tours...</p>;
  if (error) return <p>Error loading similar tours: {error}</p>;
  if (similarTours.length === 0) return null;

  return (
    <div className="similar__tours mt-5">
      <Container>
        <h4 className="mb-4">Similar Tours</h4>
        <Row>
          {similarTours.map((tour) => (
            <Col lg="3" md="6" sm="6" key={tour._id} className="mb-4">
              <TourCard tour={tour} />
            </Col>
          ))}
        </Row>
        {/* <div className="similar-tours-scroll-container">
          {similarTours.map((tour) => (
            <div  key={tour._id} className="tour-card-wrapper">
              <TourCard tour={tour} />
            </div>
          ))}
        </div> */}
      </Container>
    </div>
  );
};

export default SimilarTours;
