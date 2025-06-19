import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import { BASE_URL } from "../../../utils/config";
import { useTranslation } from "react-i18next";

const EditRoomModal = ({ open, onClose, hotelId, onRoomEdited, roomData }) => {
  const { t } = useTranslation(["admin"]);
  const [newRoom, setNewRoom] = useState({
    hotelId: hotelId,
    square: "",
    roomType: "",
    maxOccupancy: "",
    price: "",
    images: "",
    status: "Available",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (roomData) {
      setNewRoom(roomData); // Gán thông tin phòng hiện tại vào newRoom
    }
  }, [roomData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "avatarImg");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/traveltour/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          setNewRoom((prev) => ({
            ...prev,
            images: data.secure_url,
          }));
        }
      } catch (error) {
        console.error("Error uploading photo to Cloudinary:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmitEditRoom = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${BASE_URL}/hotels/rooms/${newRoom._id}`, { // Dùng _id thay vì hotelId
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newRoom),
      });
      const data = await response.json();
  
      if (data.success) {
        onRoomEdited(data.data); // Gọi callback với phòng đã chỉnh sửa
        onClose();
      } else {
        console.error("Error editing room");
      }
    } catch (error) {
      console.error("Error editing room", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 400,
        }}
      >
        <h3>{t('LBL_HOTEL_EDIT_ROOM_TITLE')}</h3>
        <form onSubmit={handleSubmitEditRoom}>
          <TextField
            label={t('LBL_HOTEL_ADD_ROOM_SQUARE')}
            name="square"
            value={newRoom.square}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label={t('LBL_HOTEL_TABLE_ROOM_TYPE')}
            name="roomType"
            value={newRoom.roomType}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label={t('LBL_HOTEL_TABLE_ROOM_MAX_OCCUPANCY')}
            name="maxOccupancy"
            value={newRoom.maxOccupancy}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label={t('LBL_HOTEL_TABLE_ROOM_PRICE')}
            name="price"
            value={newRoom.price}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            select
            label={t('LBL_HOTEL_TABLE_ROOM_STATUS')}
            name="status"
            value={newRoom.status}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Available">{t('LBL_HOTEL_EDIT_ROOM_AVAILABLE')}</MenuItem>
            <MenuItem value="Unavailable">{t('LBL_HOTEL_EDIT_ROOM_UNAVAILABLE')}</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            {t('LBL_HOTEL_ADD_ROOM_UPLOAD_IMAGE')}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </Button>
          {isUploading && <p>Uploading image...</p>}
          <Button type="submit" variant="contained" color="primary">
            {t('LBL_BTN_SAVE')}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditRoomModal;
