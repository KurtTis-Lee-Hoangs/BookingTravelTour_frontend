import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchBar = () => {
  const { t } = useTranslation(['home']);
  const locationRef = useRef("");
  const dayRef = useRef(0);
  const maxGroupSizeRef = useRef(0);
  const navigate = useNavigate();

  // const searchHandler = async (e) => {
  //   const location = locationRef.current.value;
  //   const day = dayRef.current.value;
  //   const maxGroupSize = maxGroupSizeRef.current.value;

  //   if (location === "" || day === "" || maxGroupSize === "") {
  //     return alert("All fields are required");
  //   }

  //   const res = await fetch(
  //     `${BASE_URL}/tours/search/getTourBySearch?city=${location}&day=${day}&maxGroupSize=${maxGroupSize}`
  //   );

  //   if (!res.ok) {
  //     alert("Something went wrong");
  //   }

  //   const result = await res.json();

  //   navigate(
  //     `/tours/search?city=${location}&day=${day}&maxGroupSize=${maxGroupSize}`,
  //     { state: result.data }
  //   );
  // };

  const searchHandler = async (e) => {
    // Lấy giá trị từ các trường input
    const location = locationRef.current.value;
    const day = dayRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    // Kiểm tra nếu không có bất kỳ giá trị nào
    if (!location && !day && !maxGroupSize) {
      return alert("Please enter at least one search criteria.");
    }

    // Xây dựng URL động dựa trên các giá trị có sẵn
    const queryParams = new URLSearchParams();
    if (location) queryParams.append("city", location);
    if (day) queryParams.append("day", day);
    if (maxGroupSize) queryParams.append("maxGroupSize", maxGroupSize);

    const res = await fetch(`${BASE_URL}/tours/search/getTourBySearch?${queryParams.toString()}`);

    if (!res.ok) {
      alert("Something went wrong");
      return;
    }

    const result = await res.json();

    navigate(`/tours/search?${queryParams.toString()}`, { state: result.data });
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i class="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>{t('LBL_SEARCH_BAR_LOCATION')}</h6>
              <input
                type="text"
                placeholder={t('LBL_SEARCH_BAR_LOCATION_INPUT')}
                ref={locationRef}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i class="ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>{t('LBL_SEARCH_BAR_DAY')}</h6>
              <input
                type="number"
                placeholder={t('LBL_SEARCH_BAR_DAY_INPUT')}
                ref={dayRef}
              />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group">
            <span>
              <i class="ri-group-line"></i>
            </span>
            <div>
              <h6>{t('LBL_SEARCH_BAR_MAX_PEOPLE')}</h6>
              <input type="number" placeholder={t('LBL_SEARCH_BAR_MAX_PEOPLE_INPUT')} ref={maxGroupSizeRef} />
            </div>
          </FormGroup>

          <span className="search__icon" type="submit" onClick={searchHandler}>
            <i class="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
