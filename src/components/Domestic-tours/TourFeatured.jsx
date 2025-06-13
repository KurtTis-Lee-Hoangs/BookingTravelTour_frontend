import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
// import "./domestic-tour.css";
import "../Tour/tour-card.css"
import calculateAvgRating from "../../utils/avgRating";
import { useTranslation } from "react-i18next";

const TourFeatured = ({ tour }) => {
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();
  const { _id, title, city, photo, price, featured, reviews } = tour;

  const { avgRating, totalRating } = calculateAvgRating(reviews);
  const formattedPrice = price.toLocaleString("vi-VN");
  const cityPreview = city.split(" ").slice(0, 5).join(" ");
  const previewWithEllipsis = city.split(" ").length > 5 ? `${cityPreview}...` : cityPreview;
  const titlePreview = title.length > 30 ? title.slice(0, 30) + "..." : title;

  return (
    <div to={`/tours/${_id}`} className="tour__card">
      {/* <Link to={`/tours/${_id}`} className="tour__card"> */}
        <Card onClick={() => navigate(`/tours/${_id}`)} style={{ cursor: "pointer" }}>
          <div className="tour__img">
            <img src={photo} alt="tour-img" />
            {featured && <span className="ribbon__tour">{t('LBL_FOREIGN_TOUR')}</span>}
          </div>

          <CardBody>
            <div className="card__top d-flex align-items-center justify-content-between">
              <span className="tour__location d-flex align-items-center gap-1">
                <i class="ri-map-pin-line"></i> {previewWithEllipsis}
              </span>

              <span className="tour__rating d-flex align-items-center gap-1">
                <i class="ri-star-fill"></i>{" "}
                {calculateAvgRating === 0 ? null : avgRating}
                {totalRating === 0 ? (
                  t('LBL_NOT_RATED')
                ) : (
                  <span>({reviews.length})</span>
                )}
              </span>
            </div>

            <h5 className="tour__title">
              {/* <Link to={`/tours/${_id}`}>{title}</Link> */}
              <p>{titlePreview}</p>
            </h5>

            <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
              <h6>
                {formattedPrice} VND <span> /{t('LBL_PERSON')}</span>
              </h6>

              {/* <button className="btn booking__btn">
                <Link to={`/tours/${_id}`}>Book Now</Link>
              </button> */}
            </div>
            <div>
              <button className="btn booking__btn">
                <Link to={`/tours/${_id}`}>{t('LBL_BOOK_NOW')}</Link>
              </button>
            </div>
          </CardBody>
        </Card>
      {/* </Link> */}
    </div>
  );
};

export default TourFeatured;
