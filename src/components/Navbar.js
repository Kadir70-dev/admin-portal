import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Navbar() {
  return (
    <AppBar position="static" style={{ backgroundColor: "#fff", color: "#000" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Admin Portal
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <Typography variant="body1" style={{ marginLeft: "10px" }}>
          Admin
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
