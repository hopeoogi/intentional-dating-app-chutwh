
# 🚀 Intentional Dating App - Deployment Guide

Your app is **production-ready** and configured for App Store deployment!

## ✅ Pre-Deployment Checklist

- ✅ Backend is live at: `https://erm5magsz6azuge4mtdkxhsmzj7uqr45.app.specular.dev`
- ✅ Authentication configured (Better Auth with email + Google + Apple)
- ✅ All core features implemented:
  - Daily matches with conversation-first approach
  - Limited conversations (3 active max)
  - Manual approval waitlist system
  - Profile setup with badges
  - Chat with anti-ghosting mechanics
- ✅ EAS build configuration ready
- ✅ Bundle identifiers set:
  - iOS: `com.intentional.dating`
  - Android: `com.intentional.dating`
- ✅ Permissions configured for camera, photos, location
- ✅ App icons and splash screens configured

## 📱 Deployment Steps

### 1. Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Your Project
Update `app.json` with your details:
- Replace `"owner": "your-expo-username"` with your Expo username
- Get your project ID by running: `eas project:init`
- Update the `projectId` in `app.json` under `extra.eas.projectId`

Update `eas.json` for iOS submission:
- Replace `"appleId"` with your Apple ID email
- Replace `"ascAppId"` with your App Store Connect app ID
- Replace `"appleTeamId"` with your Apple Developer Team ID

### 4. Build for iOS (Production)
```bash
eas build --platform ios --profile production
```

This will:
- Build your app for the App Store
- Auto-increment the build number
- Create an `.ipa` file ready for submission

### 5. Submit to App Store
```bash
eas submit --platform ios --latest
```

Or manually:
1. Download the `.ipa` from the EAS build page
2. Upload to App Store Connect using Transporter app
3. Complete App Store Connect listing (screenshots, description, etc.)
4. Submit for review

### 6. Build for Android (Production)
```bash
eas build --platform android --profile production
```

### 7. Submit to Google Play
```bash
eas submit --platform android --latest
```

Or manually:
1. Download the `.aab` from the EAS build page
2. Upload to Google Play Console
3. Complete Play Store listing
4. Submit for review

## 🔧 Configuration Notes

### App Store Connect Setup
Before submitting, ensure you have:
1. Created an app in App Store Connect
2. Filled out all required metadata (name, description, keywords)
3. Prepared screenshots for all required device sizes
4. Set up privacy policy URL
5. Configured age rating
6. Set pricing and availability

### Google Play Console Setup
Before submitting, ensure you have:
1. Created an app in Google Play Console
2. Filled out store listing details
3. Prepared screenshots and feature graphic
4. Set up privacy policy URL
5. Completed content rating questionnaire
6. Set pricing and distribution

## 🎨 App Store Assets Needed

### iOS Screenshots Required
- 6.7" iPhone (1290 x 2796) - iPhone 15 Pro Max
- 6.5" iPhone (1242 x 2688) - iPhone 11 Pro Max
- 5.5" iPhone (1242 x 2208) - iPhone 8 Plus
- 12.9" iPad Pro (2048 x 2732)

### Android Screenshots Required
- Phone (1080 x 1920 minimum)
- 7" Tablet (1024 x 1600 minimum)
- 10" Tablet (1536 x 2048 minimum)
- Feature Graphic (1024 x 500)

## 🔐 Environment Variables

The app uses these environment variables (already configured):
- `EXPO_PUBLIC_BACKEND_URL`: Your backend API URL

## 📊 Post-Launch Monitoring

After launch, monitor:
1. Crash reports in EAS dashboard
2. User reviews and ratings
3. Backend API performance and errors
4. Authentication success rates
5. User engagement metrics

## 🔄 Updates

To push updates after launch:

### Over-the-Air (OTA) Updates
```bash
eas update --branch production --message "Bug fixes and improvements"
```

### New Build (for native changes)
```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

## 🆘 Troubleshooting

### Build Fails
- Check that all dependencies are compatible
- Ensure bundle identifiers match in app.json and Apple/Google consoles
- Verify signing credentials are valid

### Submission Rejected
- Review App Store/Play Store guidelines
- Ensure privacy policy is accessible
- Check that all required permissions have usage descriptions
- Verify app doesn't crash on launch

## 📞 Support

- EAS Documentation: https://docs.expo.dev/eas/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Policy: https://play.google.com/about/developer-content-policy/

---

**Your Intentional Dating App is ready to launch! 🎉**

The app features a premium, Raya-inspired design with conversation-first mechanics that reduce ghosting and low-effort interactions. Good luck with your launch!
