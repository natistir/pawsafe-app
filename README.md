# 🐕 PawSafe - Dog Walking Surface Temperature Safety App

A React Native mobile app that helps dog owners check surface temperature to ensure safe paw walking conditions. Built with Expo and Docker for cross-platform development.

## 🌟 Features

- **Real-time Temperature Checking**: Get current surface temperature at any location
- **GPS & Zip Code Support**: Use current location or search by zip code
- **Paw Safety Assessment**: Color-coded risk levels (Safe/Caution/Dangerous)
- **Weather Integration**: Comprehensive weather data including UV index and humidity
- **Smart Recommendations**: Personalized advice for safe dog walking
- **Cross-platform**: Works on both iOS and Android

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Xcode (for iOS development)
- Expo Go app on your phone

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/natistir/pawsafe-app.git
   cd pawsafe-app
   ```

2. **Build and start the Docker environment**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. **Access the development container**
   ```bash
   docker-compose exec react-native-dev bash
   ```

4. **Install dependencies and start the app**
   ```bash
   npm install
   npm start
   ```

5. **Test on your device**
   - Download "Expo Go" from the App Store
   - Scan the QR code displayed in the terminal
   - The app will open on your phone

## 🏗️ Architecture

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens (Home, Location, Settings)
├── services/       # API services (Weather, Location)
├── utils/          # Utility functions (Temperature calculations)
├── types/          # TypeScript type definitions
└── config/         # App configuration
```

## 🌡️ Temperature Safety Guide

| Risk Level | Temperature Range | Action |
|------------|------------------|--------|
| 🟢 **Safe** | Below 43°C (109°F) | Safe for walking |
| 🟡 **Caution** | 43-49°C (109-120°F) | Limit exposure, use booties |
| 🔴 **Dangerous** | Above 49°C (120°F) | Avoid walking, find shade |

## 🛠️ Development Commands

```bash
# Start development server
docker-compose up -d && docker-compose exec react-native-dev npm start

# View logs
docker-compose logs -f react-native-dev

# Stop development server
docker-compose down

# Rebuild container (after dependency changes)
docker-compose build --no-cache
```

## 📱 Building for Production

### iOS Build
```bash
# Inside the container
npm run build:ios
```

### Android Build
```bash
# Inside the container
npm run build:android
```

## 🔧 Configuration

1. **Get a Weather API Key**
   - Sign up at [WeatherAPI.com](https://weatherapi.com)
   - Add your API key to `src/config/env.ts`

2. **Update App Configuration**
   - Modify `app.json` for app name, icons, and bundle identifiers
   - Update `package.json` with your app details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Weather data provided by [WeatherAPI.com](https://weatherapi.com)
- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
- UI components by [React Native Paper](https://reactnativepaper.com)

## 📞 Support

If you have any questions or need help getting started, please open an issue or reach out!

---

**Keep those paws safe! 🐾**