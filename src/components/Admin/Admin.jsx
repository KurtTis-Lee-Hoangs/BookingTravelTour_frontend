import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable/UsersTable";
import RestoreUsers from "./RestoreDeleted/RestoreUsers";
import ToursTable from "./ToursTable/ToursTable";
import RestoreTours from "./RestoreDeleted/RestoreTours";
import BlogsTable from "./BlogsTable/BlogTable";
import RestoreBlogs from "./RestoreDeleted/RestoreBlogs";
import HotelsTable from "./HotelsTable/HotelTable";
import RestoreHotels from "./RestoreDeleted/RestoreHotels";
import BookingTable from "./BookingsTable/BookingTable";
import HotelRoomBooking from "./BookingsTable/HotelRoomBooking";
import Statistical from "./Statistical/Statistical";
import HotelStatistical from "./HotelStatistical/HotelStatistical";
import { BASE_URL } from "../../utils/config";
import { toast } from "react-toastify";
import LanguageToggle from "../../shared/LanguageToggle";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const { t } = useTranslation(['admin']);
  const [activeTab, setActiveTab] = useState("Manage users");
  const [openSections, setOpenSections] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleHomePageClick = () => {
    navigate("/homepage");
  };

  const logout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error during logout:", result.message);
        // alert(result.message || "Logout failed. Please try again.");
        toast.error(result.message )
      } else {
        // Clear user data and redirect to homepage
        dispatch({ type: "LOGOUT" });
        navigate("/");
        toast.success('Logout successful!')
      }
    } catch (err) {
      console.error("Error during logout:", err);
      // alert("Logout failed. Please try again.");
      toast.error('Logout failed. Please try again.')
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "Manage users":
        return <UsersTable />;
      case "Restore users":
        return <RestoreUsers />;
      case "Manage tours":
        return <ToursTable />;
      case "Restore tours":
        return <RestoreTours />;
      case "Manage blogs":
        return <BlogsTable />;
      case "Restore blogs":
        return <RestoreBlogs />;
      case "Manage hotels":
        return <HotelsTable />;
      case "Restore hotels":
        return <RestoreHotels />;
      case "Manage bookings":
        return <BookingTable />;
      case "Manage hotel room bookings":
        return <HotelRoomBooking />;
      case "Tour statistics":
        return <Statistical />;
      case "Hotel statistics":
        return <HotelStatistical />;
      default:
        return null;
    }
  };

  const getListItemStyles = (tab) => ({
    backgroundColor: activeTab === tab ? "#ff7e01" : "transparent", // Active color
    color: activeTab === tab ? "#fff" : "#ccc",
    padding: "10px 20px",
    "&:hover": {
      backgroundColor: activeTab === tab ? "#ff7e01" : "#faa935", // Hover color
    },
  });

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          backgroundColor: "#333",
          color: "#fff",
          boxShadow: 3,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box p={2} display="flex" alignItems="center">
          <img
            src={user.avatar}
            alt="User Avatar"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "15px",
            }}
          />
          <Typography variant="h6">{t('LBL_ADMIN')}</Typography>
        </Box>
        <div className="m-3">
          <LanguageToggle />
        </div>
        <List>
          <ListItem
            button
            onClick={handleHomePageClick}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_HOME_PAGE')} />
          </ListItem>

          {/* User Section */}
          <ListItem
            button
            onClick={() => toggleSection("User")}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_USER')} />
            {openSections.User ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSections.User} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => handleTabClick("Manage users")}
                sx={{ ...getListItemStyles("Manage users"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_MANAGE_USER')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Restore users")}
                // sx={getListItemStyles("Restore users")}
                sx={{ ...getListItemStyles("Restore users"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_RESTORE_USER')} />
              </ListItem>
            </List>
          </Collapse>

          {/* Tour Section */}
          <ListItem
            button
            onClick={() => toggleSection("Tour")}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_TOUR')} />
            {openSections.Tour ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSections.Tour} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => handleTabClick("Manage tours")}
                // sx={getListItemStyles("Manage tours")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Manage tours"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_MANAGE_TOUR')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Restore tours")}
                // sx={getListItemStyles("Restore tours")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Restore tours"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_RESTORE_TOUR')} />
              </ListItem>
            </List>
          </Collapse>

          {/* Blog Section */}
          <ListItem
            button
            onClick={() => toggleSection("Blog")}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_BLOG')} />
            {openSections.Blog ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSections.Blog} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => handleTabClick("Manage blogs")}
                // sx={getListItemStyles("Manage blogs")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Manage blogs"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_MANAGE_BLOG')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Restore blogs")}
                // sx={getListItemStyles("Restore blogs")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Restore blogs"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_RESTORE_BLOG')} />
              </ListItem>
            </List>
          </Collapse>

          {/* Hotel Section */}
          <ListItem
            button
            onClick={() => toggleSection("Hotel")}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_HOTEL')} />
            {openSections.Hotel ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSections.Hotel} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => handleTabClick("Manage hotels")}
                // sx={getListItemStyles("Manage hotels")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Manage hotels"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_MANAGE_HOTEL')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Restore hotels")}
                // sx={getListItemStyles("Restore hotels")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Restore hotels"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_RESTORE_HOTEL')} />
              </ListItem>
            </List>
          </Collapse>

          {/* Statistics Section */}
          <ListItem
            button
            onClick={() => toggleSection("Statistics")}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_STATISTICS')} />
            {openSections.Statistics ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSections.Statistics} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                onClick={() => handleTabClick("Manage bookings")}
                // sx={getListItemStyles("Manage bookings")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Manage bookings"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_MANAGE_BOOKING')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Manage hotel room bookings")}
                // sx={getListItemStyles("Manage bookings")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Manage hotel room bookings"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_MANAGE_HOTEL_ROOM_BOOKING')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Tour statistics")}
                // sx={getListItemStyles("Tour statistics")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Tour statistics"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_TOUR_STATISTICS')} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleTabClick("Hotel statistics")}
                // sx={getListItemStyles("Hotel statistics")} // Sử dụng getListItemStyles
                sx={{ ...getListItemStyles("Hotel statistics"), pl: 4 }} // Sử dụng getListItemStyles
              >
                <ListItemText primary={t('LBL_ADMIN_HOTEL_STATISTICS')} />
              </ListItem>
            </List>
          </Collapse>

          {/* Logout */}
          <ListItem
            button
            onClick={handleOpenLogoutDialog}
            sx={{ padding: "10px 20px" }}
          >
            <ListItemText primary={t('LBL_ADMIN_LOGOUT')} />
          </ListItem>
        </List>
      </Drawer>
      {/* Dialog confirm */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">{t('LBL_ADMIN_POPUP_LOGOUT_TITLE')}</DialogTitle>
        <DialogContent>
          {t('LBL_ADMIN_POPUP_LOGOUT_DESC')}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="error">
            {t('LBL_ADMIN_POPUP_LOGOUT_BTN_CANCEL')}
          </Button>
          <Button
            onClick={() => {
              handleCloseLogoutDialog();
              logout();
            }}
            color="primary"
            autoFocus
          >
            {t('LBL_ADMIN_POPUP_LOGOUT_BTN_LOGOUT')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {activeTab === "Manage users" && t('LBL_ADMIN_MANAGE_USER_HEADER')}
          {activeTab === "Restore users" && t('LBL_ADMIN_RESTORE_USER_HEADER')}
          {activeTab === "Manage tours" && t('LBL_ADMIN_MANAGE_TOUR_HEADER')}
          {activeTab === "Restore tours" && t('LBL_ADMIN_RESTORE_TOUR_HEADER')}
          {activeTab === "Manage blogs" && t('LBL_ADMIN_MANAGE_BLOG_HEADER')}
          {activeTab === "Restore blogs" && t('LBL_ADMIN_RESTORE_BLOG_HEADER')}
          {activeTab === "Manage hotels" && t('LBL_ADMIN_MANAGE_HOTEL_HEADER')}
          {activeTab === "Restore hotels" && t('LBL_ADMIN_RESTORE_HOTEL_HEADER')}
          {activeTab === "Manage bookings" && t('LBL_ADMIN_MANAGE_BOOKING_HEADER')}
          {activeTab === "Manage hotel room bookings" && t('LBL_ADMIN_MANAGE_BOOKING_HOTEL_ROOM_HEADER')}
          {activeTab === "Tour statistics" && t('LBL_ADMIN_TOUR_STATISTICS_HEADER')}
          {activeTab === "Hotel statistics" && t('LBL_ADMIN_HOTEL_STATISTICS_HEADER')}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Admin;
