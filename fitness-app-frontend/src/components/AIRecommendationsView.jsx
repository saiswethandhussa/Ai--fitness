import React, { useEffect, useState, useMemo } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Avatar, 
  Chip, 
  Divider, 
  Paper,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid
} from "@mui/material";
import { Link } from "react-router-dom";

// Icons
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import TimerIcon from "@mui/icons-material/Timer";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpIcon from "@mui/icons-material/Help";
import SecurityIcon from "@mui/icons-material/Security";

import { getActivities, getActivityDetail } from "../services/api";

// Sleek floating robot illustration in SVG
const RobotIllustration = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" style={{ filter: "drop-shadow(0 12px 28px rgba(96, 37, 224, 0.2))", animation: "float 6s ease-in-out infinite" }}>
    <style>
      {`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}
    </style>
    {/* Glow Circle */}
    <circle cx="100" cy="80" r="60" fill="url(#glowGrad)" opacity="0.45" />
    
    {/* Body */}
    <rect x="55" y="45" width="90" height="80" rx="25" fill="url(#botBody)" stroke="#6025e0" strokeWidth="2" />
    
    {/* Screen */}
    <rect x="68" y="58" width="64" height="40" rx="10" fill="#0f172a" />
    
    {/* Eyes */}
    <circle cx="86" cy="78" r="4.5" fill="#10b981" />
    <circle cx="114" cy="78" r="4.5" fill="#10b981" />
    <path d="M86 70 Q100 66 114 70" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M82 86 Q100 92 118 86" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Antenna */}
    <line x1="100" y1="45" x2="100" y2="28" stroke="#6025e0" strokeWidth="2.5" />
    <circle cx="100" cy="24" r="7" fill="#8553e6" />
    
    {/* Side Ears */}
    <rect x="47" y="70" width="8" height="20" rx="4" fill="#6025e0" />
    <rect x="145" y="70" width="8" height="20" rx="4" fill="#6025e0" />
    
    {/* Sparkles */}
    <path d="M25 40 L28 44 L34 45 L29 49 L30 55 L25 51 L20 55 L21 49 L16 45 L22 44 Z" fill="#f59e0b" opacity="0.8" />
    <path d="M170 120 L172 123 L176 124 L173 127 L174 131 L170 129 L166 131 L167 127 L164 124 L168 123 Z" fill="#6025e0" opacity="0.8" />

    <defs>
      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8553e6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#8553e6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="botBody" x1="55" y1="45" x2="145" y2="125">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f1f5f9" />
      </linearGradient>
    </defs>
  </svg>
);

const MOCK_RECOMMENDATIONS = {
  RUNNING: {
    recommendation: "Your running metrics show excellent cardiovascular pacing. To optimize your aerobic capacity, we suggest introducing high-intensity interval training (HIIT) once per week, alongside structured rest days to support muscle repair.",
    improvements: ["Consistent cadence and stride control", "Effective heart rate distribution", "Stamina levels trending upwards"],
    suggestions: ["Introduce 3x 30-second sprints inside normal runs", "Aim for 8 hours of sleep for cellular regeneration", "Replenish electrolytes within 30 minutes post-run"],
    safety: ["Maintain upright running posture to minimize spinal compression.", "If knee or joint inflammation occurs, shift immediately to active recovery walking."]
  },
  CYCLING: {
    recommendation: "Excellent cycling performance! Your cadence is highly stable. To push your limits and burn additional calories, focus on simulated hill climbs (higher gear resistance) and steady core stabilization exercises.",
    improvements: ["Stable leg cadence and pedal stroke", "Sustained fat-burn heart rate zone", "High duration endurance volume"],
    suggestions: ["Increase gear resistance by 10-15% during climbs", "Incorporate core stability routines twice a week", "Focus on quad and calf stretching post-ride"],
    safety: ["Ensure your saddle height is correctly adjusted to prevent patellar tendonitis.", "Always wear a helmet and use safety lights during outdoor road routes."]
  },
  WALKING: {
    recommendation: "A fantastic low-impact aerobic recovery walk. This keeps joint stress minimal while contributing to daily calorie output. To increase calorie burn without running, incorporate incline walks or carry light hand weights.",
    improvements: ["Perfect active recovery exertion levels", "Minimal joint stress impact", "Excellent fat oxidation contribution"],
    suggestions: ["Introduce a 5% incline block during your routine", "Increase arm swing dynamics to engage core muscles", "Aim for a power-walk pace of 4.0 mph for short segments"],
    safety: ["Wear supportive athletic footwear with suitable arch control.", "Ensure you keep chest up and shoulders back to avoid lumbar stiffness."]
  }
};

export const AIRecommendationsView = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await getActivities();
        const sorted = (response.data || []).sort((a, b) => {
          return new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime);
        });
        setActivities(sorted);
        
        // Auto-select first activity if present
        if (sorted.length > 0) {
          handleSelectActivity(sorted[0]);
        } else {
          // No activities on account, select a mock one
          handleSelectMockActivity("RUNNING");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        // Fallback selection
        handleSelectMockActivity("RUNNING");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleSelectActivity = async (activity) => {
    setSelectedActivity(activity);
    setRecLoading(true);
    setRecommendation(null);
    try {
      const response = await getActivityDetail(activity.id);
      if (response.data && response.data.recommendation) {
        setRecommendation(response.data);
      } else {
        // Fallback to client mock recommendation if server has no recommendations
        const type = activity.type?.toUpperCase() || "RUNNING";
        setRecommendation(MOCK_RECOMMENDATIONS[type] || MOCK_RECOMMENDATIONS.RUNNING);
      }
    } catch (e) {
      console.warn("AI service recommendations not found, using client fallback", e);
      const type = activity.type?.toUpperCase() || "RUNNING";
      setRecommendation(MOCK_RECOMMENDATIONS[type] || MOCK_RECOMMENDATIONS.RUNNING);
    } finally {
      setRecLoading(false);
    }
  };

  const handleSelectMockActivity = (type) => {
    const mockAct = {
      id: `mock-${type.toLowerCase()}`,
      type: type,
      duration: type === "WALKING" ? 200 : 20,
      caloriesBurned: type === "WALKING" ? 20 : type === "CYCLING" ? 10 : 20,
      createdAt: type === "RUNNING" ? "2026-06-29T12:18:00.000Z" : "2026-06-28T23:58:00.000Z",
      isMock: true
    };
    setSelectedActivity(mockAct);
    setRecLoading(true);
    setTimeout(() => {
      setRecommendation(MOCK_RECOMMENDATIONS[type]);
      setRecLoading(false);
    }, 600); // realistic mock load time
  };

  // Activity cards data (combine real dynamic ones with mock to fill 3 cards if needed)
  const displayActivities = useMemo(() => {
    if (activities.length > 0) {
      // Return last 3 activities
      return activities.slice(0, 3);
    } else {
      // Mock cards
      return [
        { id: "mock-running", type: "RUNNING", duration: 20, caloriesBurned: 20, createdAt: "2026-06-29T12:18:00.000Z", isMock: true },
        { id: "mock-cycling", type: "CYCLING", duration: 20, caloriesBurned: 10, createdAt: "2026-06-28T23:58:00.000Z", isMock: true },
        { id: "mock-walking", type: "WALKING", duration: 200, caloriesBurned: 20, createdAt: "2026-06-28T23:57:00.000Z", isMock: true }
      ];
    }
  }, [activities]);

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING":
        return <DirectionsRunIcon />;
      case "WALKING":
        return <DirectionsWalkIcon />;
      case "CYCLING":
        return <PedalBikeIcon />;
      default:
        return <DirectionsRunIcon />;
    }
  };

  const getIconColor = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING": return "#6025e0";
      case "WALKING": return "#10b981";
      case "CYCLING": return "#f59e0b";
      default: return "#6025e0";
    }
  };

  const getIconBackground = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING": return "rgba(96, 37, 224, 0.08)";
      case "WALKING": return "rgba(16, 185, 129, 0.08)";
      case "CYCLING": return "rgba(245, 158, 11, 0.08)";
      default: return "rgba(96, 37, 224, 0.08)";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 850, mb: 0.5, letterSpacing: -0.5 }}>
            AI recommendations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Review all insights and training optimization history generated by Gemini AI
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button 
            variant="outlined" 
            startIcon={<HelpIcon />}
            onClick={() => setHowItWorksOpen(true)}
            sx={{ 
              borderRadius: "50px", 
              borderColor: "divider", 
              color: "text.primary",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              "&:hover": { borderColor: "text.primary", bgcolor: "background.subtle" }
            }}
          >
            How it works
          </Button>
          <Button 
            variant="contained" 
            startIcon={<BarChartIcon />}
            component={Link}
            to="/analytics"
            sx={{ 
              borderRadius: "50px", 
              bgcolor: "primary.main",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              boxShadow: "0 4px 12px rgba(96, 37, 224, 0.15)"
            }}
          >
            View Analytics
          </Button>
        </Box>
      </Box>

      {/* Hero Section Card (Stripe/Linear style with soft gradients & 2xl rounding) */}
      <Card 
        sx={{ 
          borderRadius: "24px", 
          border: "1px solid", 
          borderColor: "rgba(96, 37, 224, 0.12)",
          background: "linear-gradient(135deg, rgba(96, 37, 224, 0.03) 0%, rgba(133, 83, 230, 0.03) 100%)",
          boxShadow: "0 8px 30px rgba(96, 37, 224, 0.02)",
          overflow: "visible",
          position: "relative"
        }}
      >
        <Box sx={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", bgcolor: "primary.main", borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px" }} />
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left Content Column */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip 
                    label="AI Optimization Hub" 
                    icon={<AutoAwesomeIcon sx={{ fontSize: "1rem !important", color: "primary.main" }} />}
                    sx={{ 
                      bgcolor: "rgba(96, 37, 224, 0.08)", 
                      color: "primary.main", 
                      fontWeight: 700, 
                      fontSize: "0.8rem",
                      borderRadius: "50px",
                      px: 0.5
                    }} 
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 850, letterSpacing: -0.5, lineHeight: 1.2, color: "text.primary" }}>
                  Smarter insights for better results
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: "1.05rem", maxWidth: 520, fontWeight: 500 }}>
                  Get personalized health recommendations, training optimizations, and safety insights powered by Gemini AI, custom-fitted to your recent fitness performance.
                </Typography>
              </Box>
            </Grid>

            {/* Right Divider Line for Desktop */}
            <Grid item xs={12} md={5} sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-end" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" }, height: 120, borderColor: "rgba(96, 37, 224, 0.12)" }} />
                
                {/* Robot Features */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.08)", color: "primary.main", width: 40, height: 40 }}>
                      <AutoAwesomeIcon sx={{ fontSize: "1.2rem" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Personalized insights</Typography>
                      <Typography variant="caption" color="text.secondary">Tailored to your activities and goals</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.08)", color: "#10b981", width: 40, height: 40 }}>
                      <SecurityIcon sx={{ fontSize: "1.2rem" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Health & safety first</Typography>
                      <Typography variant="caption" color="text.secondary">Detect risks and get safety guidelines</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "rgba(2, 132, 199, 0.08)", color: "#0284c7", width: 40, height: 40 }}>
                      <CheckCircleIcon sx={{ fontSize: "1.2rem" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Continuous improvement</Typography>
                      <Typography variant="caption" color="text.secondary">Recommendations adapt as you progress</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: { xs: "none", lg: "block" } }}>
                  <RobotIllustration />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Activity Selector Row */}
      <Box sx={{ mt: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>
            Get started
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Select an activity below to view its AI-generated recommendations and safety logs.
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ borderRadius: "20px", border: "1px solid", borderColor: "divider" }}>
                  <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="40%" height={16} />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" height={32} sx={{ borderRadius: "10px" }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {displayActivities.map((act) => {
              const isSelected = selectedActivity?.id === act.id;
              const title = act.type === "RUNNING" ? "Running" : act.type === "WALKING" ? "Walking" : "Cycling";
              const labelDate = act.isMock ? formatDate(act.createdAt) : formatDate(act.createdAt || act.startTime);
              
              return (
                <Grid item xs={12} md={4} key={act.id}>
                  <Card 
                    onClick={() => act.isMock ? handleSelectMockActivity(act.type) : handleSelectActivity(act)}
                    sx={{ 
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      borderRadius: "20px",
                      border: "1.5px solid",
                      borderColor: isSelected ? "primary.main" : "divider",
                      bgcolor: isSelected ? "rgba(96, 37, 224, 0.02)" : "background.paper",
                      transform: isSelected ? "translateY(-4px)" : "none",
                      boxShadow: isSelected ? "0 10px 25px rgba(96, 37, 224, 0.06)" : "0 2px 10px rgba(0, 0, 0, 0.01)",
                      "&:hover": {
                        borderColor: isSelected ? "primary.main" : "text.secondary",
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.03)"
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: getIconBackground(act.type), color: getIconColor(act.type), width: 46, height: 46 }}>
                            {getActivityIcon(act.type)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                              {title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Last activity • {labelDate}
                            </Typography>
                          </Box>
                        </Box>
                        {act.isMock && (
                          <Chip 
                            label="Sample" 
                            size="small" 
                            sx={{ 
                              height: 18, 
                              fontSize: "0.65rem", 
                              fontWeight: 700, 
                              bgcolor: "background.subtle", 
                              color: "text.secondary" 
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", gap: 3.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <TimerIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{act.duration} min</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <LocalFireDepartmentIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{act.caloriesBurned} cal</Typography>
                          </Box>
                        </Box>
                        
                        <ChevronRightIcon sx={{ color: "primary.main", fontSize: "1.4rem" }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Selected Recommendation Details Block */}
      {selectedActivity && (
        <Card 
          sx={{ 
            borderRadius: "24px", 
            border: "1px solid", 
            borderColor: "rgba(96, 37, 224, 0.08)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.02)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box sx={{ position: "absolute", top: 0, left: 0, width: 5, height: "100%", bgcolor: "primary.main" }} />
          <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                AI Recommendation Details
              </Typography>
              <Chip 
                label={selectedActivity.type === "RUNNING" ? "Running Analytics" : selectedActivity.type === "WALKING" ? "Walking Analytics" : "Cycling Analytics"} 
                size="small"
                sx={{ 
                  bgcolor: "rgba(96, 37, 224, 0.08)", 
                  color: "primary.main", 
                  fontWeight: 700,
                  ml: 1
                }} 
              />
            </Box>

            {recLoading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, py: 2 }}>
                {/* Skeleton loader for SaaS feel */}
                <Box>
                  <Skeleton variant="text" width="100px" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: "10px" }} />
                </Box>
                <Box>
                  <Skeleton variant="text" width="100px" height={20} sx={{ mb: 1.5 }} />
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="85%" height={20} />
                    <Skeleton variant="text" width="88%" height={20} />
                  </Box>
                </Box>
                <Box>
                  <Skeleton variant="text" width="150px" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={50} sx={{ borderRadius: "10px" }} />
                </Box>
              </Box>
            ) : recommendation ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Analysis Box */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, textTransform: "uppercase", mb: 1.2, letterSpacing: 0.8, fontSize: "0.75rem" }}>
                    Analysis
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.65, fontWeight: 500, fontSize: "1.02rem" }}>
                    {recommendation.recommendation}
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  {/* Strengths Column */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, textTransform: "uppercase", mb: 2, letterSpacing: 0.8, fontSize: "0.75rem" }}>
                      Detected Strengths
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {recommendation.improvements?.map((imp, idx) => (
                        <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <CheckCircleIcon sx={{ color: "success.main", fontSize: "1.25rem", mt: 0.2 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{imp}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>

                  {/* Suggestions Column */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, textTransform: "uppercase", mb: 2, letterSpacing: 0.8, fontSize: "0.75rem" }}>
                      Optimization Suggestions
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {recommendation.suggestions?.map((sug, idx) => (
                        <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <ErrorIcon sx={{ color: "warning.main", fontSize: "1.25rem", mt: 0.2 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{sug}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                {/* Safety Alerts Box */}
                {recommendation.safety && recommendation.safety.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, textTransform: "uppercase", mb: 1.5, letterSpacing: 0.8, fontSize: "0.75rem" }}>
                      Safety Guidelines
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2.5, 
                        bgcolor: "rgba(2, 132, 199, 0.03)", 
                        borderColor: "rgba(2, 132, 199, 0.12)",
                        borderRadius: "16px", 
                        display: "flex", 
                        gap: 2,
                        alignItems: "flex-start"
                      }}
                    >
                      <InfoIcon sx={{ color: "#0284c7", mt: 0.3 }} />
                      <Box>
                        {recommendation.safety.map((saf, idx) => (
                          <Typography key={idx} variant="body2" sx={{ color: "text.primary", fontWeight: 600, mb: idx < recommendation.safety.length - 1 ? 1 : 0 }}>
                            • {saf}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  AI recommendations are generating. Select an activity above.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Privacy Alert Banner at bottom */}
      <Paper 
        variant="outlined" 
        onClick={() => setPrivacyOpen(true)}
        sx={{ 
          p: 2.5, 
          bgcolor: "linear-gradient(135deg, rgba(96, 37, 224, 0.01) 0%, rgba(133, 83, 230, 0.01) 100%)",
          borderColor: "rgba(96, 37, 224, 0.08)",
          borderRadius: "20px", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: "rgba(96, 37, 224, 0.02)",
            borderColor: "rgba(96, 37, 224, 0.15)"
          }
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.08)", color: "primary.main", width: 42, height: 42 }}>
            <LockIcon sx={{ fontSize: "1.2rem" }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Your data is private and secure</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>AI recommendations are generated securely and only visible to you.</Typography>
          </Box>
        </Box>
        <Button size="small" sx={{ fontWeight: 700, color: "primary.main" }}>
          Learn more
        </Button>
      </Paper>

      {/* dialog modals */}
      {/* 1. How It Works Modal */}
      <Dialog 
        open={howItWorksOpen} 
        onClose={() => setHowItWorksOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: "24px", p: 2 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 850, pb: 1 }}>How AI recommendations work</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontWeight: 500 }}>
            Our integration with Gemini AI analyzes your physical metrics and workout durations to generate optimizations.
          </DialogContentText>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>1. Performance Aggregation</Typography>
              <Typography variant="body2" color="text.secondary">We capture your duration, type of exercise, and calories burned for each completed activity.</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>2. Gemini LLM Processing</Typography>
              <Typography variant="body2" color="text.secondary">The metrics are submitted securely to the AI model, cross-referenced with general safety guidelines.</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>3. Personalized Feedback</Typography>
              <Typography variant="body2" color="text.secondary">You receive actionable suggestions, highlight areas of progress, and alerts for safety concerns.</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHowItWorksOpen(false)} sx={{ fontWeight: 700 }}>Got it</Button>
        </DialogActions>
      </Dialog>

      {/* 2. Privacy Modal */}
      <Dialog 
        open={privacyOpen} 
        onClose={() => setPrivacyOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: "24px", p: 2 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 850, pb: 1 }}>Data Privacy & Compliance</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 500 }}>
            At Fitness App, your health data security is our absolute priority. All generated AI recommendations conform to the highest safety and encryption standards:
          </DialogContentText>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <LockIcon sx={{ color: "primary.main", mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>End-to-End Encryption</Typography>
                <Typography variant="body2" color="text.secondary">Your session credentials and physical inputs are encrypted in-transit and at-rest.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <SecurityIcon sx={{ color: "primary.main", mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>No Third-Party Advertising Sharing</Typography>
                <Typography variant="body2" color="text.secondary">We do not sell, rent, or distribute your training datasets to any outside advertising network.</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyOpen(false)} sx={{ fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
