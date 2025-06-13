import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";
import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";
import { useTranslation } from "react-i18next";

const ServiceList = () => {
  const { t } = useTranslation(['home']);

  const servicesData = [
    {
      imgUrl: weatherImg,
      title: t('LBL_WE_SERVE_CARD_WEATHER'),
      desc: t('LBL_WE_SERVE_CARD_WEATHER_DESC'),
    },
    {
      imgUrl: guideImg,
      title: t('LBL_WE_SERVE_CARD_GUIDE'),
      desc: t('LBL_WE_SERVE_CARD_GUIDE_DESC'),
    },
    {
      imgUrl: customizationImg,
      title: t('LBL_WE_SERVE_CARD_CUSTOMIZATION'),
      desc: t('LBL_WE_SERVE_CARD_CUSTOMIZATION_DESC'),
    },
  ];

  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
