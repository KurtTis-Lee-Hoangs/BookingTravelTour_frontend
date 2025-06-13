import React, { useState } from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, IconButton, Tooltip, } from "@mui/material";
import { BASE_URL } from "../../../utils/config";
import useFetch from "../../../hooks/useFetch";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const UsersTable = () => {
  const { t } = useTranslation(['admin']);
  // Fetch the users data from the API
  const [refreshKey, setRefreshKey] = useState(0);
  const {data: user, loading, error,} = useFetch(`${BASE_URL}/users`, refreshKey);
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [editModal, setEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const openEditModal = (user) => {
    setOriginalUser(user); // Save the original copy of data
    setEditingUser(user); // Save user information to State
    setEditModal(true); // Open Modal
  };

  const toggleModal = () => setModal(!modal);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const responseAdd = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });

      if (!responseAdd.ok) {
        const errorData = await responseAdd.json();
        throw new Error(errorData.message || "Failed to add user");
      }
      setRefreshKey((prevKey) => prevKey + 1);
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      setIsFormVisible(false);
    } catch (error) {
      // alert(error.message);
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
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

      setRefreshKey((prevKey) => prevKey + 1);
      toast.success("Delete user success!")
    } catch (error) {
      // console.error("Error deleting user:", error);
      toast.error("Error deleting user")
    }
  };

  const handleAvatarChange = async (e) => {
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
          setEditingUser({
            ...editingUser,
            avatar: data.secure_url,
          });
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleEditUser = async () => {
    try {
      const updatedFields = {};

      Object.keys(editingUser).forEach((key) => {
        if (editingUser[key] !== originalUser[key]) {
          updatedFields[key] = editingUser[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        return;
      }

      const response = await fetch(`${BASE_URL}/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setRefreshKey((prevKey) => prevKey + 1);
      setEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const truncateText = (text) => {
    return text.length > 15 ? text.slice(0, 15) + "..." : text;
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const sortUsers = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    if (user) {
      user.sort((a, b) => {
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
  const filteredUsers = user?.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="d-flex gap-3 mb-3">
        <TextField label="Search by Username or Email" variant="outlined" fullWidth value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />

        <Button variant="contained" color="primary" onClick={() => setIsFormVisible((prev) => !prev)}>
          {isFormVisible ? "Hide Form" : "Add User"}
        </Button>
      </div>

      {isFormVisible && (
        <AddUserModal
          newUser={newUser}
          handleInputChange={handleInputChange}
          handleAddUser={handleAddUser}
          handleCancel={() => setIsFormVisible(false)}
        />
      )}

      {editModal && (
        <EditUserModal
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleEditUser={handleEditUser}
          handleAvatarChange={handleAvatarChange}
          toggleEditMode={() => setEditModal(false)}
        />
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{cursor: "pointer", fontWeight: "bold", paddingRight: 1, "&:hover": { color: "primary.main" }, whiteSpace: "nowrap",}}>
                Avatar
              </TableCell>
              <TableCell onClick={() => sortUsers("username")} sx={{cursor: "pointer", fontWeight: "bold", paddingRight: 1, "&:hover": { color: "primary.main" }, whiteSpace: "nowrap",}}>
                Username {renderSortIcon("username")}
              </TableCell>
              <TableCell onClick={() => sortUsers("email")} sx={{cursor: "pointer", fontWeight: "bold", paddingRight: 1, "&:hover": { color: "primary.main" }, whiteSpace: "nowrap",}}>
                Email {renderSortIcon("email")}
              </TableCell>
              <TableCell onClick={() => sortUsers("role")} sx={{cursor: "pointer", fontWeight: "bold", paddingRight: 1, "&:hover": { color: "primary.main" }, whiteSpace: "nowrap",}}>
                Role {renderSortIcon("role")}
              </TableCell>
              <TableCell sx={{cursor: "pointer", fontWeight: "bold", paddingRight: 1, "&:hover": { color: "primary.main" }, whiteSpace: "nowrap",}}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <img src={user.avatar} alt="User Avatar" style={{width: "50px", height: "50px", borderRadius: "50%",}}/>
                </TableCell>
                <TableCell>{truncateText(user.username)}</TableCell>
                <TableCell>{truncateText(user.email)}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" size="small" onClick={() => openEditModal(user)} style={{ marginRight: "10px" }}>
                    Edit User
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteUser(user._id)}>
                    Delete User
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsersTable;
