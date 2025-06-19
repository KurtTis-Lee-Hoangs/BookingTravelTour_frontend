import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import { BASE_URL } from "../../../utils/config";
import useFetch from "../../../hooks/useFetch";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RestoreUsers = () => {
  const { t } = useTranslation(["admin"]);
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: user,
    loading,
    error,
  } = useFetch(`${BASE_URL}/users/delete/getAllUserDeleted`, refreshKey);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to restore this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT", // Change from DELETE to PATCH
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isDelete: false }), // Sending updated isDelete info
      });

      if (!response.ok) {
        throw new Error("Failed to restore user");
      }

      // Refresh the user list after restoration
      setRefreshKey((prevKey) => prevKey + 1);
      toast.success("Restore user success!");
    } catch (error) {
      console.error("Error restoring user:", error);
      toast.error("Error restoring user");
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
        const valueA = a[key]?.toString().toLowerCase() || ""; // Convert to lowercase string
        const valueB = b[key]?.toString().toLowerCase() || ""; // Convert to lowercase string

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
    // <Box sx={{ overflowY: "auto", maxHeight: "500px" }}>
    <Box>
      {/* <Box sx={{ display: "flex", gap: 3, marginBottom: 3, marginTop: 2 }}> */}
      <Box display="flex" gap={3} mb={3}>
        {/* Search Bar */}
        <TextField
          label={t('LBL_USER_TABLE_SEARCH_LABEL')}
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="restored users table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap",
                }}
              >
                {t('LBL_USER_TABLE_AVATAR')}
              </TableCell>
              <TableCell
                onClick={() => sortUsers("username")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap",
                }}
              >
                {t('LBL_USER_TABLE_USERNAME')} {renderSortIcon("username")}
              </TableCell>
              <TableCell
                onClick={() => sortUsers("email")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap",
                }}
              >
                {t('LBL_USER_TABLE_EMAIL')} {renderSortIcon("email")}
              </TableCell>
              <TableCell
                onClick={() => sortUsers("role")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap",
                }}
              >
                {t('LBL_USER_TABLE_ROLE')} {renderSortIcon("role")}
              </TableCell>
              <TableCell
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap",
                }}
              >
                {t('LBL_USER_TABLE_ACTION')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </TableCell>
                <TableCell>{truncateText(user.username)}</TableCell>
                <TableCell>{truncateText(user.email)}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    {t('LBL_USER_TABLE_RESTORE_USER')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RestoreUsers;
