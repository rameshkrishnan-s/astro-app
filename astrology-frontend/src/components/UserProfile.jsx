import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Download,
  Person,
  Cake,
  Schedule,
  LocationOn,
  Star,
  Visibility,
  Close,
  Print
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import ChartDisplay from './ChartDisplay';

const UserProfile = ({ userData, astrologyResult }) => {
  const [showCharts, setShowCharts] = useState(false);
  const [selectedChart, setSelectedChart] = useState('rasi');

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Vedic Astrology Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 105, 25, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Personal Information
    doc.setFontSize(16);
    doc.text('Personal Information', 14, 45);
    
    const personalInfo = [
      ['Name', astrologyResult.fullName],
      ['Date of Birth', format(new Date(astrologyResult.dateOfBirth), 'MMMM dd, yyyy')],
      ['Time of Birth', astrologyResult.timeOfBirth],
      ['Place of Birth', astrologyResult.placeOfBirth],
      ['Rasi (Moon Sign)', astrologyResult.rasi],
      ['Nakshatra', astrologyResult.nakshatra],
    ];
    
    doc.autoTable({
      startY: 50,
      head: [['Field', 'Value']],
      body: personalInfo,
      theme: 'grid',
      headStyles: { 
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    
    // Planet Positions
    doc.text('Planet Positions (Rasi Chart)', 14, doc.autoTable.previous.finalY + 15);
    
    const planetData = astrologyResult.rasiPlanets.map(planet => [
      planet.name,
      planet.sign,
      planet.house,
      planet.degree?.toFixed(2) || 'N/A'
    ]);
    
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Planet', 'Sign', 'House', 'Degree']],
      body: planetData,
      theme: 'grid',
      headStyles: { 
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    
    // Add chart images if available
    if (astrologyResult.rasiChartSvg) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Rasi Chart', 105, 20, { align: 'center' });
      
      // Convert SVG to image and add to PDF
      // Note: This is a simplified version. In a real implementation,
      // you'd need to convert SVG to canvas/image first
      doc.text('Chart visualization would be included here', 105, 100, { align: 'center' });
    }
    
    // Save the PDF
    doc.save(`${astrologyResult.fullName}-vedic-astrology-report.pdf`);
  };

  return (
    <Box>
      {/* Profile Header */}
      <Card 
        elevation={0}
        sx={{ 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                fontSize: '2rem',
                fontWeight: 600
              }}
            >
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {astrologyResult.fullName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                Vedic Astrology Profile
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={astrologyResult.rasi} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
                <Chip 
                  label={astrologyResult.nakshatra} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={generatePDF}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Download PDF Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setShowCharts(true)}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              View Charts
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ background: 'white', borderRadius: 3, border: '1px solid #e1e8ed' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: '#667eea' }} />
                Personal Details
              </Typography>
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Cake sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {format(new Date(astrologyResult.dateOfBirth), 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Time of Birth</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {astrologyResult.timeOfBirth}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 2, color: '#667eea' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Place of Birth</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {astrologyResult.placeOfBirth}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ background: 'white', borderRadius: 3, border: '1px solid #e1e8ed' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Star sx={{ mr: 1, color: '#667eea' }} />
                Astrological Details
              </Typography>
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Rasi (Moon Sign)</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {astrologyResult.rasi}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Nakshatra</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {astrologyResult.nakshatra}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Planets Analyzed</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {astrologyResult.rasiPlanets?.length || 0} planets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Planet Positions */}
      <Card elevation={0} sx={{ background: 'white', borderRadius: 3, border: '1px solid #e1e8ed', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Planet Positions (Rasi Chart)
          </Typography>
          <Grid container spacing={2}>
            {astrologyResult.rasiPlanets?.map((planet, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    border: '1px solid #e1e8ed',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
                    {planet.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {planet.sign}
                  </Typography>
                  <Chip 
                    label={`House ${planet.house}`} 
                    size="small"
                    sx={{ 
                      backgroundColor: '#667eea',
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Charts Dialog */}
      <Dialog 
        open={showCharts} 
        onClose={() => setShowCharts(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Astrological Charts
          </Typography>
          <IconButton onClick={() => setShowCharts(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ChartDisplay astrologyResult={astrologyResult} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={generatePDF}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile; 