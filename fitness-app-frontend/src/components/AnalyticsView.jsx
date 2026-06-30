import React from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Button, 
  IconButton,
  Divider,
  Chip,
  Paper,
  Avatar
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StarIcon from "@mui/icons-material/Star";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

// Sparkline Subcomponent
const Sparkline = ({ points, color }) => {
  const height = 30;
  const width = 100;
  const padding = 2;
  
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;
  
  const svgPoints = points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - padding - ((val - minVal) / valRange) * (height - 2 * padding);
    return { x, y };
  });
  
  let pathD = "";
  if (svgPoints.length > 0) {
    pathD = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 1; i < svgPoints.length; i++) {
      const p0 = svgPoints[i - 1];
      const p1 = svgPoints[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  return (
    <Box sx={{ width: 85, height: 28, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};

// Mini Bar Chart for Peak Day
const MiniBarChart = () => {
  const bars = [
    { height: 40, active: false },
    { height: 35, active: false },
    { height: 75, active: true }, // Wednesday Peak
    { height: 30, active: false },
    { height: 45, active: false },
    { height: 50, active: false },
    { height: 25, active: false }
  ];
  return (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end", height: 28, width: 70, ml: "auto" }}>
      {bars.map((bar, i) => (
        <Box
          key={i}
          sx={{
            width: 5,
            height: `${bar.height}%`,
            bgcolor: bar.active ? "#f59e0b" : "rgba(148, 163, 184, 0.25)",
            borderRadius: "1px"
          }}
        />
      ))}
    </Box>
  );
};

const AnalyticsView = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header and Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 850, mb: 0.5, letterSpacing: -0.5 }}>
            Analytics & Performance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 550 }}>
            Detailed metrics of your physical training history
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarMonthIcon sx={{ fontSize: "1.1rem" }} />}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              borderRadius: "50px",
              borderColor: "divider",
              color: "text.primary",
              fontWeight: 650,
              textTransform: "none",
              px: 2,
              py: 0.8,
              "&:hover": { borderColor: "text.primary", bgcolor: "transparent" }
            }}
          >
            May 12 – May 18, 2024
          </Button>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<FileDownloadIcon />}
            sx={{
              borderRadius: "50px",
              bgcolor: "primary.main",
              fontWeight: 700,
              textTransform: "none",
              px: 2.5,
              py: 1,
              boxShadow: "none",
              "&:hover": { bgcolor: "primary.dark", boxShadow: "none" }
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Grid of 4 KPI Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Weekly Avg Duration */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.08)", width: 44, height: 44, color: "primary.main" }}>
                  <AccessTimeIcon sx={{ fontSize: "1.3rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Weekly Avg Duration
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 850, lineHeight: 1.1 }}>
                    71.4 min/day
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800, fontSize: "0.75rem" }}>
                    ↑ 12%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    vs last week
                  </Typography>
                </Box>
                <Sparkline points={[60, 50, 85, 45, 90, 75, 80]} color="#6025e0" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Avg Calories */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(239, 68, 68, 0.08)", width: 44, height: 44, color: "error.main" }}>
                  <LocalFireDepartmentIcon sx={{ fontSize: "1.3rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Weekly Avg Calories
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 850, lineHeight: 1.1 }}>
                    335 kcal/day
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800, fontSize: "0.75rem" }}>
                    ↑ 8%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    vs last week
                  </Typography>
                </Box>
                <Sparkline points={[250, 180, 420, 200, 310, 290, 335]} color="#ef4444" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Consistency Score */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.08)", width: 44, height: 44, color: "success.main" }}>
                  <AssessmentIcon sx={{ fontSize: "1.3rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Consistency Score
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 850, lineHeight: 1.1 }}>
                    86 / 100
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800, fontSize: "0.75rem" }}>
                    ↑ 6%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    vs last week
                  </Typography>
                </Box>
                <Sparkline points={[80, 82, 85, 83, 86, 84, 86]} color="#10b981" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Peak Day Performance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "rgba(245, 158, 11, 0.08)", width: 44, height: 44, color: "#f59e0b" }}>
                  <StarIcon sx={{ fontSize: "1.3rem" }} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Peak Day Performance
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 850, lineHeight: 1.1 }}>
                    Wednesday
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Most active day
                  </Typography>
                </Box>
                <MiniBarChart />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle Panels: Workout Duration Line Chart & Splits Donut */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Workout Duration (Minutes) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Workout Duration (Minutes)
                  </Typography>
                  <InfoOutlinedIcon sx={{ fontSize: "1.05rem", color: "text.secondary", cursor: "pointer" }} />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    borderRadius: "50px",
                    borderColor: "divider",
                    color: "text.primary",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    px: 1.8,
                    py: 0.5
                  }}
                >
                  Minutes
                </Button>
              </Box>

              {/* Line Chart Area (Beautiful Custom SVG with tooltip) */}
              <Box sx={{ position: "relative", height: 220, width: "100%", mt: 1, mb: 3 }}>
                <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="180" x2="700" y2="180" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
                  <line x1="0" y1="135" x2="700" y2="135" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
                  <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
                  <line x1="0" y1="45" x2="700" y2="45" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
                  
                  {/* Y Axis Labels */}
                  <text x="-10" y="184" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="500">0</text>
                  <text x="-10" y="139" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="500">30</text>
                  <text x="-10" y="94" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="500">60</text>
                  <text x="-10" y="49" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="500">90</text>
                  <text x="-10" y="4" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="500">120</text>

                  {/* Gradient Fill under line */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6025e0" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6025e0" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Main Line path */}
                  {/* Points: Mon(50, 115) -> Tue(150, 100) -> Wed(250, 45) -> Thu(350, 120) -> Fri(450, 95) -> Sat(550, 75) -> Sun(650, 85) */}
                  <path
                    d="M 50 115 C 100 110, 100 100, 150 100 C 200 100, 200 45, 250 45 C 300 45, 300 120, 350 120 C 400 120, 400 95, 450 95 C 500 95, 500 75, 550 75 C 600 75, 600 85, 650 85"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 50 115 C 100 110, 100 100, 150 100 C 200 100, 200 45, 250 45 C 300 45, 300 120, 350 120 C 400 120, 400 95, 450 95 C 500 95, 500 75, 550 75 C 600 75, 600 85, 650 85"
                    fill="none"
                    stroke="#6025e0"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Vertical dotted line on Wednesday Peak */}
                  <line x1="250" y1="45" x2="250" y2="180" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Highlight Peak Dot */}
                  <circle cx="250" cy="45" r="5" fill="#6025e0" />
                  <circle cx="250" cy="45" r="9" stroke="rgba(96, 37, 224, 0.3)" strokeWidth="3" fill="none" />

                  {/* X Axis Labels */}
                  <text x="50" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Mon</text>
                  <text x="150" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Tue</text>
                  <text x="250" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Wed</text>
                  <text x="350" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Thu</text>
                  <text x="450" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Fri</text>
                  <text x="550" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Sat</text>
                  <text x="650" y="200" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">Sun</text>
                </svg>

                {/* Floating Tooltip Box for Wednesday Peak */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: "30.5%", // Aligns to Wednesday (250px out of 700px = ~35%)
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "8px",
                    p: "4px 10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    textAlign: "center",
                    zIndex: 2,
                    pointerEvents: "none"
                  }}
                >
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "text.secondary", lineHeight: 1.1 }}>
                    Wed, May 15
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "primary.main" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: "text.primary" }}>
                      120 min
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bottom Stat Boxes inside Grid */}
              <Grid container spacing={2} sx={{ mt: 3, borderTop: "1px solid", borderColor: "divider", pt: 2.5 }}>
                
                {/* Total This Week */}
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.05)", width: 36, height: 36, color: "primary.main" }}>
                      <AccessTimeIcon sx={{ fontSize: "1.1rem" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650, display: "block", lineHeight: 1.1 }}>
                        Total This Week
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        500 min
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Avg This Week */}
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.05)", width: 36, height: 36, color: "#10b981" }}>
                      <TrendingUpIcon sx={{ fontSize: "1.1rem" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650, display: "block", lineHeight: 1.1 }}>
                        Avg This Week
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        71.4 min/day
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Goal */}
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "rgba(2, 132, 199, 0.05)", width: 36, height: 36, color: "#0284c7" }}>
                      <TrackChangesIcon sx={{ fontSize: "1.1rem" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650, display: "block", lineHeight: 1.1 }}>
                        Goal
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        75 min/day
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Goal Progress */}
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650 }}>
                        Goal Progress
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "warning.main" }}>
                        95%
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", height: 6, bgcolor: "rgba(245, 158, 11, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
                      <Box sx={{ width: "95%", bgcolor: "#f59e0b" }} />
                    </Box>
                  </Box>
                </Grid>
                
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Workout Splits */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Workout Splits
                </Typography>
                <InfoOutlinedIcon sx={{ fontSize: "1.05rem", color: "text.secondary", cursor: "pointer" }} />
              </Box>

              {/* Donut Chart and Legend Row */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 4, flexGrow: 1 }}>
                
                {/* SVG Donut Chart */}
                <Box sx={{ position: "relative", width: 120, height: 120 }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    {/* Circle Radius = 30, Circumference = 188.49 */}
                    {/* Running Segment: 65% (length = 122.52, offset = 0) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#6025e0"
                      strokeWidth="12"
                      strokeDasharray="122.52 188.49"
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                    
                    {/* Walking Segment: 20% (length = 37.70, offset = -122.52) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="12"
                      strokeDasharray="37.70 188.49"
                      strokeDashoffset="-122.52"
                      transform="rotate(-90 50 50)"
                    />
                    
                    {/* Cycling Segment: 15% (length = 28.27, offset = -160.22) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="rgba(96, 37, 224, 0.12)"
                      strokeWidth="12"
                      strokeDasharray="28.27 188.49"
                      strokeDashoffset="-160.22"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  
                  {/* Center Text labels */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: "text.primary", lineHeight: 1 }}>
                      100%
                    </Typography>
                    <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "text.secondary", mt: 0.2 }}>
                      Total Time
                    </Typography>
                  </Box>
                </Box>

                {/* Splits Legend List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1, pl: 2 }}>
                  
                  {/* Running */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>Running</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 800 }}>65%</Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", fontWeight: 600 }}>250 min</Typography>
                    </Box>
                  </Box>

                  {/* Walking */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#c084fc" }} />
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>Walking</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 800 }}>20%</Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", fontWeight: 600 }}>100 min</Typography>
                    </Box>
                  </Box>

                  {/* Cycling */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "rgba(96, 37, 224, 0.12)" }} />
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>Cycling</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 800 }}>15%</Typography>
                      <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", fontWeight: 600 }}>75 min</Typography>
                    </Box>
                  </Box>
                  
                </Box>
              </Box>

              {/* Splits Bottom highlight Alert Card */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "rgba(96, 37, 224, 0.03)",
                  borderColor: "rgba(96, 37, 224, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(96, 37, 224, 0.05)" }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.08)", width: 34, height: 34, color: "primary.main" }}>
                    <DirectionsRunIcon sx={{ fontSize: "1.1rem" }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 850, color: "primary.main", lineHeight: 1.1 }}>
                      Running is your primary activity
                    </Typography>
                    <Typography sx={{ fontSize: "0.68rem", color: "text.secondary", fontWeight: 650, mt: 0.2 }}>
                      Great job! Keep up the consistency.
                    </Typography>
                  </Box>
                </Box>
                <ArrowForwardIosIcon sx={{ fontSize: "0.75rem", color: "primary.main" }} />
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

      {/* Bottom Section: Insights & Highlights (Left) & AI Recommendation (Right) */}
      <Grid container spacing={3}>
        
        {/* Insights & Highlights */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                Insights & Highlights
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                
                {/* Consistency highlight */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "12px" }}>
                  <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.08)", color: "#10b981", width: 38, height: 38 }}>
                    <TrendingUpIcon sx={{ fontSize: "1.1rem" }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: "text.primary" }}>
                      Great Consistency!
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontWeight: 600 }}>
                      You worked out 6 days this week.
                    </Typography>
                  </Box>
                </Box>

                {/* Calories burned highlight */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "12px" }}>
                  <Avatar sx={{ bgcolor: "rgba(239, 68, 68, 0.08)", color: "error.main", width: 38, height: 38 }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: "1.1rem" }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: "text.primary" }}>
                      Calories Burned
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontWeight: 600 }}>
                      You burned 335 kcal/day on average.
                    </Typography>
                  </Box>
                </Box>

                {/* Peak performance day highlight */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "12px" }}>
                  <Avatar sx={{ bgcolor: "rgba(96, 37, 224, 0.08)", color: "primary.main", width: 38, height: 38 }}>
                    <EmojiEventsIcon sx={{ fontSize: "1.1rem" }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: "text.primary" }}>
                      Peak Performance
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontWeight: 600 }}>
                      Wednesday was your most active day.
                    </Typography>
                  </Box>
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendation Box */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)", height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: "1.15rem" }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      AI Recommendation
                    </Typography>
                  </Box>
                  <Chip 
                    label="New" 
                    size="small" 
                    sx={{ 
                      bgcolor: "rgba(16, 185, 129, 0.08)", 
                      color: "#10b981", 
                      fontWeight: 800, 
                      fontSize: "0.68rem", 
                      height: 18, 
                      borderRadius: "4px" 
                    }} 
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "text.primary", mb: 0.75 }}>
                    Try adding strength training 2x this week
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", fontWeight: 650, lineHeight: 1.35 }}>
                    It will help improve your overall performance.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: "50px",
                  bgcolor: "primary.main",
                  fontWeight: 750,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  py: 1,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "primary.dark", boxShadow: "none" }
                }}
              >
                View Plan
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>
    </Box>
  );
};

export default AnalyticsView;
