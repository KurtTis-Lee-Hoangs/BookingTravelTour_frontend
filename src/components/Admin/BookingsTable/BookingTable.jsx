import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BASE_URL } from "../../../utils/config";
import useFetch from "../../../hooks/useFetch";
import EditBookingModal from "./EditBookingModal";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const BookingsTable = () => {
  const { t } = useTranslation(["admin"]);
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: booking,
    loading,
    error,
  } = useFetch(`${BASE_URL}/bookings`, refreshKey);

  const [editModal, setEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [originalBooking, setOriginalBooking] = useState(null);
  const openEditModal = (booking) => {
    setOriginalBooking(booking); // Lưu bản sao dữ liệu gốc
    setEditingBooking(booking); // Lưu thông tin người dùng vào state
    setEditModal(true); // Mở modal
  };

  const handleEditBooking = async () => {
    try {
      const updatedFields = {};
      // Check for changes in the user fields
      Object.keys(editingBooking).forEach((key) => {
        if (editingBooking[key] !== originalBooking[key]) {
          updatedFields[key] = editingBooking[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        // alert("No changes made.");
        toast.warning("No changes made.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/bookings/${editingBooking._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tour");
      }

      toast.success("Booking updated successfully!");
      setRefreshKey((prevKey) => prevKey + 1);
      setEditModal(false); // Close modal after update
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error.message);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to confirm this booking? An email with payment details will be sent to the user."
    );

    if (!userConfirmed) return;

    try {
      const response = await fetch(
        `${BASE_URL}/bookings/${bookingId}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}` // (Nếu có)
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to confirm booking");
      }

      // Thay đổi thông báo cho phù hợp với trang admin
      toast.success("Booking confirmed! An email has been sent to the user.");

      // Không còn chuyển hướng trang. Thay vào đó, chúng ta sẽ làm mới lại danh sách booking
      // để admin thấy được sự thay đổi trạng thái ngay lập tức.
      setRefreshKey((prevKey) => prevKey + 1); // <-- Thêm lại dòng này
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error(error.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    // Cập nhật lời thoại xác nhận cho phù hợp với hành động hủy
    const userConfirmed = window.confirm(
      "Are you sure you want to CANCEL this booking? This action cannot be undone and a notification email will be sent to the user."
    );

    if (!userConfirmed) return;

    try {
      // Thay đổi endpoint API sang route xử lý việc hủy
      // Dựa trên các trao đổi trước, route này cần được định nghĩa ở backend
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
        // <-- THAY ĐỔI ENDPOINT
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}` // (Nếu có)
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Cập nhật thông báo lỗi
        throw new Error(result.message || "Failed to cancel booking");
      }

      // Cập nhật thông báo thành công
      toast.success(
        "Booking cancelled successfully! An email has been sent to the user."
      );

      // Giữ nguyên logic làm mới UI, rất quan trọng để admin thấy trạng thái 'Canceled'
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      // Cập nhật log lỗi
      console.error("Error cancelling booking:", error);
      toast.error(error.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isDelete: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully!");
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message);
    }
  };

  // Format phone number with +84 prefix
  const formatPhoneNumber = (phone) => {
    const phoneStr = phone.toString();
    return "+84 " + phoneStr.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  const truncateText = (text) => {
    return text.length > 15 ? text.slice(0, 15) + "..." : text;
  };

  const formatCurrency = (price) => {
    return Number(price).toLocaleString("vi-VN") + " VND";
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const sortBookings = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    const isActive = sortConfig.key === key;
    return (
      <i
        className={`ri-arrow-up-down-line ${isActive ? "text-primary" : ""}`}
        style={{ marginLeft: "5px", fontSize: "1rem" }}
      ></i>
    );
  };

  // const [searchQuery, setSearchQuery] = useState("");
  const [searchTour, setSearchTour] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  // Filter users based on search query
  const filteredBookings = booking?.filter((booking) => {
    const tourMatch = booking.tourName
      .toLowerCase()
      .includes(searchTour.toLowerCase());
    const emailMatch = booking.userEmail
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    // Format bookAt to dd/mm/yyyy
    const bookAtFormatted = new Date(booking.bookAt).toLocaleDateString(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
    const dateMatch = bookAtFormatted.includes(searchDate);
    return tourMatch && emailMatch && dateMatch;
  });

  // Group bookings by tourName and then by bookAt
  const groupBookings = (bookings) => {
    const grouped = {};
    bookings.forEach((booking) => {
      const tour = booking.tourName;
      const date = new Date(booking.bookAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!grouped[tour]) grouped[tour] = {};
      if (!grouped[tour][date]) grouped[tour][date] = [];
      grouped[tour][date].push(booking);
    });
    return grouped;
  };

  const grouped = filteredBookings ? groupBookings(filteredBookings) : {};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label={t("LBL_MANAGE_BOOKING_SEARCH_TOUR_NAME")}
          value={searchTour}
          onChange={(e) => setSearchTour(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label={t("LBL_MANAGE_BOOKING_SEARCH_DATE")}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="dd/mm/yyyy"
        />
        <TextField
          label={t("LBL_MANAGE_BOOKING_SEARCH_EMAIL")}
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Box>
      {/* Accordion Grouped View */}
      {Object.keys(grouped).length === 0 && (
        <Typography>{t("LBL_MANAGE_BOOKING_NOT_FOUND")}</Typography>
      )}
      {Object.entries(grouped).map(([tourName, dates]) => (
        <Accordion key={tourName} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {t("LBL_MANAGE_BOOKING_TOUR_TITLE")}: {tourName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(dates)
              .sort(([dateA], [dateB]) => {
                // Chuyển "dd/mm/yyyy" thành Date để so sánh
                const [dayA, monthA, yearA] = dateA.split("/").map(Number);
                const [dayB, monthB, yearB] = dateB.split("/").map(Number);
                const dA = new Date(yearA, monthA - 1, dayA);
                const dB = new Date(yearB, monthB - 1, dayB);
                return dA - dB;
              })
              .map(([date, bookingsByDate]) => {
                // Chuyển "dd/mm/yyyy" thành Date object để so sánh với hôm nay
                const [day, month, year] = date.split("/").map(Number);
                const bookingDate = new Date(year, month - 1, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Đặt về đầu ngày để so sánh chính xác

                const isDeparted = bookingDate <= today;

                return (
                  <Accordion
                    key={date}
                    sx={{ ml: 2 }}
                    defaultExpanded={!isDeparted}
                    // expanded={!isDeparted ? undefined : false}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {t("LBL_MANAGE_BOOKING_DAY_TITLE")}: {date}
                        {isDeparted && (
                          <span style={{ color: "blue", marginLeft: 8 }}>
                            ({t("LBL_MANAGE_BOOKING_TOUR_DEPARTED")})
                          </span>
                        )}{" "}
                        ( {t("LBL_MANAGE_BOOKING_TOTAL_TICKET")}:{" "}
                        {bookingsByDate.reduce(
                          (sum, b) => sum + Number(b.guestSize || 0),
                          0
                        )}{" "}
                        {t("LBL_MANAGE_BOOKING_TICKET")}
                        {" | "}
                        {t("LBL_MANAGE_BOOKING_TICKET_WAITING")}:{" "}
                        {bookingsByDate
                          .filter((b) => b.status === "Waiting")
                          .reduce(
                            (sum, b) => sum + Number(b.guestSize || 0),
                            0
                          )} {t("LBL_MANAGE_BOOKING_TICKET")}
                        {" | "}
                        {t("LBL_MANAGE_BOOKING_TICKET_PAIDING")}:{" "}
                        {bookingsByDate
                          .filter((b) => b.status === "Paiding")
                          .reduce(
                            (sum, b) => sum + Number(b.guestSize || 0),
                            0
                          )} {t("LBL_MANAGE_BOOKING_TICKET")}
                        {" | "}
                        {t("LBL_MANAGE_BOOKING_TICKET_COMPLETED")}:{" "}
                        {bookingsByDate
                          .filter((b) => b.status === "Completed")
                          .reduce(
                            (sum, b) => sum + Number(b.guestSize || 0),
                            0
                          )} {t("LBL_MANAGE_BOOKING_TICKET")}
                        {" | "}
                        {t("LBL_MANAGE_BOOKING_TICKET_CANCELED")}:{" "}
                        {bookingsByDate
                          .filter((b) => b.status === "Canceled")
                          .reduce(
                            (sum, b) => sum + Number(b.guestSize || 0),
                            0
                          )} {t("LBL_MANAGE_BOOKING_TICKET")}
                        )
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {/* <TableCell
                            onClick={() => sortBookings("userId")}
                            sx={{
                              cursor: "pointer",
                              fontWeight: "bold",
                              paddingRight: 1,
                              "&:hover": { color: "primary.main" },
                              whiteSpace: "nowrap", // Prevent wrapping
                            }}
                          >
                            UserID {renderSortIcon("userId")}
                          </TableCell> */}
                              <TableCell
                                onClick={() => sortBookings("userEmail")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_USER_EMAIL")}{" "}
                                {renderSortIcon("userEmail")}
                              </TableCell>
                              <TableCell
                                onClick={() => sortBookings("fullName")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_FULLNAME")}{" "}
                                {renderSortIcon("fullName")}
                              </TableCell>
                              <TableCell
                                onClick={() => sortBookings("guestSize")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_GUEST_SIZE")}{" "}
                                {renderSortIcon("guestSize")}
                              </TableCell>
                              <TableCell
                                onClick={() => sortBookings("phone")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_PHONE")}{" "}
                                {renderSortIcon("phone")}
                              </TableCell>
                              <TableCell
                                onClick={() => sortBookings("totalPrice")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_TOTAL_PRICE")}
                                {renderSortIcon("totalPrice")}
                              </TableCell>
                              <TableCell
                                onClick={() => sortBookings("status")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_STATUS")}{" "}
                                {renderSortIcon("status")}
                              </TableCell>
                              <TableCell
                                onClick={() => sortBookings("isPayment")}
                                sx={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  paddingRight: 1,
                                  "&:hover": { color: "primary.main" },
                                  whiteSpace: "nowrap", // Prevent wrapping
                                }}
                              >
                                {t("LBL_MANAGE_BOOKING_PAYMENT")}{" "}
                                {renderSortIcon("status")}
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                {t("LBL_MANAGE_BOOKING_ACTION")}{" "}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[...bookingsByDate]
                              .sort((a, b) => {
                                if (!sortConfig.key) return 0;
                                let valueA = a[sortConfig.key];
                                let valueB = b[sortConfig.key];

                                // Handle date sorting
                                if (sortConfig.key === "bookAt") {
                                  valueA = new Date(valueA);
                                  valueB = new Date(valueB);
                                  return sortConfig.direction === "asc"
                                    ? valueA - valueB
                                    : valueB - valueA;
                                }

                                // Handle numeric sorting
                                if (
                                  sortConfig.key === "guestSize" ||
                                  sortConfig.key === "totalPrice" ||
                                  sortConfig.key === "phone"
                                ) {
                                  valueA = parseFloat(valueA) || 0;
                                  valueB = parseFloat(valueB) || 0;
                                } else {
                                  valueA =
                                    valueA?.toString().toLowerCase() || "";
                                  valueB =
                                    valueB?.toString().toLowerCase() || "";
                                }

                                if (valueA < valueB)
                                  return sortConfig.direction === "asc"
                                    ? -1
                                    : 1;
                                if (valueA > valueB)
                                  return sortConfig.direction === "asc"
                                    ? 1
                                    : -1;
                                return 0;
                              })
                              .map((booking) => (
                                <TableRow key={booking._id}>
                                  {/* <TableCell>
                              {truncateText(booking.userId)}
                            </TableCell> */}
                                  <TableCell>
                                    {truncateText(booking.userEmail)}
                                  </TableCell>
                                  <TableCell>
                                    {truncateText(booking.fullName)}
                                  </TableCell>
                                  <TableCell>
                                    {truncateText(booking.guestSize)}
                                  </TableCell>
                                  <TableCell>
                                    {formatPhoneNumber(booking.phone)}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(booking.totalPrice)}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      style={{
                                        color:
                                          booking.status === "Completed"
                                            ? "green"
                                            : booking.status === "Canceled"
                                            ? "red"
                                            : booking.status === "Paiding"
                                            ? "orange"
                                            : "gray",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {booking.status === "Completed"
                                        ? t('LBL_MANAGE_BOOKING_TICKET_COMPLETED')  
                                        : booking.status === "Canceled"
                                        ? t('LBL_MANAGE_BOOKING_TICKET_CANCELED')  
                                        : booking.status === "Paiding"
                                        ? t('LBL_MANAGE_BOOKING_TICKET_PAIDING')  
                                        : booking.status === "Waiting"
                                        ? t('LBL_MANAGE_BOOKING_TICKET_WAITING')  
                                        : booking.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {booking.isPayment ? (
                                      <span style={{ color: "green" }}>
                                        {t('LBL_MANAGE_BOOKING_TICKET_YES')}
                                      </span>
                                    ) : (
                                      <span style={{ color: "red" }}>{t('LBL_MANAGE_BOOKING_TICKET_NO')}</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outlined"
                                      color="success"
                                      style={{ marginRight: "6px" }}
                                      onClick={() =>
                                        handleConfirmBooking(booking._id)
                                      }
                                    >
                                      {t('LBL_MANAGE_BOOKING_TICKET_BTN_CONFIRM')}
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      color="warning"
                                      style={{ marginRight: "6px" }}
                                      onClick={() =>
                                        handleCancelBooking(booking._id)
                                      }
                                    >
                                      {t('LBL_MANAGE_BOOKING_TICKET_BTN_CANCEL')}
                                    </Button>
                                    <Button
                                      onClick={() => openEditModal(booking)}
                                      variant="outlined"
                                      color="primary"
                                      style={{ marginRight: "6px" }}
                                    >
                                      {t('LBL_MANAGE_BOOKING_TICKET_BTN_EDIT')}
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleDeleteBooking(booking._id)
                                      }
                                      variant="outlined"
                                      color="error"
                                    >
                                      {t('LBL_MANAGE_BOOKING_TICKET_BTN_DELETE')}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </AccordionDetails>
        </Accordion>
      ))}

      {editModal && (
        <EditBookingModal
          isOpen={editModal}
          toggle={() => setEditModal(false)}
          editingBooking={editingBooking}
          setEditingBooking={setEditingBooking}
          handleEditBooking={handleEditBooking}
        />
      )}
    </div>
  );
};

export default BookingsTable;
