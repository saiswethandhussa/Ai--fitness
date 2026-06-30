import React, { useEffect, useState, useMemo } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  InputAdornment,
  Pagination,
  IconButton,
  Avatar,
  Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import TimerIcon from "@mui/icons-material/Timer";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { getActivities, deleteActivity } from "../services/api";
import ActivityDetail from "./ActivityDetail";
import ActivityForm from "./ActivityForm";

const Sparkline = ({ data, color }) => {
  const height = 30;
  const width = 100;
  const padding = 2;
  
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padding - ((val - minVal) / valRange) * (height - 2 * padding);
    return { x, y };
  });
  
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  return (
    <Box sx={{ width: "100%", height: 45, mt: 1.5, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none" style={{ display: "block" }}>
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

export const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  const fetchActivities = async (defaultSelect = false) => {
    setLoading(true);
    try {
      const response = await getActivities();
      // Sort by creation date descending
      const sorted = (response.data || []).sort((a, b) => {
        return new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime);
      });
      setActivities(sorted);
      
      // Auto-select the first item if none is selected
      if (sorted.length > 0 && (defaultSelect || !selectedId)) {
        setSelectedId(sorted[0].id);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(true);
  }, []);

  const handleDelete = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(activityId);
        fetchActivities(true);
        if (selectedId === activityId) {
          setSelectedId(null);
        }
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  const handleActivityAdded = () => {
    fetchActivities(true);
  };

  // Dynamic calculations for stat cards
  const stats = useMemo(() => {
    const total = activities.length;
    const calories = activities.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
    const minutes = activities.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    
    // Count activities in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thisWeek = activities.filter(act => {
      const actDate = new Date(act.createdAt || act.startTime);
      return actDate >= sevenDaysAgo;
    }).length;

    return { total, calories, minutes, thisWeek };
  }, [activities]);

  const dailyStats = useMemo(() => {
    const days = 7;
    const workoutCounts = Array(days).fill(0);
    const calorieSums = Array(days).fill(0);
    const minuteSums = Array(days).fill(0);
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    activities.forEach(act => {
      const actDate = new Date(act.createdAt || act.startTime);
      const diffTime = today - actDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < days) {
        const idx = days - 1 - diffDays;
        workoutCounts[idx]++;
        calorieSums[idx] += act.caloriesBurned || 0;
        minuteSums[idx] += act.duration || 0;
      }
    });
    
    const hasData = activities.length > 0;
    return {
      workouts: hasData ? workoutCounts : [3, 2, 4, 3, 5, 4, 6],
      calories: hasData ? calorieSums : [150, 100, 250, 180, 300, 220, 400],
      minutes: hasData ? minuteSums : [30, 20, 45, 35, 60, 40, 80],
      thisWeek: hasData ? workoutCounts : [1, 2, 1, 3, 2, 4, 3]
    };
  }, [activities]);

  // Filter and Search logic
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.type?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || act.type?.toUpperCase() === categoryFilter.toUpperCase();
      return matchesSearch && matchesCategory;
    });
  }, [activities, search, categoryFilter]);

  // Pagination logic
  const paginatedActivities = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActivities, page]);

  const pageCount = Math.ceil(filteredActivities.length / itemsPerPage);

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING":
        return <DirectionsRunIcon sx={{ color: "#6025e0" }} />;
      case "WALKING":
        return <DirectionsWalkIcon sx={{ color: "#10b981" }} />;
      case "CYCLING":
        return <PedalBikeIcon sx={{ color: "#f59e0b" }} />;
      default:
        return <FitnessCenterIcon sx={{ color: "#6025e0" }} />;
    }
  };

  const getIconBackground = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING": return "rgba(96, 37, 224, 0.1)";
      case "WALKING": return "rgba(16, 185, 129, 0.1)";
      case "CYCLING": return "rgba(245, 158, 11, 0.1)";
      default: return "rgba(96, 37, 224, 0.1)";
    }
  };

  const formatActivityCardDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + " • " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Activities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage your fitness activities
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setFormOpen(true)}
          sx={{ 
            bgcolor: "primary.main",
            borderRadius: 6,
            fontWeight: 600,
            px: 2.5,
            py: 1
          }}
        >
          Add Activity
        </Button>
      </Box>

      {/* Stats Bar */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4, width: { xs: "100%", md: "calc(100% - 160px)" } }}>
        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 0px" }, display: "flex" }}>
          <Card sx={{ width: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.1)", width: 48, height: 48 }}>
                  <FitnessCenterIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Workouts</Typography>
                </Box>
              </Box>
              <Sparkline data={dailyStats.workouts} color="#6025e0" />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 0px" }, display: "flex" }}>
          <Card sx={{ width: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.1)", width: 48, height: 48 }}>
                  <LocalFireDepartmentIcon sx={{ color: "success.main", fontSize: "1.5rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>{stats.calories}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Calories</Typography>
                </Box>
              </Box>
              <Sparkline data={dailyStats.calories} color="#10b981" />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 0px" }, display: "flex" }}>
          <Card sx={{ width: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: "rgba(2, 132, 199, 0.1)", width: 48, height: 48 }}>
                  <TimerIcon sx={{ color: "#0284c7", fontSize: "1.5rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>{stats.minutes}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Minutes</Typography>
                </Box>
              </Box>
              <Sparkline data={dailyStats.minutes} color="#0284c7" />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 0px" }, display: "flex" }}>
          <Card sx={{ width: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar sx={{ bgcolor: "rgba(245, 158, 11, 0.1)", width: 48, height: 48 }}>
                  <CalendarMonthIcon sx={{ color: "warning.main", fontSize: "1.5rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>{stats.thisWeek}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>This Week</Typography>
                </Box>
              </Box>
              <Sparkline data={dailyStats.thisWeek} color="#f59e0b" />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Search & Filter controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
        <TextField
          placeholder="Search activities..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ 
            flexGrow: 1, 
            '& .MuiOutlinedInput-root': { borderRadius: '50px', height: 40 } 
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />
              </InputAdornment>
            ),
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />
                </InputAdornment>
              ),
            },
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            sx={{ borderRadius: '50px', height: 40 }}
          >
            <MenuItem value="ALL">All Activities</MenuItem>
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="WALKING">Walking</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Activity Cards List */}
      {loading ? (
        <Box sx={{ py: 6, textStyle: "italic", textAlign: "center" }}>
          <Typography color="text.secondary">Loading activity list...</Typography>
        </Box>
      ) : paginatedActivities.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 4 }}>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
            No activities found matching filters.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {paginatedActivities.map((activity) => {
            const isSelected = selectedId === activity.id;
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} key={activity.id}>
                <Card 
                  onClick={() => setSelectedId(activity.id)}
                  sx={{ 
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    borderRadius: 3,
                    border: "1.5px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isSelected ? "rgba(96, 37, 224, 0.02)" : "background.paper",
                    transform: isSelected ? "translateY(-2px)" : "none",
                    boxShadow: isSelected ? "0 4px 12px 0 rgba(96, 37, 224, 0.08)" : "none",
                    "&:hover": {
                      borderColor: isSelected ? "primary.main" : "text.secondary",
                    }
                  }}
                >
                  <CardContent sx={{ p: 3.5, "&:last-child": { pb: 3.5 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: getIconBackground(activity.type), width: 52, height: 52 }}>
                          {React.cloneElement(getActivityIcon(activity.type), { 
                            sx: { 
                              color: 
                                activity.type?.toUpperCase() === "RUNNING" ? "#6025e0" : 
                                activity.type?.toUpperCase() === "WALKING" ? "#10b981" : 
                                activity.type?.toUpperCase() === "CYCLING" ? "#f59e0b" : 
                                "#6025e0",
                              fontSize: "1.6rem" 
                            } 
                          })}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {activity.type === "RUNNING" ? "Running" : activity.type === "WALKING" ? "Walking" : "Cycling"}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {formatActivityCardDate(activity.createdAt || activity.startTime)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label="Completed" 
                        size="medium" 
                        color="success"
                        sx={{ 
                          bgcolor: "success.light", 
                          color: "success.contrastText", 
                          fontWeight: 700,
                          height: 26,
                          fontSize: "0.8rem",
                          borderRadius: 1.5
                        }} 
                      />
                    </Box>
 
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5 }}>
                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <TimerIcon sx={{ fontSize: "1.2rem", color: "text.secondary" }} />
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>{activity.duration} min</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <LocalFireDepartmentIcon sx={{ fontSize: "1.2rem", color: "text.secondary" }} />
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>{activity.caloriesBurned} cal</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(activity.id);
                          }}
                          sx={{ 
                            color: "error.main", 
                            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: "1.35rem" }} />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0 }}>
                          <ChevronRightIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 1 }}>
          <Pagination 
            count={pageCount} 
            page={page} 
            onChange={(e, value) => setPage(value)} 
            color="primary" 
            shape="rounded"
            size="medium"
          />
        </Box>
      )}

      {/* Activity Details & AI Recommendations */}
      {selectedId && (
        <Box sx={{ mt: 4 }}>
          <ActivityDetail activityId={selectedId} />
        </Box>
      )}

      {/* Modal Dialog for Adding Activity */}
      <ActivityForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onActivityAdded={handleActivityAdded} 
      />
    </Box>
  );
};