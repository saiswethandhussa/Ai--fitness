import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Link,
  useLocation
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";

// Material UI Components
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Card,
  CardContent,
  Badge,
  Paper
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BarChartIcon from "@mui/icons-material/BarChart";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { getTheme } from "./theme";
import { setCredentials, logout } from "./store/authSlice";
import { getUserProfile } from "./services/api";
import DashboardView from "./components/DashboardView";
import { ActivityList } from "./components/ActivityList";
import AnalyticsView from "./components/AnalyticsView";
import { AIRecommendationsView } from "./components/AIRecommendationsView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";

const DRAWER_WIDTH = 260;

// Main Layout Wrapper
const DashboardLayout = ({ children, mode, setMode, logOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  
  // Anchor state for profile menu
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Activities", icon: <FitnessCenterIcon />, path: "/activities" },
    { text: "Analytics", icon: <BarChartIcon />, path: "/analytics" },
    { text: "AI Recommendations", icon: <AutoAwesomeIcon />, path: "/recommendations" },
    { text: "Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" }
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "background.sidebar" }}>
      {/* Sidebar Logo */}
      <Box 
        onClick={() => setSidebarOpen(false)}
        sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
          <FitnessCenterIcon sx={{ color: "#ffffff", fontSize: "1.2rem" }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", trackingSpacing: 0.5 }}>
          Fitness App
        </Typography>
      </Box>
      <Divider />

      {/* Sidebar Links */}
      <List sx={{ px: 2, py: 3, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: 2,
                  bgcolor: isSelected ? "rgba(96, 37, 224, 0.08)" : "transparent",
                  color: isSelected ? "primary.main" : "text.secondary",
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? "primary.main" : "text.secondary",
                  },
                  "&:hover": {
                    bgcolor: isSelected ? "rgba(96, 37, 224, 0.08)" : "background.subtle",
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: "0.95rem", 
                    fontWeight: isSelected ? 700 : 500 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      {/* Sidebar Logout at Bottom */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="text"
          startIcon={<LogoutIcon />}
          onClick={logOut}
          sx={{
            py: 1.2,
            borderRadius: 2.5,
            justifyContent: "flex-start",
            px: 2,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.08)",
              color: "error.main",
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const displayName = user?.name || user?.preferred_username || "John Doe";
  const displayEmail = user?.email || "john.doe@example.com";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Navbar Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%" },
          ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          transition: "width 0.2s, margin 0.2s"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {!sidebarOpen && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setSidebarOpen(true)}
                sx={{ mr: 2, display: { xs: "none", md: "inline-flex" } }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Context title (e.g. show corresponding section header based on path) */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.secondary", display: { xs: "none", sm: "block" } }}>
              {location.pathname === "/dashboard" && "Dashboard Overview"}
              {location.pathname === "/activities" && "Activities Hub"}
              {location.pathname === "/analytics" && "Performance Analytics"}
              {location.pathname === "/recommendations" && "AI Recommendations"}
              {location.pathname === "/profile" && "User Profile"}
              {location.pathname === "/settings" && "System Settings"}
            </Typography>
          </Box>



          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Theme Toggle Button */}
            <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit" size="medium">
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>



            {/* Notifications Bell */}
            <IconButton color="inherit" size="medium">
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Dropdown Trigger */}
            <Box 
              onClick={handleProfileMenuOpen}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1.5, 
                cursor: "pointer", 
                p: "4px 12px", 
                borderRadius: 3,
                "&:hover": { bgcolor: "background.subtle" } 
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: "primary.main", 
                  width: 36, 
                  height: 36,
                  fontSize: "1rem",
                  fontWeight: 600
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {displayEmail}
                </Typography>
              </Box>
              <ArrowDropDownIcon sx={{ color: "text.secondary" }} />
            </Box>

            {/* Profile Menu */}
            <Menu
              anchorEl={profileAnchorEl}
              open={isProfileMenuOpen}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              slotProps={{
                paper: {
                  sx: { 
                    mt: 1.5, 
                    width: 200, 
                    borderRadius: 3, 
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
                    border: "1px solid",
                    borderColor: "divider"
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem component={Link} to="/profile" sx={{ py: 1.2 }}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                My Profile
              </MenuItem>
              <MenuItem component={Link} to="/settings" sx={{ py: 1.2 }}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={logOut} sx={{ py: 1.2, color: "error.main" }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer components for Navigation */}
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: sidebarOpen ? "block" : "none" },
          width: sidebarOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH, borderRight: "1px solid", borderColor: "divider" }
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: "64px", // height of app bar
          minHeight: "100vh"
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Premium Login Screen
const LoginView = ({ logIn, error }) => {
  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        background: "linear-gradient(135deg, #0b0f19 0%, #131926 50%, #05070c 100%)",
        color: "#ffffff",
        p: 3
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 420, 
          width: "100%", 
          p: 4, 
          borderRadius: 5, 
          bgcolor: "rgba(19, 25, 38, 0.7)", 
          backdropFilter: "blur(10px)",
          borderColor: "rgba(96, 37, 224, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 0 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: "primary.main", 
              mx: "auto", 
              mb: 3, 
              boxShadow: "0 0 20px 0 rgba(96, 37, 224, 0.6)" 
            }}
          >
            <FitnessCenterIcon sx={{ color: "#ffffff", fontSize: "1.8rem" }} />
          </Avatar>
          
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#ffffff" }}>
            AI Fitness Tracker
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 4 }}>
            Sign in to access your workout metrics and dynamic AI training suggestions.
          </Typography>
          
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => logIn()}
            sx={{ 
              py: 1.5, 
              borderRadius: 3, 
              fontSize: "1rem", 
              fontWeight: 700,
              bgcolor: "primary.main",
              boxShadow: "0 4px 15px 0 rgba(96, 37, 224, 0.4)",
              '&:hover': {
                bgcolor: '#4e1bb8',
                boxShadow: "0 4px 20px 0 rgba(96, 37, 224, 0.6)",
              }
            }}
          >
            Connect Identity Provider
          </Button>

          {error && (
            <Box 
              sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: "rgba(239, 68, 68, 0.1)", 
                border: "1px solid rgba(239, 68, 68, 0.3)", 
                borderRadius: 3, 
                textAlign: "left" 
              }}
            >
              <Typography variant="caption" sx={{ color: "#ef4444", fontFamily: "monospace", display: "block" }}>
                <strong>Authentication Error:</strong> {error}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut, error } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [mode, setMode] = useState("light");

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      if (tokenData?.sub) {
        getUserProfile(tokenData.sub).catch(err => {
          console.error("Error fetching/syncing user profile:", err);
        });
      }
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    logOut();
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!token ? (
          <LoginView logIn={logIn} error={error} />
        ) : (
          <DashboardLayout mode={mode} setMode={setMode} logOut={handleLogout}>
            <Routes>
              <Route path="/dashboard" element={<DashboardView userName={tokenData?.name || tokenData?.preferred_username} userId={tokenData?.sub} />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/analytics" element={<AnalyticsView />} />
              <Route path="/recommendations" element={<AIRecommendationsView />} />
              <Route path="/profile" element={<ProfileView user={tokenData} />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
