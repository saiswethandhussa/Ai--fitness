import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, FormControlLabel, Switch, Divider, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SecurityIcon from '@mui/icons-material/Security';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    aiAlerts: true,
    publicProfile: false,
    shareData: true,
    units: 'metric',
    language: 'en'
  });

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings({
      ...settings,
      [field]: value
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure notification preferences, measurement units, and security rules
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <NotificationsIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.emailNotifications} onChange={handleChange('emailNotifications')} color="primary" />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">Receive daily email summaries of your activity logs</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={<Switch checked={settings.weeklyDigest} onChange={handleChange('weeklyDigest')} color="primary" />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Weekly AI Digests</Typography>
                  <Typography variant="caption" color="text.secondary">Get detailed weekly reports with customized training improvements</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={<Switch checked={settings.aiAlerts} onChange={handleChange('aiAlerts')} color="primary" />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Real-time Safety Warnings</Typography>
                  <Typography variant="caption" color="text.secondary">Immediate safety alerts if activity pace or duration indicates fatigue</Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <SettingsSuggestIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Preferences
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Measurement Units</InputLabel>
              <Select value={settings.units} label="Measurement Units" onChange={handleChange('units')}>
                <MenuItem value="metric">Metric (kg, cm, km)</MenuItem>
                <MenuItem value="imperial">Imperial (lbs, inches, miles)</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Language</InputLabel>
              <Select value={settings.language} label="Language" onChange={handleChange('language')}>
                <MenuItem value="en">English (US)</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Privacy & Data Sharing
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch checked={settings.publicProfile} onChange={handleChange('publicProfile')} color="primary" />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Public Fitness Profile</Typography>
                  <Typography variant="caption" color="text.secondary">Allow other users in the group to see your training leaderboard rank</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={<Switch checked={settings.shareData} onChange={handleChange('shareData')} color="primary" />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Share Analytics with Coaches</Typography>
                  <Typography variant="caption" color="text.secondary">Automatically export fitness details to authorized personal trainers</Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" startIcon={<SaveIcon />} color="primary">
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsView;
