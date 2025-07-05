// src/components/ChartDisplay.jsx

import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// Unicode symbols for Rasi (zodiac) signs
const RASI_SYMBOLS = [
  '♈', // Aries
  '♉', // Taurus
  '♊', // Gemini
  '♋', // Cancer
  '♌', // Leo
  '♍', // Virgo
  '♎', // Libra
  '♏', // Scorpio
  '♐', // Sagittarius
  '♑', // Capricorn
  '♒', // Aquarius
  '♓', // Pisces
];

// Map sign names to index
const SIGN_INDEX = {
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5, Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11
};

// Abbreviations for planets
const PLANET_ABBR = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke', Asc: 'Asc', Lagna: 'Asc', ASC: 'Asc', asc: 'Asc', lagna: 'Asc'
};

function getHousePlanets(planets, houseNum) {
  // planets: [{name, sign, house}]
  return planets
    .filter(p => p.house === houseNum)
    .map(p => PLANET_ABBR[p.name] || p.name)
    .join(', ');
}

function getHouseSign(planets, houseNum) {
  // Find the sign for this house (first planet in house, or fallback)
  const p = planets.find(p => p.house === houseNum);
  return p ? p.sign : '';
}

function getSignSymbol(sign) {
  if (!sign) return '';
  const idx = SIGN_INDEX[sign];
  return typeof idx === 'number' ? RASI_SYMBOLS[idx] : '';
}

// South Indian chart house positions (fixed):
// [ [12, 1, 2, 3],
//   [11, 0, 0, 4],
//   [10, 0, 0, 5],
//   [9, 8, 7, 6] ]
const GRID_HOUSES = [
  [12, 1, 2, 3],
  [11, 0, 0, 4],
  [10, 0, 0, 5],
  [9, 8, 7, 6],
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `chart-tab-${index}`,
    'aria-controls': `chart-tabpanel-${index}`,
  };
}

const ChartDisplay = ({ astrologyResult }) => {
  const [tabValue, setTabValue] = useState(0);
  
  if (!astrologyResult) return null;

  const { fullName, rasi, nakshatra, dateOfBirth, timeOfBirth, placeOfBirth, rasiPlanets, navamsaPlanets } = astrologyResult;
  const ascendantHouse = 1; // For mock, just use house 1 as ascendant

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderChart = (planets, chartType = 'rasi') => {
    return (
      <Box sx={{ 
        display: 'inline-block',
        background: '#f9f9f9',
        border: '2px solid #e0e3e7',
        borderRadius: '12px',
        p: 2,
        m: '0 auto',
        minWidth: { xs: '100%', sm: '420px' },
        minHeight: '420px',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '2px',
          background: '#f0f2f5',
          borderRadius: '8px',
          overflow: 'hidden',
          aspectRatio: '1/1',
          maxWidth: '500px',
          mx: 'auto',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
        }}>
          {GRID_HOUSES.flat().map((house, idx) => {
            // Center 4 cells for birth details
            if ((idx === 5 || idx === 6 || idx === 9 || idx === 10) && chartType === 'rasi') {
              if (idx === 6) {
                // Only render details in one cell (center left)
                return (
                  <Box key={idx} sx={{
                    gridColumn: '2 / span 2',
                    gridRow: '2 / span 2',
                    background: '#fff',
                    border: '1px solid #e0e3e7',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: { xs: '11px', sm: '13px' },
                    fontWeight: 500,
                    textAlign: 'center',
                    p: 1,
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <Box>{dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : ''}</Box>
                    <Box>{timeOfBirth}</Box>
                    <Box sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      fontSize: { xs: '10px', sm: '12px' }
                    }}>
                      {placeOfBirth}
                    </Box>
                    <Box sx={{ mt: 1, fontWeight: 700, color: '#6a11cb' }}>{rasi}</Box>
                    <Box sx={{ fontStyle: 'italic', color: '#666' }}>{nakshatra}</Box>
                    <Box sx={{ 
                      mt: 1, 
                      fontWeight: 700, 
                      fontSize: { xs: '12px', sm: '14px' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {fullName}
                    </Box>
                  </Box>
                );
              }
              return null;
            }
            
            // House cell
            const sign = getHouseSign(planets, house);
            const planetList = getHousePlanets(planets, house);
            const isAsc = house === ascendantHouse && chartType === 'rasi';
            
            return (
              <Box
                key={`${chartType}-${idx}`}
                sx={{
                  background: isAsc ? 'rgba(255, 224, 130, 0.3)' : '#fff',
                  border: isAsc ? '2px solid #fbc02d' : '1px solid #e0e3e7',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0.5,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ 
                  fontSize: { xs: '18px', sm: '22px' }, 
                  fontWeight: 700,
                  color: isAsc ? '#b28704' : '#444',
                  lineHeight: 1
                }}>
                  {getSignSymbol(sign)}
                </Box>
                <Box sx={{ 
                  fontSize: { xs: '10px', sm: '12px' }, 
                  fontWeight: 600,
                  color: isAsc ? '#b28704' : '#555',
                  textAlign: 'center',
                  mt: 0.5
                }}>
                  {sign}
                </Box>
                <Box sx={{ 
                  fontSize: { xs: '9px', sm: '11px' }, 
                  color: isAsc ? '#b28704' : '#666',
                  textAlign: 'center',
                  mt: 0.5,
                  minHeight: '1.5em',
                  lineHeight: '1.2',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '2px'
                }}>
                  {planetList.split(',').map((p, i) => (
                    <span key={i} style={{ whiteSpace: 'nowrap' }}>{p.trim()}</span>
                  ))}
                </Box>
                {isAsc && (
                  <Box sx={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    fontSize: '9px',
                    color: '#b28704',
                    fontWeight: 700,
                    background: 'rgba(255, 224, 130, 0.7)',
                    borderRadius: '4px',
                    px: 0.5,
                    lineHeight: 1.2
                  }}>
                    ASC
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
        <Box sx={{ 
          textAlign: 'center', 
          mt: 2, 
          fontWeight: 600,
          color: '#444',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '14px'
        }}>
          {chartType === 'rasi' ? 'Rasi Chart' : 'Navamsa Chart'}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="chart tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#6a11cb',
              height: 3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              '&.Mui-selected': {
                color: '#6a11cb',
              },
            },
          }}
        >
          <Tab label="Rasi Chart" {...a11yProps(0)} />
          <Tab label="Navamsa Chart" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderChart(rasiPlanets, 'rasi')}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {navamsaPlanets && navamsaPlanets.length > 0 ? (
          renderChart(navamsaPlanets, 'navamsa')
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            color: '#666', 
            fontStyle: 'italic' 
          }}>
            Navamsa chart data not available
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default ChartDisplay;