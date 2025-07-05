# Prokerala API Setup Guide

This guide will help you set up the Prokerala API integration for generating real astrological charts with accurate planet positions.

## What is Prokerala API?

Prokerala provides a comprehensive Vedic astrology API that offers:
- Real astronomical calculations
- Accurate planet positions
- Multiple chart types (Rasi, Navamsa, etc.)
- SVG chart generation
- Support for different ayanamsas (Lahiri, Raman, KP)

## Getting Started

### 1. Sign Up for Prokerala API

1. Visit [Prokerala API](https://api.prokerala.com/)
2. Create an account and sign up for API access
3. Choose a plan that suits your needs (they offer free tiers)
4. Get your API key from the dashboard

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env` in the `astrology-backend` directory:
   ```bash
   cp env.example .env
   ```

2. Add your Prokerala API key to the `.env` file:
   ```env
   PROKERALA_API_KEY=your_actual_api_key_here
   ```

### 3. Test the Integration

Run the test script to verify your API key works:

```bash
cd astrology-backend
node test-prokerala.js
```

You should see output like:
```
Testing Prokerala API integration...
✅ Basic horoscope API response: { rasi: 'Capricorn', nakshatra: 'Uttara Ashadha', ascendant: 'Libra' }
✅ Planet position API response: { planetsCount: 9, firstPlanet: 'Sun' }
✅ Chart generation API response: { svgLength: 1234, containsSvg: true, containsPlanets: true }
🎉 All API tests passed! Prokerala integration is working correctly.
```

## API Features

### Chart Types Supported
- **Rasi Chart**: Main birth chart showing planet positions in zodiac signs
- **Navamsa Chart**: Divisional chart for marriage and relationships
- **Lagna Chart**: Ascendant-based chart
- **And more**: Trimsamsa, Drekkana, Chaturthamsa, etc.

### Ayanamsa Options
- **1**: Lahiri (Most commonly used in India)
- **3**: Raman
- **5**: KP (Krishnamurti Paddhati)

### Chart Styles
- **south-indian**: Traditional South Indian style
- **north-indian**: North Indian style
- **east-indian**: East Indian style

## API Endpoints Used

### 1. Basic Horoscope
```
GET /v2/astrology/basic-horoscope
```
Returns basic information like Rasi, Nakshatra, and Ascendant.

### 2. Planet Positions
```
GET /v2/astrology/planet-position
```
Returns detailed planet positions with degrees, houses, and retrograde status.

### 3. Chart Generation
```
GET /v2/astrology/chart
```
Returns SVG chart with visual representation of the birth chart.

## Error Handling

The application handles various API errors:

- **401 Unauthorized**: Check your API key
- **429 Rate Limited**: Wait before making more requests
- **400 Bad Request**: Check input parameters
- **500 Server Error**: API service temporarily unavailable

## Rate Limits

Be aware of Prokerala's rate limits:
- Free tier: Limited requests per day
- Paid tiers: Higher limits
- Check your dashboard for current usage

## Troubleshooting

### Common Issues

1. **"PROKERALA_API_KEY not found"**
   - Make sure you've added the API key to your `.env` file
   - Restart your server after adding the key

2. **"Authentication failed"**
   - Verify your API key is correct
   - Check if your account is active

3. **"Rate limit exceeded"**
   - Wait before making more requests
   - Consider upgrading your plan

4. **"Coordinates are required"**
   - Make sure location data is properly entered
   - The API requires precise coordinates for accurate calculations

### Testing Without API Key

If you don't have an API key yet, the application will show an error message asking you to configure the API. You can still test the UI and form functionality.

## Cost Considerations

- **Free Tier**: Limited requests, good for testing
- **Paid Plans**: More requests, priority support
- **Enterprise**: Custom solutions for high-volume usage

Check [Prokerala Pricing](https://api.prokerala.com/pricing) for current rates.

## Support

- **Prokerala Documentation**: [https://api.prokerala.com/docs](https://api.prokerala.com/docs)
- **API Status**: Check their status page for service updates
- **Contact**: Use their support channels for API-specific issues

## Next Steps

Once you have the API working:

1. Test with different birth details
2. Explore different chart types
3. Customize the chart display
4. Add more astrological calculations as needed

The integration provides real astronomical calculations, making your astrology application much more accurate and professional! 