import React, { useState, useEffect } from "react";
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
  Box,
  Paper,
} from "@mui/material";
import { BASE_URL } from "../../../utils/config";
import useFetch from "../../../hooks/useFetch";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

const BookingsTable = () => {
  const [userMap, setUserMap] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: booking,
    loading,
    error,
  } = useFetch(`${BASE_URL}/hotels/admin/getAllBookingHotel`, refreshKey);

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BASE_URL}/hotels/admin/deleteBookingHotel/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isDelete: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      toast.success("Booking deleted successfully!");
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.message);
    }
  };

  const handleCheckoutBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to checkout?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BASE_URL}/hotels/admin/checkoutBookingHotel/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isCheckout: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to checkout");
      }

      toast.success("Booking deleted successfully!");
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.message);
    }
  };

  const truncateText = (text) => {
    return text.length > 15 ? text.slice(0, 15) + "..." : text;
  };

  const formatCurrency = (price) => {
    return Number(price).toLocaleString("vi-VN") + " VND";
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Đảo chiều sắp xếp nếu click lại cùng 1 cột
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      // Nếu click sang cột khác thì mặc định tăng dần
      return { key, direction: "asc" };
    });
  };

  const sortBookings = (data) => {
    const { key, direction } = sortConfig;
    if (!key) return data;

    return [...data].sort((a, b) => {
      let valueA, valueB;

      switch (key) {
        case "email":
          valueA =
            userMap[a.userId]?.email?.toLowerCase() ||
            a.userId?.toLowerCase() ||
            "";
          valueB =
            userMap[b.userId]?.email?.toLowerCase() ||
            b.userId?.toLowerCase() ||
            "";
          break;
        case "userId":
          valueA = a.userId?.toString().toLowerCase() || "";
          valueB = b.userId?.toString().toLowerCase() || "";
          break;
        case "roomNumber":
          valueA = a.hotelRoomId?.roomNumber || "";
          valueB = b.hotelRoomId?.roomNumber || "";
          break;
        case "roomType":
          valueA = a.hotelRoomId?.roomType?.toLowerCase() || "";
          valueB = b.hotelRoomId?.roomType?.toLowerCase() || "";
          break;
        case "checkInDate":
          valueA = new Date(a.checkInDate);
          valueB = new Date(b.checkInDate);
          break;
        case "checkOutDate":
          valueA = new Date(a.checkOutDate);
          valueB = new Date(b.checkOutDate);
          break;
        case "totalPrice":
          valueA = parseFloat(a.totalPrice) || 0;
          valueB = parseFloat(b.totalPrice) || 0;
          break;
        case "paymentMethod":
          valueA = a.paymentMethod?.toLowerCase() || "";
          valueB = b.paymentMethod?.toLowerCase() || "";
          break;
        case "isPayment":
          valueA = a.isPayment ? 1 : 0;
          valueB = b.isPayment ? 1 : 0;
          break;
        case "isDelete":
          valueA = a.isPayment ? 1 : 0;
          valueB = b.isPayment ? 1 : 0;
          break;
        default:
          valueA = "";
          valueB = "";
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });
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

  const [searchEmail, setSearchEmail] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState("");
  const [searchCheckOut, setSearchCheckOut] = useState("");

  const filteredBookings = booking?.filter((b) => {
    const userEmail = userMap[b.userId]?.email?.toLowerCase() || "";
    const checkInDate = new Date(b.checkInDate)
      .toLocaleDateString("vi-VN")
      .toLowerCase();
    const checkOutDate = new Date(b.checkOutDate)
      .toLocaleDateString("vi-VN")
      .toLowerCase();

    return (
      userEmail.includes(searchEmail.toLowerCase()) &&
      checkInDate.includes(searchCheckIn.toLowerCase()) &&
      checkOutDate.includes(searchCheckOut.toLowerCase())
    );
  });

  // Fetch user info for all unique userIds after bookings loaded
  useEffect(() => {
    if (!booking || booking.length === 0) return;

    // Lấy danh sách userId duy nhất
    const uniqueUserIds = [
      ...new Set(booking.map((b) => b.userId).filter(Boolean)),
    ];

    // Chỉ fetch những user chưa có trong userMap
    const userIdsToFetch = uniqueUserIds.filter((id) => !userMap[id]);

    if (userIdsToFetch.length === 0) return;

    const fetchUsers = async () => {
      const newUserMap = {};
      await Promise.all(
        userIdsToFetch.map(async (userId) => {
          try {
            const res = await fetch(`${BASE_URL}/users/${userId}`, {
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
            const data = await res.json();
            if (data?.data) {
              newUserMap[userId] = data.data;
            }
          } catch (e) {
            // Có thể log lỗi nếu cần
          }
        })
      );
      setUserMap((prev) => ({ ...prev, ...newUserMap }));
    };

    fetchUsers();
    // eslint-disable-next-line
  }, [booking]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <Box className="d-flex gap-3 mb-3">
        <TextField
          label="Search Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Search Check-in (dd/mm/yyyy)"
          value={searchCheckIn}
          onChange={(e) => setSearchCheckIn(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Search Check-out (dd/mm/yyyy)"
          value={searchCheckOut}
          onChange={(e) => setSearchCheckOut(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1500 }}>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("email")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Email {renderSortIcon("email")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("roomNumber")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Room ID {renderSortIcon("roomNumber")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("roomType")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Room Type {renderSortIcon("roomType")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("checkInDate")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                CheckIn {renderSortIcon("checkInDate")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("checkOutDate")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                CheckOut {renderSortIcon("checkOutDate")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("totalPrice")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Total {renderSortIcon("totalPrice")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("paymentMethod")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Method {renderSortIcon("paymentMethod")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("isPayment")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Payment {renderSortIcon("isPayment")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("isCheckout")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                isCheckout {renderSortIcon("isCheckout")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("isDelete")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Cancel {renderSortIcon("isDelete")}
              </TableCell>
              <TableCell
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBookings(filteredBookings)?.map((booking) => {
              const formattedCheckIn = new Date(
                booking.checkInDate
              ).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const formattedCheckOut = new Date(
                booking.checkOutDate
              ).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const user = userMap[booking.userId];
              return (
                <TableRow key={booking._id}>
                  {/* <TableCell>{truncateText(booking.userId)}</TableCell> */}
                  {/* <TableCell>{booking.userId}</TableCell> */}
                  <TableCell>{truncateText(user ? user.email : booking.userId)}</TableCell>
                  <TableCell>{booking.hotelRoomId?.roomNumber}</TableCell>
                  <TableCell>
                    {truncateText(booking.hotelRoomId?.roomType)}
                  </TableCell>
                  <TableCell>{formattedCheckIn}</TableCell>
                  <TableCell>{formattedCheckOut}</TableCell>
                  <TableCell>{formatCurrency(booking.totalPrice)}</TableCell>
                  <TableCell>{booking.paymentMethod}</TableCell>
                  <TableCell>
                    {booking.isPayment ? (
                      <span style={{ color: "green" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.isCheckout ? (
                      <span style={{ color: "green" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.isDelete ? (
                      <span style={{ color: "green" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleCheckoutBooking(booking._id)}
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: "10px" }}
                    >
                      CheckOut
                    </Button>
                    <Button
                      onClick={() => handleDeleteBooking(booking._id)}
                      variant="outlined"
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingsTable;
