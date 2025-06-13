import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { BASE_URL } from "../../../utils/config";
import useFetch from "../../../hooks/useFetch";
import AddTourModal from "./AddTourModal";
import EditTourModal from "./EditTourModal";
import { Delete, Edit } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

const ToursTable = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: tour,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours`, refreshKey);
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [newTour, setNewTour] = useState({
    title: "",
    city: "",
    address: "",
    day: "",
    photo: null,
    desc: "",
    price: "",
    maxGroupSize: "",
    featured: false,
  });

  const [editModal, setEditModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [originalTour, setOriginalTour] = useState(null);
  const openEditModal = (tour) => {
    setOriginalTour(tour); // Lưu bản sao dữ liệu gốc
    setEditingTour(tour); // Lưu thông tin người dùng vào state
    setEditModal(true); // Mở modal
  };

  const toggleModal = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTour((prev) => ({
      ...prev,
      [name]: name === "featured" ? value === "true" : value, // Chuyển đổi sang Boolean nếu là featured
    }));
  };

  const handleAddTour = async () => {
    // Validate fields
    const { day, price, maxGroupSize } = newTour;
    const errors = [];
    if (day < 1) errors.push("Day must be greater than or equal to 1.");
    if (price < 1) errors.push("Price must be greater than or equal to 1.");
    if (maxGroupSize < 1)
      errors.push("Max Group Size must be greater than or equal to 1.");
    if (errors.length > 0) {
      // alert(errors.join("\n")); // Hiển thị tất cả các lỗi, mỗi lỗi trên một dòng.
      toast.error(errors.join("\n"));
      return;
    }

    const formData = new FormData();
    for (const key in newTour) {
      formData.append(key, newTour[key]);
    }

    try {
      const responseAdd = await fetch(`${BASE_URL}/tours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTour),
        credentials: "include",
      });

      if (!responseAdd.ok) {
        // throw new Error("Failed to add tour");
        const errorData = await responseAdd.json();
        throw new Error(errorData.message || "Failed to add tour");
      }
      setRefreshKey((prevKey) => prevKey + 1);
      setNewTour({
        title: "",
        city: "",
        address: "",
        day: "",
        photo: null,
        desc: "",
        price: "",
        maxGroupSize: "",
        featured: false,
      });
      toggleModal();
    } catch (error) {
      // console.error("Error adding tour:", error);
      // alert(error.message);
      toast.error(error.message);
    }
  };

  const handlePhotoChange = async (e, setTourState) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Bắt đầu tải ảnh lên
      // Tạo FormData để gửi ảnh lên Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "avatarImg"); // Đảm bảo cấu hình trên Cloudinary cho phép tải lên không xác thực

      try {
        // Gửi ảnh lên Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/traveltour/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          setTourState((prev) => ({
            ...prev,
            photo: data.secure_url, // Add the new photo URL to the state
          }));
        }
      } catch (error) {
        console.error("Error uploading photo to Cloudinary:", error);
      } finally {
        setIsUploading(false); // Kết thúc quá trình tải ảnh lên
      }
    }
  };

  const handleDeleteTour = async (tourId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tour?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${BASE_URL}/tours/${tourId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isDelete: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete tour");
      }
      setRefreshKey((prevKey) => prevKey + 1);
      toast.success("Delete tour success!")
    } catch (error) {
      // console.error("Error deleting tour:", error);
      toast.error("Error deleting tour")
    }
  };

  const handleEditTour = async () => {
    try {
      const updatedFields = {};
      // Check for changes in the user fields
      Object.keys(editingTour).forEach((key) => {
        if (editingTour[key] !== originalTour[key]) {
          updatedFields[key] = editingTour[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        alert("No changes made.");
        return;
      }

      const response = await fetch(`${BASE_URL}/tours/${editingTour._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update tour");
      }
      setRefreshKey((prevKey) => prevKey + 1);
      setEditModal(false); // Close modal after update
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  const truncateText = (text) => {
    return text.length > 15 ? text.slice(0, 10) + "..." : text;
  };

  const formatCurrency = (price) => {
    return Number(price).toLocaleString("vi-VN") + " VND";
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const sortTours = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    if (tour) {
      tour.sort((a, b) => {
        // Kiểm tra nếu key là các trường số
        if (["day", "price", "maxGroupSize"].includes(key)) {
          const valueA = Number(a[key]) || 0; // Chuyển về số, mặc định là 0 nếu không phải số
          const valueB = Number(b[key]) || 0;
          return direction === "asc" ? valueA - valueB : valueB - valueA;
        }

        // Sắp xếp chuỗi cho các trường khác
        const valueA = a[key]?.toString().toLowerCase() || "";
        const valueB = b[key]?.toString().toLowerCase() || "";
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
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

  const [searchQuery, setSearchQuery] = useState("");
  // Filter users based on search query
  const filteredTours = tour?.filter((tour) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      tour.title.toLowerCase().includes(searchTerm) ||
      tour.city.toLowerCase().includes(searchTerm) ||
      tour.address.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <Box display="flex" gap={3} mb={3}>
        <TextField
          label="Search by Title, City or Address"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={toggleModal}>
          Add Tour
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Avatar
              </TableCell>
              <TableCell
                onClick={() => sortTours("title")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Title {renderSortIcon("title")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("city")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                City {renderSortIcon("city")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("address")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Address {renderSortIcon("address")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("day")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Day {renderSortIcon("day")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("desc")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Description {renderSortIcon("desc")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("price")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 10,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Price {renderSortIcon("price")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("maxGroupSize")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Max Group Size {renderSortIcon("maxGroupSize")}
              </TableCell>
              <TableCell
                onClick={() => sortTours("featured")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                Featured {renderSortIcon("featured")}
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
            {filteredTours?.map((tour) => (
              <TableRow key={tour._id}>
                <TableCell>
                  <img
                    src={tour.photo}
                    alt="Tour"
                    style={{ width: 50, height: 50, borderRadius: "50%" }}
                  />
                </TableCell>
                <TableCell>{truncateText(tour.title)}</TableCell>
                <TableCell>{truncateText(tour.city)}</TableCell>
                <TableCell>{truncateText(tour.address)}</TableCell>
                <TableCell>{truncateText(tour.day)}</TableCell>
                <TableCell>{truncateText(tour.desc)}</TableCell>
                <TableCell>{formatCurrency(tour.price)}</TableCell>
                <TableCell>{truncateText(tour.maxGroupSize)}</TableCell>
                <TableCell>
                  {tour.featured ? (
                    <Typography color="green">Yes</Typography>
                  ) : (
                    <Typography color="red">No</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {/* <IconButton
                    color="primary"
                    onClick={() => openEditModal(tour)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteTour(tour._id)}
                  >
                    <Delete />
                  </IconButton> */}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => openEditModal(tour)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteTour(tour._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddTourModal
        isOpen={modal}
        toggle={toggleModal}
        newTour={newTour}
        handleChange={handleChange}
        handleAddTour={handleAddTour}
        handlePhotoChange={handlePhotoChange}
        setNewTour={setNewTour}
      />
      <EditTourModal
        isOpen={editModal}
        toggle={() => setEditModal(false)}
        editingTour={editingTour}
        setEditingTour={setEditingTour}
        handleEditTour={handleEditTour}
        handlePhotoChange={handlePhotoChange}
      />
    </Box>
  );
};

export default ToursTable;
