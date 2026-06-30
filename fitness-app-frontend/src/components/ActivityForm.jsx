import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addActivity } from '../services/api';

const ActivityForm = ({ open, onClose, onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING', 
    duration: '', 
    caloriesBurned: '',
    additionalMetrics: {}
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned) return;
    
    setLoading(true);
    try {
      await addActivity({
        type: activity.type,
        duration: parseInt(activity.duration, 10),
        caloriesBurned: parseInt(activity.caloriesBurned, 10),
        additionalMetrics: activity.additionalMetrics
      });
      onActivityAdded();
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: { borderRadius: 4, p: 1 }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          Add New Activity
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 1 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="activity-type-label">Activity Type</InputLabel>
            <Select
              labelId="activity-type-label"
              value={activity.type}
              label="Activity Type"
              onChange={(e) => setActivity({ ...activity, type: e.target.value })}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="RUNNING">Running</MenuItem>
              <MenuItem value="WALKING">Walking</MenuItem>
              <MenuItem value="CYCLING">Cycling</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Duration (Minutes)"
            type="number"
            value={activity.duration}
            onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            required
            slotProps={{
              htmlInput: { min: 1 }
            }}
          />
          
          <TextField
            fullWidth
            label="Calories Burned"
            type="number"
            value={activity.caloriesBurned}
            onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            required
            slotProps={{
              htmlInput: { min: 0 }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} variant="text" sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ px: 3, py: 1 }}
          >
            {loading ? 'Adding...' : 'Add Activity'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ActivityForm;
