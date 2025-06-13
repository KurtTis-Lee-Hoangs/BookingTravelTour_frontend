import React from "react";
import Slider from "react-slick";
import ava01 from "../../assets/images/ava-1.jpg";
import ava02 from "../../assets/images/ava-2.jpg";
import ava03 from "../../assets/images/ava-3.jpg";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation(["home"]);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    // speed: 1000,
    speed: 3000,
    swipeToSlide: true,
    // autoplaySpeed: 2000,
    autoplaySpeed: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: "linear",

    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const slides = [
    {
      img: ava01,
      name: "John Doe",
      role: t('LBL_TESTIMONIALS_CUSTOMER'),
      text: t('LBL_TESTIMONIALS_CUSTOMER_DESC_1'),
    },
    {
      img: ava02,
      name: "Jane Doe",
      role: t('LBL_TESTIMONIALS_CUSTOMER'),
      text: t('LBL_TESTIMONIALS_CUSTOMER_DESC_2'),
    },
    {
      img: ava03,
      name: "Mike Smith",
      role: t('LBL_TESTIMONIALS_CUSTOMER'),
      text: t('LBL_TESTIMONIALS_CUSTOMER_DESC_3'),
    },
  ];
  const doubleSlides = [...slides, ...slides]; // Nhân đôi danh sách slide

  return (
    <Slider {...settings}>
      {doubleSlides.map((slide, index) => (
        <div key={index} className="testimonial py-4 px-3">
          <p>{slide.text}</p>
          <div className="d-flex align-items-center gap-4 mt-3">
            <img src={slide.img} className="w-25 h-25 rounded-2" alt="" />
            <div>
              <h5 className="mb-0 mt-3">{slide.name}</h5>
              <p>{slide.role}</p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Testimonials;
