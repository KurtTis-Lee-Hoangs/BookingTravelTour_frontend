import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/config";
import useFetch from "../../hooks/useFetch";
import { Table, Container, Row, Col, Input } from "reactstrap";
import "./booking-history.css";
import NewSletter from "../../shared/NewSletter";
import { useTranslation } from "react-i18next";

const BookingHistory = () => {
  const { t } = useTranslation(['history']);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const {
    data: bookingData,
    loading,
    error,
  } = useFetch(`${BASE_URL}/bookings/user/history`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [bookingData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Hàm định dạng số điện thoại
  const formatPhoneNumber = (phone) => {
    const phoneStr = phone.toString();
    return "+84 " + phoneStr.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  // Sort function
  const sortBookings = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    bookingData?.sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      // Handle date sorting for "bookAt"
      if (key === "bookAt") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
        // Sort by date (ascending or descending based on the direction)
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Handle numeric sorting (e.g., totalPrice, guestSize)
      if (key === "guestSize" || key === "totalPrice") {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      } else {
        // For string-based fields, handle case-insensitive sorting
        valueA = valueA?.toString().toLowerCase() || "";
        valueB = valueB?.toString().toLowerCase() || "";
      }

      // General sorting logic for string or number comparisons
      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filter bookings based on search query
  const filteredBookings = bookingData?.filter((booking) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      booking.userEmail.toLowerCase().includes(searchTerm) ||
      booking.tourName.toLowerCase().includes(searchTerm) ||
      booking.fullName.toLowerCase().includes(searchTerm) ||
      booking.phone.toString().toLowerCase().includes(searchTerm) ||
      new Date(booking.bookAt)
        .toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  const renderSortIcon = (key) => {
    const isActive = sortConfig?.key === key;
    return (
      <i
        className={`ri-arrow-up-down-line ${isActive ? "text-primary" : ""}`}
        style={{ marginLeft: "5px", fontSize: "1rem" }}
      ></i>
    );
  };

  const titlePreview = (title) =>
    title.length > 35 ? title.slice(0, 35) + "..." : title;

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col>
              <div className="booking-history-table">
                <h2 className="table-title">{t('LBL_BOOKING_HISTORY')}</h2>
                <div className="d-flex gap-3 mb-3">
                  <Input
                    type="text"
                    placeholder={t('LBL_BOOKING_HISTORY_PLACEHOLDER')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "600px", boxShadow: "none" }}
                  />
                </div>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th onClick={() => sortBookings("userEmail")}>
                        {t('LBL_BOOKING_HISTORY_USER_NAME')} {renderSortIcon("userEmail")}
                      </th>
                      <th onClick={() => sortBookings("fullName")}>
                        {t('LBL_BOOKING_HISTORY_NAME')} {renderSortIcon("fullName")}
                      </th>
                      <th onClick={() => sortBookings("tourName")}>
                        {t('LBL_BOOKING_HISTORY_TOUR_NAME')} {renderSortIcon("tourName")}
                      </th>
                      <th onClick={() => sortBookings("guestSize")}>
                        {t('LBL_BOOKING_HISTORY_SIZE')} {renderSortIcon("guestSize")}
                      </th>
                      <th onClick={() => sortBookings("phone")}>
                        {t('LBL_BOOKING_HISTORY_PHONE')} {renderSortIcon("phone")}
                      </th>
                      <th onClick={() => sortBookings("bookAt")}>
                        {t('LBL_BOOKING_HISTORY_BOOKING_DATE')} {renderSortIcon("bookAt")}
                      </th>
                      <th onClick={() => sortBookings("totalPrice")}>
                        {t('LBL_BOOKING_HISTORY_TOTAL_PRICE')} {renderSortIcon("totalPrice")}
                      </th>
                      <th onClick={() => sortBookings("isPayment")}>
                        {t('LBL_BOOKING_HISTORY_PAYMENT')}
                        {renderSortIcon("isPayment")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings?.length > 0 ? (
                      filteredBookings.map((booking) => {
                        const formattedBookAt = new Date(
                          booking.bookAt
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        });
                        const formattedPhone = formatPhoneNumber(booking.phone);
                        const formattedPrice = formatCurrency(
                          booking.totalPrice
                        );

                        return (
                          <tr key={booking._id}>
                            <td>{booking.userEmail}</td>
                            <td>{booking.fullName}</td>
                            <td>{titlePreview(booking.tourName)}</td>
                            <td>{booking.guestSize}</td>
                            <td>{formattedPhone}</td>
                            <td>{formattedBookAt}</td>
                            <td>{formattedPrice}</td>
                            <td>
                              {booking.isPayment ? (
                                <span style={{ color: "green" }}>{t('LBL_BOOKING_HISTORY_RESULT_PAYMENT_YES')}</span>
                              ) : (
                                <span style={{ color: "red" }}>{t('LBL_BOOKING_HISTORY_RESULT_PAYMENT_NO')}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          {t('LBL_NO_BOOKING_FOUND')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <NewSletter />
    </>
  );
};

export default BookingHistory;
