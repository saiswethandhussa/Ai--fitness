import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Avatar, Button, Divider, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FlagIcon from '@mui/icons-material/Flag';
import StraightIcon from '@mui/icons-material/Straight';
import ScaleIcon from '@mui/icons-material/Scale';

const ProfileView = ({ user }) => {
  const userId = user?.sub || 'default';
  const localStorageKey = `profile_data_${userId}`;

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.given_name || user?.name?.split(' ')[0] || '',
    lastName: user?.family_name || user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    height: '',
    weight: '',
    biologicalSex: '',
    age: '',
    targetWeight: '',
    weeklyGoal: '',
    primaryStyle: '',
    calorieTarget: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      try {
        setProfile(JSON.parse(savedData));
      } catch (e) {
        console.error("Error parsing saved profile data", e);
      }
    } else {
      // Set default name and email from Keycloak token
      setProfile({
        firstName: user?.given_name || user?.name?.split(' ')[0] || '',
        lastName: user?.family_name || user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        height: '',
        weight: '',
        biologicalSex: '',
        age: '',
        targetWeight: '',
        weeklyGoal: '',
        primaryStyle: '',
        calorieTarget: ''
      });
    }
  }, [localStorageKey, user]);

  const handleChange = (field) => (event) => {
    setProfile({
      ...profile,
      [field]: event.target.value
    });
  };

  const handleSave = () => {
    localStorage.setItem(localStorageKey, JSON.stringify(profile));
    setIsEditing(false);
  };

  // Dynamic BMI Calculation
  const heightInMeters = profile.height ? parseFloat(profile.height) / 100 : 0;
  const bmiVal = (profile.weight && heightInMeters) 
    ? (parseFloat(profile.weight) / (heightInMeters * heightInMeters)).toFixed(1) 
    : null;

  let bmiLabel = '--';
  if (bmiVal) {
    const bmiNum = parseFloat(bmiVal);
    if (bmiNum < 18.5) bmiLabel = `${bmiVal} (Underweight)`;
    else if (bmiNum < 25) bmiLabel = `${bmiVal} (Healthy)`;
    else if (bmiNum < 30) bmiLabel = `${bmiVal} (Overweight)`;
    else bmiLabel = `${bmiVal} (Obese)`;
  }

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || 'John Doe';

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal settings, health records, and fitness goals
          </Typography>
        </Box>
        <Button 
          variant={isEditing ? "contained" : "outlined"} 
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />} 
          color="primary"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? "Save Profile" : "Edit Profile"}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* User Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main', 
                  fontSize: '3rem',
                  fontWeight: 600,
                  mb: 2 
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {profile.email}
              </Typography>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mt: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {profile.weight ? `${profile.weight} kg` : '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Weight
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {profile.height ? `${profile.height} cm` : '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Height
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {bmiVal || '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    BMI
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Goals & Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Health & Fitness Goals
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <ScaleIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Target Weight
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {profile.targetWeight ? `${profile.targetWeight} kg` : 'Not Set'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.light', '& .MuiSvgIcon-root': { color: 'success.dark' } }}>
                          <FlagIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Weekly Exercise Frequency
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {profile.weeklyGoal ? `${profile.weeklyGoal} workouts` : 'Not Set'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'info.light', '& .MuiSvgIcon-root': { color: 'info.dark' } }}>
                          <FitnessCenterIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Primary Training Style
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {profile.primaryStyle || 'Not Set'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'warning.light', '& .MuiSvgIcon-root': { color: 'warning.dark' } }}>
                          <StraightIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Daily Calorie Target
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {profile.calorieTarget ? `${profile.calorieTarget} kcal` : 'Not Set'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* General Information Form */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Biometrics & Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="First Name" 
                        value={profile.firstName} 
                        onChange={handleChange('firstName')} 
                        disabled={!isEditing} 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Last Name" 
                        value={profile.lastName} 
                        onChange={handleChange('lastName')} 
                        disabled={!isEditing} 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Biological Sex" 
                        value={profile.biologicalSex} 
                        onChange={handleChange('biologicalSex')} 
                        disabled={!isEditing} 
                        placeholder="e.g. Male, Female"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Age" 
                        value={profile.age} 
                        onChange={handleChange('age')} 
                        disabled={!isEditing} 
                        type="number" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Height (cm)" 
                        value={profile.height} 
                        onChange={handleChange('height')} 
                        disabled={!isEditing} 
                        type="number" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Weight (kg)" 
                        value={profile.weight} 
                        onChange={handleChange('weight')} 
                        disabled={!isEditing} 
                        type="number" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Target Weight (kg)" 
                        value={profile.targetWeight} 
                        onChange={handleChange('targetWeight')} 
                        disabled={!isEditing} 
                        type="number" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Weekly Goal (workouts)" 
                        value={profile.weeklyGoal} 
                        onChange={handleChange('weeklyGoal')} 
                        disabled={!isEditing} 
                        type="number" 
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Primary Training Style" 
                        value={profile.primaryStyle} 
                        onChange={handleChange('primaryStyle')} 
                        disabled={!isEditing} 
                        placeholder="e.g. Cardio, Strength, Splits"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField 
                        fullWidth 
                        label="Daily Calorie Target (kcal)" 
                        value={profile.calorieTarget} 
                        onChange={handleChange('calorieTarget')} 
                        disabled={!isEditing} 
                        type="number" 
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileView;
