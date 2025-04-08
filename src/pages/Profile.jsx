import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import useFetch from "../hooks/useFetch";
import "../styles/profile.css";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const {
    data: userData,
    loading,
    error,
  } = useFetch(`${BASE_URL}/users/${user._id}`);
  // } = useFetch(`${BASE_URL}/users/${user.id}`);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userData]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file from the input
    if (file) {
      setIsUploading(true); // Start uploading state
  
      // Create FormData to send the image file to the backend server
      const formData = new FormData();
      formData.append("file", file); // Append the file to FormData
  
      try {
        // Send the image to your backend server instead of Cloudinary directly
        const response = await fetch(`${BASE_URL}/uploads`, {
          method: "POST",
          body: formData, // Send form data to the server
          credentials: "include",
        });
  
        const data = await response.json();
  
        if (data.url) {
          // Update the avatar state with the new image URL
          setAvatar(data.url);
          toast.success("Load image success");
        } else {
          toast.error("Failed to load image");
        }
      } catch (error) {
        console.error("Error uploading image to server:", error);
        toast.error("Error uploading image to server");
      } finally {
        setIsUploading(false); // End the uploading process
      }
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      avatar,
      username,
      ...(password && { password }), // Only include password if it is non-empty
    };

    try {
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (result.success) {
        // alert("Profile updated successfully!");
        toast.success("Profile updated successfully!")

        // Update user data in AuthContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { ...user, ...updatedData },
        });

        // Update user data in localStorage
        const updatedUser = { ...user, ...updatedData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Optionally, you can update the UI or show a success message.
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch({ type: "LOGIN_SUCCESS", payload: storedUser });
    }
  }, [dispatch]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Profile Settings
        </Typography>

        <Avatar
          src={
            avatar ||
            "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg"
          }
          sx={{ width: 100, height: 100, mb: 2 }}
        />

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={24} /> : "Upload New Avatar"}
            <input type="file" hidden onChange={handleAvatarChange} />
          </Button>

          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={user.email}
            disabled
          />

          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#faa935", // Default color
              color: "black", // Text color
              "&:hover": {
                backgroundColor: "#ff7e01", // Hover color
              },
            }}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
