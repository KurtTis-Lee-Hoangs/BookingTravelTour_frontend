import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import "../styles/room-payment.css";
import { AuthContext } from "../context/AuthContext";
import momoLogo from "../assets/images/momo.png";
import zalopayLogo from "../assets/images/zalopay.png";
import vnpayLogo from "../assets/images/vnpay.png";
import { Col, Container, Row } from "reactstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RoomPayment = () => {
  const { t } = useTranslation(['hotel']);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const {
    data: room,
    loading,
    error,
  } = useFetch(`${BASE_URL}/hotels/room/${id}`);

  const [bookedDates, setBookedDates] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(room.price || 0);
  const [numNights, setNumNights] = useState(1);
  const [fullName, setFullName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    // getMonth() trả về từ 0-11, nên cần +1
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch(`${BASE_URL}/bookings/room/${id}/booked-dates`);
        if (!res.ok) {
          throw new Error("Failed to fetch booked dates");
        }
        const result = await res.json();
        // Chuyển đổi mảng các chuỗi ngày thành mảng các đối tượng Date
        const dates = result.data.map(dateStr => new Date(dateStr));
        setBookedDates(dates);
      } catch (err) {
        console.error(err.message);
        toast.error("Could not load room availability.");
      }
    };

    if (id) {
      fetchBookedDates();
    }
  }, [id]);

  useEffect(() => {
    if (room && room.price) {
        if (checkInDate && checkOutDate) {
            const nightDiff = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
            const calculatedNights = nightDiff > 0 ? nightDiff : 0;
            setNumNights(calculatedNights);
            setTotalPrice(calculatedNights * room.price);
        } else {
            setNumNights(0);
            setTotalPrice(0);
        }
    }
  }, [checkInDate, checkOutDate, room]);

  if (loading) return <h4 className="text-center pt-5">Loading...</h4>;
  if (error) return <h4 className="text-center pt-5">{error}</h4>;

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra định dạng số điện thoại
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // Regex dành cho số điện thoại Việt Nam
    return phoneRegex.test(phone);
  };

  // const handleCheckInDateChange = (e) => {
  //   const selectedDate = e.target.value;
  //   setCheckInDate(selectedDate);

  //   if (checkOutDate) {
  //     const checkIn = new Date(selectedDate);
  //     const checkOut = new Date(checkOutDate);
  //     const nightDiff = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
  //     // setNumNights(nightDiff > 0 ? nightDiff : 1);
  //     // setTotalPrice(room.price * numNights + numNights * 200000);
  //     const calculatedNights = nightDiff > 0 ? nightDiff : 1;
  //     setNumNights(calculatedNights);
  //     setTotalPrice(calculatedNights * room.price); // Cập nhật giá tiền
  //   }
  // };

  // const handleCheckOutDateChange = (e) => {
  //   const selectedDate = e.target.value;
  //   setCheckOutDate(selectedDate);

  //   // const checkIn = new Date(checkInDate);
  //   // const checkOut = new Date(selectedDate);
  //   // const nightDiff = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
  //   // setNumNights(nightDiff > 0 ? nightDiff : 1);
  //   // setTotalPrice(room.price * numNights + numNights * 200000);
  //   if (checkInDate) {
  //     const checkIn = new Date(checkInDate);
  //     const checkOut = new Date(selectedDate);
  //     const nightDiff = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
  //     const calculatedNights = nightDiff > 0 ? nightDiff : 1;
  //     setNumNights(calculatedNights);
  //     setTotalPrice(calculatedNights * room.price); // Cập nhật giá tiền
  //   }
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const errors = {};

    if (!fullName || fullName.split(" ").length < 2) {
      errors.fullName = "Please enter a valid full name (first and last name).";
    }

    if (!validatePhoneNumber(phoneNumber)) {
      errors.phoneNumber =
        "Please enter a valid phone number (e.g., 0912345678).";
    }

    if (!validateEmail(email)) {
      errors.email =
        "Please enter a valid email address (e.g., example@domain.com).";
    }

    if (!paymentMethod) {
      // alert("Please select a payment method.");
      toast.warning('Please select a payment method.')
      return;
    }

    if (!checkInDate || !checkOutDate) {
      // alert("Please select valid check-in and check-out dates.");
      toast.warning('Please select valid check-in and check-out dates.')
      return;
    }

    if (!user) {
      // alert("Please sign in to book the hotel room.");
      toast.warning('Please sign in to book the hotel room.')
      return;
    }

    // If there are any validation errors, show them and don't submit the form
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Proceed with the booking if no validation errors
    try {
      const bookingData = {
        hotelRoomId: id,
        userId: user._id,
        fullName,
        phoneNumber,
        checkInDate: formatDateToYYYYMMDD(checkInDate),
        checkOutDate: formatDateToYYYYMMDD(checkOutDate),
        totalPrice,
        paymentMethod,
        status: "Pending",
        isPayment: false,
      };

      const res = await fetch(`${BASE_URL}/hotels/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // alert(errorData.message || "Failed to create booking.");
        toast.error(errorData.message || "Failed to create booking.")
        return;
      }

      const result = await res.json();
      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        // alert("Booking created successfully!");
        toast.success('Booking created successfully!')
      }
    } catch (err) {
      console.error("Error during booking:", err.message);
      // alert("An error occurred while booking the room. Please try again.");
      toast.error('An error occurred while booking the room. Please try again.')
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  if (loading) return <h4 className="text-center pt-5">Loading...</h4>;
  if (error) return <h4 className="text-center pt-5">{error}</h4>;

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div className="room__payment">
              <div className="room__payment-form">
                <h3>{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION')}</h3>
                <form onSubmit={handleFormSubmit}>
                  <div className="form-payment__group">
                    <label htmlFor="name">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_FULL_NAME')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    {formErrors.fullName && (
                      <span className="error__text">{formErrors.fullName}</span>
                    )}
                  </div>
                  <div className="form-payment__group">
                    <label htmlFor="phone">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_PHONE_NUMBER')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    {formErrors.phoneNumber && (
                      <span className="error__text">
                        {formErrors.phoneNumber}
                      </span>
                    )}
                  </div>
                  <div className="form-payment__group">
                    <label htmlFor="email">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_EMAIL')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {formErrors.email && (
                      <span className="error__text">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="form-payment__group d-flex align-items-center gap-3">
                    <div className="w-100">
                        <label htmlFor="checkInDate">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_CHECK_IN_DATE')}</label>
                        <DatePicker
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={new Date()}
                            excludeDates={bookedDates}
                            placeholderText="Select check-in date"
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="w-100">
                        <label htmlFor="checkOutDate">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_CHECK_OUT_DATE')}</label>
                        <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsEnd
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
                            excludeDates={bookedDates}
                            placeholderText="Select check-out date"
                            className="w-100"
                            required
                        />
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="form-payment__group">
                    <label>{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_PAYMENT_METHOD')}</label>
                    <div className="payment__methods">
                      <div
                        className={`payment__option ${
                          paymentMethod === "ZaloPay" ? "selected" : ""
                        }`}
                        onClick={() => setPaymentMethod("ZaloPay")}
                      >
                        <img src={zalopayLogo} alt="ZaloPay" />
                        <span>ZaloPay</span>
                      </div>
                      <div
                        className={`payment__option ${
                          paymentMethod === "VNPay" ? "selected" : ""
                        }`}
                        onClick={() => setPaymentMethod("VNPay")}
                      >
                        <img src={vnpayLogo} alt="VNPay" />
                        <span>VNPay</span>
                      </div>
                      <div
                        className={`payment__option ${
                          paymentMethod === "Momo" ? "selected" : ""
                        }`}
                        onClick={() => setPaymentMethod("Momo")}
                      >
                        <img src={momoLogo} alt="Momo" />
                        <span>Momo</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn primary__btn payment__btn"
                  >
                    {t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_CONFIRM_PAYMENT')}
                  </button>
                </form>
              </div>

              <div className="room__payment-details">
                <h3 className="section__title">{t('LBL_HOTEL_ROOM_PAYMENT_INFO_TITLE')}</h3>
                <div className="room__detail">
                  <div className="room__detail-image">
                    <img
                      src={
                        (room.images &&
                          room.images.length > 0 &&
                          room.images[0]) ||
                        "/default-room.jpg"
                      }
                      alt={room.roomType}
                    />
                  </div>
                  <div className="room__detail-info">
                    <p>
                      <strong>{t('LBL_HOTEL_ROOM_PAYMENT_INFO_TYPE')}:</strong> {room.roomType}
                    </p>
                    <p>
                      <strong>{t('LBL_HOTEL_ROOM_PAYMENT_INFO_SQUARE')}:</strong> {room.square || "Not specified"}
                    </p>
                    <p>
                      <strong>{t('LBL_HOTEL_ROOM_PAYMENT_INFO_MAX_OCCUPANCY')}:</strong> {room.maxOccupancy} {t('LBL_HOTEL_ROOM_PEOPLE')}
                    </p>
                    <p>
                      <strong>{t('LBL_HOTEL_ROOM_PAYMENT_INFO_PRICE')}:</strong> {totalPrice} VND
                    </p>
                  </div>
                </div>

                <div className="date__selection">
                  <div className="date__box">
                    <p className="date__title">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_CHECK_IN_DATE')}</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(checkInDate)}
                      readOnly
                      className="date__input"
                    />
                    <p className="time__info">{t('LBL_HOTEL_ROOM_PAYMENT_INFO_FROM')} 10:00 AM</p>
                  </div>

                  <div className="night__info">
                    <p>
                      <strong>{numNights} night(s)</strong>
                    </p>
                  </div>

                  <div className="date__box">
                    <p className="date__title">{t('LBL_HOTEL_ROOM_PAYMENT_INFORMATION_CHECK_OUT_DATE')}</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(checkOutDate)}
                      readOnly
                      className="date__input"
                    />
                    <p className="time__info">{t('LBL_HOTEL_ROOM_PAYMENT_INFO_BEFORE')} 13:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RoomPayment;
