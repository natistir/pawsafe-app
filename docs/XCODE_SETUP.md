# Xcode Integration Guide for PawSafe

## Option 1: Expo Development Build (Recommended)

This approach lets you use Xcode Simulator while keeping Expo's benefits.

### Steps:

1. **Install Expo Development Build tools**:
   ```bash
   # Inside your Docker container
   npm install -g @expo/cli
   npx expo install expo-dev-client
   ```

2. **Create iOS Development Build**:
   ```bash
   # Inside Docker container
   npx expo run:ios
   ```

3. **This will**:
   - Generate an iOS project in the `ios/` directory
   - Open Xcode automatically
   - Build and run in iOS Simulator

### Benefits:
- ✅ Keep Expo's hot reload and development tools
- ✅ Use Xcode Simulator for testing
- ✅ Native performance
- ✅ Access to native iOS APIs when needed

---

## Option 2: Full Expo Eject

If you want complete native control:

### Steps:

1. **Eject from Expo**:
   ```bash
   # Inside Docker container
   npx expo eject
   ```

2. **Install iOS dependencies**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Open in Xcode**:
   ```bash
   open ios/PawSafe.xcworkspace
   ```

### What you get:
- Full native iOS project
- Complete Xcode integration
- Ability to add custom native modules
- Full control over build process

---

## Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/natistir/pawsafe-app.git
cd pawsafe-app

# Start Docker environment
docker-compose build
docker-compose up -d
docker-compose exec react-native-dev bash

# Install dependencies
npm install

# Option 1: Development build
npx expo run:ios

# Option 2: Full eject (if needed)
# npx expo eject
# cd ios && pod install && cd ..
# open ios/PawSafe.xcworkspace
```

## Xcode Simulator Features

Once running in Xcode, you can:
- 📱 Test on different iPhone models
- 🏃‍♂️ Test location services with simulated locations
- 🎯 Use Xcode debugger
- 📊 Profile performance
- 🖼️ Test different screen sizes
- 🌍 Simulate different locations for GPS testing

## Troubleshooting

If you encounter issues:

1. **Metro bundler conflicts**:
   ```bash
   npx expo start --clear
   ```

2. **iOS build issues**:
   ```bash
   cd ios
   pod install --repo-update
   ```

3. **Xcode signing issues**:
   - Set your Apple Developer Team in Xcode
   - Update bundle identifier in both `app.json` and Xcode

## Testing Location Features

In Xcode Simulator:
1. **Device > Location > Custom Location**
2. Enter coordinates (e.g., 37.7749, -122.4194 for San Francisco)
3. Test the app's location-based temperature checking

Your PawSafe app will work great in Xcode Simulator for testing the UI and functionality!