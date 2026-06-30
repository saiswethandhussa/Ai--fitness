import React, { useEffect, useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Chip, 
  Grid, 
  CircularProgress,
  Avatar,
  Paper
} from "@mui/material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import TimerIcon from "@mui/icons-material/Timer";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { getActivity, getActivityDetail } from "../services/api";

const ActivityDetail = ({ activityId }) => {
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (!activityId) return;

    const fetchAllDetails = async () => {
      setLoading(true);
      setRecLoading(true);
      setActivity(null);
      setRecommendation(null);
      
      try {
        // Fetch activity details
        const activityRes = await getActivity(activityId);
        setActivity(activityRes.data);
        setLoading(false);

        // Fetch AI recommendation
        try {
          const recRes = await getActivityDetail(activityId);
          setRecommendation(recRes.data);
        } catch (e) {
          console.warn("No recommendation found or AI service unavailable", e);
        } finally {
          setRecLoading(false);
        }
      } catch (error) {
        console.error("Error fetching activity detail:", error);
        setLoading(false);
        setRecLoading(false);
      }
    };

    fetchAllDetails();
  }, [activityId]);

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING":
        return <DirectionsRunIcon sx={{ color: "#ffffff", fontSize: '1.8rem' }} />;
      case "WALKING":
        return <DirectionsWalkIcon sx={{ color: "#ffffff", fontSize: '1.8rem' }} />;
      case "CYCLING":
        return <PedalBikeIcon sx={{ color: "#ffffff", fontSize: '1.8rem' }} />;
      default:
        return <DirectionsRunIcon sx={{ color: "#ffffff", fontSize: '1.8rem' }} />;
    }
  };

  const getFriendlyTypeName = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING": return "Running";
      case "WALKING": return "Walking";
      case "CYCLING": return "Cycling";
      default: return type || "Workout";
    }
  };

  const formatActivityDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!activityId) {
    return (
      <Box sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        p: 4,
        textAlign: "center"
      }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: "background.subtle", mb: 2 }}>
          <DirectionsRunIcon sx={{ color: "text.secondary", fontSize: "2rem" }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.secondary", mb: 1 }}>
          No Activity Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on any activity from the list to view its details and your customized AI recommendations.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">Failed to load activity details.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Activity Details Card */}
      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar 
                variant="rounded" 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  bgcolor: "primary.main",
                  borderRadius: 3
                }}
              >
                {getActivityIcon(activity.type)}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                Activity Details
              </Typography>
            </Box>
            <Chip 
              label="Completed" 
              color="success" 
              size="small" 
              sx={{ 
                bgcolor: "success.light", 
                color: "success.contrastText",
                fontWeight: 600,
                borderRadius: 2
              }} 
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FitnessCenterIcon sx={{ fontSize: '0.9rem' }} /> Activity Type
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {getFriendlyTypeName(activity.type)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TimerIcon sx={{ fontSize: '0.9rem' }} /> Duration
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {activity.duration} min
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocalFireDepartmentIcon sx={{ fontSize: '0.9rem' }} /> Calories Burned
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {activity.caloriesBurned} cal
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: '0.9rem' }} /> Date & Time
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                  {formatActivityDate(activity.createdAt || activity.startTime)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI Recommendation Card */}
      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "primary.light", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", bgcolor: "primary.main" }} />
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <AutoAwesomeIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              AI Recommendation
            </Typography>
          </Box>

          {recLoading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 2 }}>
              <CircularProgress size={30} color="primary" />
              <Typography variant="body2" color="text.secondary">
                Analyzing workout performance...
              </Typography>
            </Box>
          ) : recommendation ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Analysis Section */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", mb: 1, letterSpacing: 0.5 }}>
                  Analysis
                </Typography>
                <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                  {recommendation.recommendation || "Great job completing your activity! Our algorithms are tracking your progress."}
                </Typography>
              </Box>

              {/* Strengths Section */}
              {recommendation.improvements && recommendation.improvements.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", mb: 1.5, letterSpacing: 0.5 }}>
                    Strengths
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {recommendation.improvements.map((imp, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: "success.main", fontSize: "1.2rem" }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{imp}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Suggestions Section */}
              {recommendation.suggestions && recommendation.suggestions.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", mb: 1.5, letterSpacing: 0.5 }}>
                    Suggestions
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {recommendation.suggestions.map((sug, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <ErrorIcon sx={{ color: "warning.main", fontSize: "1.2rem" }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{sug}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Safety Guidelines as Estimated Impact / Safety Box */}
              {recommendation.safety && recommendation.safety.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", mb: 1.5, letterSpacing: 0.5 }}>
                    Safety Guidelines
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: "info.light", 
                      borderColor: "transparent",
                      borderRadius: 3, 
                      display: "flex", 
                      gap: 2,
                      alignItems: "flex-start"
                    }}
                  >
                    <InfoIcon sx={{ color: "info.dark", mt: 0.2 }} />
                    <Box>
                      {recommendation.safety.map((saf, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: "info.contrastText", fontWeight: 500, mb: idx < recommendation.safety.length - 1 ? 1 : 0 }}>
                          {saf}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}

              {/* Disclaimer Info Banner */}
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: "background.subtle", 
                  borderColor: "divider",
                  borderRadius: 3, 
                  display: "flex", 
                  gap: 1.5,
                  alignItems: "center"
                }}
              >
                <InfoIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  AI recommendations are based on your activity history and fitness goals.
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                AI is generating your fitness suggestions. Check back in a few seconds.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;
