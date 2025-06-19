import React, { useState } from "react";
import { BASE_URL } from "../../../utils/config";
import useFetch from "../../../hooks/useFetch";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RestoreBlogs = () => {
  const { t } = useTranslation(["admin"]);
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: blog,
    loading,
    error,
  } = useFetch(`${BASE_URL}/blogs/delete/getAllBlogByAdminDeleted`, refreshKey);

  const handleDeleteBlog = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to restore this blog?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${BASE_URL}/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isDelete: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to restore blog");
      }
      
      toast.success("Blog restored successfully!");
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error restore blog:", error);
      toast.error("Failed to restore blog. Please try again.", error);
    }
  };

  const truncateText = (text) => {
    return text.length > 25 ? text.slice(0, 25) + "..." : text;
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const sortBlogs = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    if (blog) {
      blog.sort((a, b) => {
        const valueA = a[key]?.toString().toLowerCase() || ""; // Chuyển về chuỗi thường
        const valueB = b[key]?.toString().toLowerCase() || ""; // Chuyển về chuỗi thường

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
  const filteredBlogs = blog?.filter((blog) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.description.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    // <Box style={{ overflowY: "auto", maxHeight: "550px" }}>
    <Box>
      <Box className="d-flex gap-3 mb-3">
        {/* Search Bar */}
        <TextField
          label={t('LBL_BLOG_TABLE_SEARCH_LABEL')}
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
        <Table sx={{ minWidth: 650 }} aria-label="restore blogs table">
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
                {t('LBL_BLOG_TABLE_IMAGE')}
              </TableCell>
              <TableCell
                onClick={() => sortBlogs("title")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                {t('LBL_BLOG_TABLE_TITLE')} {renderSortIcon("title")}
              </TableCell>
              <TableCell
                onClick={() => sortBlogs("description")}
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingRight: 1,
                  "&:hover": { color: "primary.main" },
                  whiteSpace: "nowrap", // Prevent wrapping
                }}
              >
                {t('LBL_BLOG_TABLE_DESCRIPTION')} {renderSortIcon("description")}
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
                {t('LBL_BLOG_TABLE_ACTION')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlogs?.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>
                  <img
                    src={blog.image}
                    alt="Blog"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </TableCell>
                <TableCell>{truncateText(blog.title)}</TableCell>
                <TableCell>{truncateText(blog.description)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDeleteBlog(blog._id)}
                  >
                    {t('LBL_BLOG_TABLE_BTN_RESTORE_BLOG')}
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

export default RestoreBlogs;
