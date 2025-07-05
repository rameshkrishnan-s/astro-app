import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  FilterList,
  Download,
  Visibility,
  Search,
  Refresh,
  AdminPanelSettings,
  Person,
  Star,
  Cake,
  Schedule,
  LocationOn,
  PictureAsPdf,
  Analytics,
  Close,
  Calculate
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import AuthContext from '../context/AuthContext';
import ChartDisplay from '../components/ChartDisplay';

// Rasi (Zodiac Signs) data
const RASIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Nakshatras (27 Stars) data
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Chart symbols for PDF
const RASI_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_INDEX = {
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5, 
  Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11
};

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    rasi: '',
    nakshatra: ''
  });
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required. User role: {user?.role || 'Not logged in'}
        </Alert>
      </Container>
    );
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching admin data...');
      console.log('API endpoint:', API_ENDPOINTS.ADMIN.ALL_DATA);
      console.log('User token:', localStorage.getItem('token'));
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.ADMIN.ALL_DATA, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.data) {
        setData(response.data.data);
        setFilteredData(response.data.data);
        setStats(response.data.stats || {});
        console.log('Data set successfully:', response.data.data.length, 'records');
      } else {
        setError('Invalid response format from server');
        console.error('Invalid response format:', response.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.msg || err.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.fullName && item.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.user?.name && item.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.user?.email && item.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply other filters
    if (filters.gender) {
      filtered = filtered.filter(item => item.gender === filters.gender);
    }
    if (filters.rasi) {
      filtered = filtered.filter(item => item.rasi === filters.rasi);
    }
    if (filters.nakshatra) {
      filtered = filtered.filter(item => item.nakshatra === filters.nakshatra);
    }

    setFilteredData(filtered);
    setPage(0);
  };

  useEffect(() => {
    applyFilters();
  }, [data, searchTerm, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (userData) => {
    setSelectedUser(userData);
    setShowUserDialog(true);
  };

  const handleViewCharts = (userData) => {
    setSelectedUser(userData);
    setShowCharts(true);
  };

  // Helper function to get sign symbol
  const getSignSymbol = (sign) => {
    if (!sign) return '';
    const idx = SIGN_INDEX[sign];
    return typeof idx === 'number' ? RASI_SYMBOLS[idx] : '';
  };

  // Helper function to get house planets
  const getHousePlanets = (planets, houseNum) => {
    if (!planets) return '';
    return planets
      .filter(p => p.house === houseNum)
      .map(p => p.name)
      .join(', ');
  };

  // Helper function to get house sign
  const getHouseSign = (planets, houseNum) => {
    if (!planets) return '';
    const p = planets.find(p => p.house === houseNum);
    return p ? p.sign : '';
  };

  // Enhanced PDF generation with charts and comprehensive data
  const generateComprehensivePDF = async () => {
    setPdfGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Astrology Data Report', 105, 20, { align: 'center' });
      
      // Filter information
      doc.setFontSize(12);
      let yPos = 35;
      const filterText = [];
      if (filters.gender) filterText.push(`Gender: ${filters.gender}`);
      if (filters.rasi) filterText.push(`Rasi: ${filters.rasi}`);
      if (filters.nakshatra) filterText.push(`Nakshatra: ${filters.nakshatra}`);
      if (searchTerm) filterText.push(`Search: ${searchTerm}`);
      
      if (filterText.length > 0) {
        doc.text(`Filters: ${filterText.join(', ')}`, 20, yPos);
        yPos += 10;
      }
      
      // Statistics
      doc.text(`Total Records: ${filteredData.length}`, 20, yPos);
      yPos += 15;
      
      // Table headers
      const headers = [
        'Name', 'Email', 'Gender', 'Birth Date', 'Birth Time', 'Birth Place',
        'Rasi', 'Nakshatra', 'Created Date'
      ];
      
      // Table data
      const tableData = filteredData.map(item => [
        item.fullName || item.user?.name || 'N/A',
        item.user?.email || 'N/A',
        getGenderLabel(item.gender),
        item.birthDate ? format(new Date(item.birthDate), 'dd/MM/yyyy') : 'N/A',
        item.birthTime || 'N/A',
        item.birthPlace || 'N/A',
        `${getSignSymbol(item.rasi)} ${item.rasi || 'N/A'}`,
        item.nakshatra || 'N/A',
        item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'
      ]);
      
      // Add table to PDF
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: yPos,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      
      // Save PDF
      const fileName = `astrology_report_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF');
    } finally {
      setPdfGenerating(false);
    }
  };

  // Generate individual user PDF
  const generateUserPDF = (userData) => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Individual Astrology Report', 105, 20, { align: 'center' });
      
      let yPos = 35;
      
      // Personal Information
      doc.setFontSize(14);
      doc.text('Personal Information', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Name: ${userData.fullName || userData.user?.name || 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Email: ${userData.user?.email || 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Gender: ${getGenderLabel(userData.gender)}`, 20, yPos);
      yPos += 7;
      doc.text(`Birth Date: ${userData.birthDate ? format(new Date(userData.birthDate), 'dd/MM/yyyy') : 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Birth Time: ${userData.birthTime || 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Birth Place: ${userData.birthPlace || 'N/A'}`, 20, yPos);
      yPos += 15;
      
      // Astrology Information
      doc.setFontSize(14);
      doc.text('Astrology Information', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.text(`Rasi: ${getSignSymbol(userData.rasi)} ${userData.rasi || 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Nakshatra: ${userData.nakshatra || 'N/A'}`, 20, yPos);
      yPos += 7;
      doc.text(`Ascendant: ${userData.ascendant || 'N/A'}`, 20, yPos);
      yPos += 15;
      
      // Planetary Positions
      if (userData.planets && userData.planets.length > 0) {
        doc.setFontSize(14);
        doc.text('Planetary Positions', 20, yPos);
        yPos += 10;
        
        const planetHeaders = ['Planet', 'Sign', 'House', 'Degree'];
        const planetData = userData.planets.map(planet => [
          planet.name,
          planet.sign,
          planet.house,
          planet.degree ? `${planet.degree}°` : 'N/A'
        ]);
        
        autoTable(doc, {
          head: [planetHeaders],
          body: planetData,
          startY: yPos,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });
      }
      
      // Save PDF
      const fileName = `user_report_${userData.fullName || userData.user?.name || 'user'}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('User PDF generation error:', error);
      setError('Failed to generate user PDF');
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'm': return 'primary';
      case 'f': return 'secondary';
      case 'o': return 'default';
      default: return 'default';
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'm': return 'Male';
      case 'f': return 'Female';
      case 'o': return 'Other';
      default: return 'N/A';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <AdminPanelSettings sx={{ mr: 2, verticalAlign: 'middle' }} />
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and analyze user astrology data
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                {stats.total || data.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Filtered Results
              </Typography>
              <Typography variant="h4">
                {filteredData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Male Users
              </Typography>
              <Typography variant="h4">
                {stats.byGender?.male || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Female Users
              </Typography>
              <Typography variant="h4">
                {stats.byGender?.female || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              fullWidth
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                label="Gender"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="m">Male</MenuItem>
                <MenuItem value="f">Female</MenuItem>
                <MenuItem value="o">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Rasi</InputLabel>
              <Select
                value={filters.rasi}
                onChange={(e) => handleFilterChange('rasi', e.target.value)}
                label="Rasi"
              >
                <MenuItem value="">All</MenuItem>
                {RASIS.map(rasi => (
                  <MenuItem key={rasi} value={rasi}>
                    {getSignSymbol(rasi)} {rasi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Nakshatra</InputLabel>
              <Select
                value={filters.nakshatra}
                onChange={(e) => handleFilterChange('nakshatra', e.target.value)}
                label="Nakshatra"
              >
                <MenuItem value="">All</MenuItem>
                {NAKSHATRAS.map(nakshatra => (
                  <MenuItem key={nakshatra} value={nakshatra}>
                    ⭐ {nakshatra}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchData}
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={generateComprehensivePDF}
              disabled={pdfGenerating || filteredData.length === 0}
              startIcon={pdfGenerating ? <CircularProgress size={20} /> : <PictureAsPdf />}
            >
              {pdfGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Birth Details</TableCell>
                <TableCell>Rasi</TableCell>
                <TableCell>Nakshatra</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      {loading ? 'Loading data...' : 'No data found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={item._id || index}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {item.fullName || item.user?.name || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.user?.email || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getGenderLabel(item.gender)}
                          color={getGenderColor(item.gender)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {item.birthDate ? format(new Date(item.birthDate), 'dd/MM/yyyy') : 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.birthTime || 'N/A'} • {item.birthPlace || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            {getSignSymbol(item.rasi)}
                          </Typography>
                          <Typography variant="body2">
                            {item.rasi || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Star sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">
                            {item.nakshatra || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy') : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(item)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Charts">
                            <IconButton
                              size="small"
                              onClick={() => handleViewCharts(item)}
                            >
                              <Calculate />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <IconButton
                              size="small"
                              onClick={() => generateUserPDF(item)}
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* User Details Dialog */}
      <Dialog
        open={showUserDialog}
        onClose={() => setShowUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          User Details
          <IconButton
            onClick={() => setShowUserDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Typography><strong>Name:</strong> {selectedUser.fullName || selectedUser.user?.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedUser.user?.email}</Typography>
                  <Typography><strong>Gender:</strong> {getGenderLabel(selectedUser.gender)}</Typography>
                  <Typography><strong>Birth Date:</strong> {selectedUser.birthDate ? format(new Date(selectedUser.birthDate), 'dd/MM/yyyy') : 'N/A'}</Typography>
                  <Typography><strong>Birth Time:</strong> {selectedUser.birthTime}</Typography>
                  <Typography><strong>Birth Place:</strong> {selectedUser.birthPlace}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>Astrology Information</Typography>
                  <Typography><strong>Rasi:</strong> {getSignSymbol(selectedUser.rasi)} {selectedUser.rasi}</Typography>
                  <Typography><strong>Nakshatra:</strong> ⭐ {selectedUser.nakshatra}</Typography>
                  <Typography><strong>Ascendant:</strong> {selectedUser.ascendant}</Typography>
                  <Typography><strong>Created:</strong> {selectedUser.createdAt ? format(new Date(selectedUser.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</Typography>
                </Grid>
              </Grid>
              
              {selectedUser.planets && selectedUser.planets.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>Planetary Positions</Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Planet</TableCell>
                          <TableCell>Sign</TableCell>
                          <TableCell>House</TableCell>
                          <TableCell>Degree</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedUser.planets.map((planet, index) => (
                          <TableRow key={index}>
                            <TableCell>{planet.name}</TableCell>
                            <TableCell>{planet.sign}</TableCell>
                            <TableCell>{planet.house}</TableCell>
                            <TableCell>{planet.degree ? `${planet.degree}°` : 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => generateUserPDF(selectedUser)} startIcon={<Download />}>
            Download PDF
          </Button>
          <Button onClick={() => setShowUserDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Charts Dialog */}
      <Dialog
        open={showCharts}
        onClose={() => setShowCharts(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Astrology Charts
          <IconButton
            onClick={() => setShowCharts(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <ChartDisplay
              birthData={{
                name: selectedUser.fullName || selectedUser.user?.name,
                date: selectedUser.birthDate,
                time: selectedUser.birthTime,
                place: selectedUser.birthPlace,
                latitude: selectedUser.latitude,
                longitude: selectedUser.longitude
              }}
              calculatedData={selectedUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminPage; 