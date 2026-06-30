import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, LinearProgress, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { getActivities, getUserRecommendations } from '../services/api';

const DashboardView = ({ userName, userId }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const todayKey = new Date().toDateString(); // Unique key for today's daily metrics
  const statsStorageKey = `dashboard_stats_${userId || 'default'}_${todayKey}`;
  const profileStorageKey = `profile_data_${userId || 'default'}`;

  // State for daily stats
  const [dailyStats, setDailyStats] = useState({
    steps: 0,
    water: 0.0,
    sleep: 0.0
  });

  // State for backend data
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(4); // Default to 4 workouts

  // Dialog State
  const [openLogModal, setOpenLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    steps: '',
    water: '',
    sleep: ''
  });

  // Load Daily Stats and Profile Goal
  useEffect(() => {
    // Load weekly goal from profile
    const savedProfile = localStorage.getItem(profileStorageKey);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.weeklyGoal) {
          setWeeklyGoal(parseInt(parsed.weeklyGoal) || 4);
        }
      } catch (e) {
        console.error("Error reading profile goal", e);
      }
    }

    // Load daily stats
    const savedStats = localStorage.getItem(statsStorageKey);
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setDailyStats({
          steps: parseInt(parsed.steps) || 0,
          water: parseFloat(parsed.water) || 0.0,
          sleep: parseFloat(parsed.sleep) || 0.0
        });
      } catch (e) {
        console.error("Error parsing saved daily stats", e);
      }
    }
  }, [statsStorageKey, profileStorageKey]);

  // Load activities & AI recommendations from MongoDB
  useEffect(() => {
    if (userId) {
      // Fetch activities
      getActivities()
        .then(response => {
          setActivities(response.data || []);
        })
        .catch(err => {
          console.error("Error fetching activities for dashboard:", err);
        });

      // Fetch AI recommendations
      getUserRecommendations(userId)
        .then(response => {
          setRecommendations(response.data || []);
        })
        .catch(err => {
          console.error("Error fetching AI recommendations for dashboard:", err);
        });
    }
  }, [userId]);

  // Calculate Weekly Stats (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const activitiesThisWeek = activities.filter(act => {
    const actDate = new Date(act.createdAt || act.startTime);
    return actDate >= sevenDaysAgo;
  });

  const weeklyCount = activitiesThisWeek.length;
  const weeklyProgressPercent = Math.min(Math.round((weeklyCount / weeklyGoal) * 100), 100);

  // Extract Heart Rate from latest activity metrics (if logged)
  const heartRateActivity = activities.find(act => 
    act.additionalMetrics && (act.additionalMetrics.maxHeartRate || act.additionalMetrics.averageHeartRate)
  );
  const heartRateVal = heartRateActivity 
    ? `${heartRateActivity.additionalMetrics.maxHeartRate || heartRateActivity.additionalMetrics.averageHeartRate} bpm`
    : '-- bpm';

  // Handle opening log modal
  const handleOpenLogModal = () => {
    setLogForm({
      steps: dailyStats.steps.toString(),
      water: dailyStats.water.toString(),
      sleep: dailyStats.sleep.toString()
    });
    setOpenLogModal(true);
  };

  // Handle saving log modal
  const handleSaveLogModal = () => {
    const updated = {
      steps: parseInt(logForm.steps) || 0,
      water: parseFloat(logForm.water) || 0.0,
      sleep: parseFloat(logForm.sleep) || 0.0
    };
    localStorage.setItem(statsStorageKey, JSON.stringify(updated));
    setDailyStats(updated);
    setOpenLogModal(false);
  };

  // Log Modal Input Change
  const handleLogFormChange = (field) => (event) => {
    setLogForm({
      ...logForm,
      [field]: event.target.value
    });
  };

  // Dynamic Dashboard Card configurations
  const cards = [
    {
      title: 'Daily Steps',
      value: dailyStats.steps > 0 ? dailyStats.steps.toLocaleString() : '0',
      target: '10,000 steps',
      progress: Math.min((dailyStats.steps / 10000) * 100, 100),
      color: '#6025e0',
      icon: <DirectionsRunIcon sx={{ color: '#ffffff' }} />,
      iconBg: '#6025e0'
    },
    {
      title: 'Water Intake',
      value: `${dailyStats.water.toFixed(1)}L`,
      target: '3.0 Liters',
      progress: Math.min((dailyStats.water / 3.0) * 100, 100),
      color: '#0284c7',
      icon: <WaterDropIcon sx={{ color: '#ffffff' }} />,
      iconBg: '#0284c7'
    },
    {
      title: 'Sleep Duration',
      value: `${dailyStats.sleep.toFixed(1)} hrs`,
      target: '8.0 Hours',
      progress: Math.min((dailyStats.sleep / 8.0) * 100, 100),
      color: '#059669',
      icon: <BedtimeIcon sx={{ color: '#ffffff' }} />,
      iconBg: '#059669'
    },
    {
      title: 'Heart Rate',
      value: heartRateVal,
      target: 'Resting avg',
      progress: heartRateActivity ? 100 : 0,
      color: '#ef4444',
      icon: <FavoriteIcon sx={{ color: '#ffffff' }} />,
      iconBg: '#ef4444'
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Hello, {userName || 'Athlete'}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Today is {today}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleOpenLogModal}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Log Today's Metrics
          </Button>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', bgcolor: 'background.paper', p: '8px 16px', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <EmojiEventsIcon color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Weekly Goal: {weeklyProgressPercent}% Completed ({weeklyCount}/{weeklyGoal})
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Avatar sx={{ bgcolor: card.iconBg, width: 40, height: 40 }}>
                    {card.icon}
                  </Avatar>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Target: {card.target}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={card.progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    bgcolor: 'background.subtle',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: card.color,
                      borderRadius: 4
                    }
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary insights & Weekly Challenge */}
      <Grid container spacing={3}>
        {/* AI Recommendations */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
                AI Fitness Insights
              </Typography>
              
              {recommendations.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                      <LocalFireDepartmentIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Latest Training Summary
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {recommendations[0].recommendation}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {recommendations[0].improvements && recommendations[0].improvements.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Avatar sx={{ bgcolor: 'success.light', width: 48, height: 48, '& .MuiSvgIcon-root': { color: 'success.dark' } }}>
                        <AccessTimeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Suggested Area for Improvement
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {recommendations[0].improvements[0]}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    No AI insights generated yet.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Please log activities under the "Activities" tab. Once added, our AI service will generate personalized physical training summaries and improvements here!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Challenge */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #6025e0 0%, #451aa8 100%)', color: '#ffffff' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Weekly Challenge
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85, mb: 3, lineHeight: 1.6 }}>
                  Complete 3 activities of any training style to build consistency and keep up your fitness streak this week.
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Progress</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{weeklyCount} / 3 Workouts</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((weeklyCount / 3) * 100, 100)} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#ffffff',
                      borderRadius: 3
                    }
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Log Daily Metrics Modal */}
      <Dialog open={openLogModal} onClose={() => setOpenLogModal(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Log Daily Snapshot Metrics</DialogTitle>
        <DialogContent sx={{ minWidth: 300, display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Daily Steps"
            type="number"
            fullWidth
            value={logForm.steps}
            onChange={handleLogFormChange('steps')}
          />
          <TextField
            label="Water Intake (Liters)"
            type="number"
            fullWidth
            inputProps={{ step: "0.1" }}
            value={logForm.water}
            onChange={handleLogFormChange('water')}
          />
          <TextField
            label="Sleep Duration (Hours)"
            type="number"
            fullWidth
            inputProps={{ step: "0.5" }}
            value={logForm.sleep}
            onChange={handleLogFormChange('sleep')}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenLogModal(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveLogModal} variant="contained" color="primary">
            Save Metrics
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardView;
