import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WcIcon from '@mui/icons-material/Wc';
import SignpostIcon from '@mui/icons-material/Signpost';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import ta from '../translations/ta';

const ProfileSection = ({ userData, astrologyResult }) => {
  const downloadPdf = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(ta.astrologyReport, 105, 20, { align: 'center' });
    
    // Add user details
    doc.setFontSize(12);
    doc.text(ta.personalInformation, 14, 40);
    
    const userInfo = [
      [ta.name, astrologyResult.fullName],
      [ta.dateOfBirth, new Date(astrologyResult.dateOfBirth).toLocaleDateString()],
      [ta.timeOfBirth, astrologyResult.timeOfBirth],
      [ta.placeOfBirth, astrologyResult.placeOfBirth],
      [ta.rasi, astrologyResult.rasi],
      [ta.nakshatra, ta.nakshatras[astrologyResult.nakshatra] || astrologyResult.nakshatra],
    ];
    
    doc.autoTable({
      startY: 45,
      head: [[ta.field, ta.value]],
      body: userInfo,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });
    
    // Add planet positions
    doc.text(ta.planetPositions, 14, doc.autoTable.previous.finalY + 15);
    
    const planetData = astrologyResult.rasiPlanets.map(planet => ({
      planet: planet.name,
      sign: planet.sign,
      house: planet.house,
      degree: planet.degree?.toFixed(2) || 'N/A'
    }));
    
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [[ta.planet, ta.sign, ta.house, ta.degree]],
      body: planetData.map(p => [p.planet, p.sign, p.house, p.degree]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
    });
    
    // Save the PDF
    doc.save(`${astrologyResult.fullName}-astrology-report.pdf`);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, direction: 'rtl' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2" sx={{ fontFamily: 'Arial Unicode MS, sans-serif' }}>
          {ta.yourAstrologyProfile}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<CloudDownloadIcon />}
          onClick={downloadPdf}
          sx={{ fontFamily: 'Arial Unicode MS, sans-serif' }}
        >
          {ta.downloadPdf}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', fontFamily: 'Arial Unicode MS, sans-serif' }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              {ta.personalDetails}
            </Typography>
            <Box sx={{ '& > *': { mb: 1.5 } }}>
              <ListItemText primary={ta.name} secondary={userData.fullName} primaryTypographyProps={{ fontFamily: 'Arial Unicode MS, sans-serif' }} />
              <ListItemText primary={ta.dateOfBirth} secondary={format(new Date(userData.dateOfBirth), 'MMMM d, yyyy')} primaryTypographyProps={{ fontFamily: 'Arial Unicode MS, sans-serif' }} />
              <ListItemText primary={ta.timeOfBirth} secondary={userData.timeOfBirth} primaryTypographyProps={{ fontFamily: 'Arial Unicode MS, sans-serif' }} />
              <ListItemText primary={ta.placeOfBirth} secondary={userData.placeOfBirth} primaryTypographyProps={{ fontFamily: 'Arial Unicode MS, sans-serif' }} />
              <ListItemText primary={ta.rasi} secondary={userData.rasi} primaryTypographyProps={{ fontFamily: 'Arial Unicode MS, sans-serif' }} />
              <ListItemText primary={ta.nakshatra} secondary={ta.nakshatras[userData.nakshatra] || userData.nakshatra} primaryTypographyProps={{ fontFamily: 'Arial Unicode MS, sans-serif' }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center', fontFamily: 'Arial Unicode MS, sans-serif' }}>
              <SignpostIcon sx={{ mr: 1, color: 'primary.main' }} />
              {ta.planetPositions}
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
              gap: 1.5,
              '& > div': {
                p: 1,
                bgcolor: '#f8f9fa',
                borderRadius: 1,
                textAlign: 'center',
                borderLeft: '3px solid #6a11cb'
              }
            }}>
              {astrologyResult.rasiPlanets.map((planet, index) => (
                <Box key={index}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                    {planet.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {planet.sign} (H{planet.house})
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', borderBottom: '2px solid #f1f1f1', pb: 1 }}>
          Rasi Chart
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <ChartDisplay astrologyResult={astrologyResult} />
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileSection;
