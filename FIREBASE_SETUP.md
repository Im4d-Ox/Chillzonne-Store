# Firebase Setup Guide

This application uses Firebase for authentication and real-time database storage. To enable full functionality across all users and devices, you need to set up your own Firebase project.

## Why Firebase?

The current system has a fallback to localStorage, but localStorage is browser-specific. This means:
- Products added by admin in one browser won't be visible to users in other browsers
- User accounts are stored locally and won't sync across devices
- No real-time updates between different users

Firebase solves these issues by providing:
- **Shared database**: All users see the same products
- **Cross-device authentication**: Users can log in from any device
- **Real-time sync**: Changes appear instantly for all users

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "chillzone-store")
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Save changes

### 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose a location (closest to your users)
4. Start in "Test mode" for development
5. Click "Create"

### 4. Get Firebase Configuration

1. In Firebase Console, click the gear icon (Project Settings)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app (name it "ChillZone Web")
5. Copy the firebaseConfig object

### 5. Update firebase-config.js

Replace the contents of `firebase-config.js` with your actual configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 6. Set Up Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to everyone for products
    match /storeData/products {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Current System Behavior

### With Firebase (Recommended)
- **Products**: Stored in Firestore, visible to all users
- **Authentication**: Firebase Auth with email/password
- **Real-time sync**: Changes appear instantly
- **Cross-device**: Works on any device

### Without Firebase (Fallback)
- **Products**: Stored in localStorage (browser-specific)
- **Authentication**: localStorage-based
- **No sync**: Changes only visible in same browser
- **Single device**: Works only on one browser

## Admin Account

The system automatically creates a default admin account:
- **Username**: admin
- **Password**: admin@123123
- **Email**: admin@chillzone.games

You can change this in `init-admin.js` or create new admin accounts through the signup system and manually set `isAdmin: true` in Firebase Firestore.

## Testing

1. Open `admin-login.html` and log in with admin credentials
2. Add products in the admin dashboard
3. Open `products.html` in a different browser or incognito window
4. Products should be visible (if Firebase is configured)
5. Without Firebase, products will only be visible in the same browser

## Troubleshooting

### Products not showing for other users
- Check that Firebase is properly configured
- Verify Firestore rules allow read access
- Check browser console for Firebase errors

### Authentication not working
- Verify Email/Password sign-in is enabled in Firebase Console
- Check that API keys are correct
- Ensure firebase-config.js is loaded before other scripts

### Firebase initialization errors
- Make sure Firebase SDKs are loaded before firebase-config.js
- Check that all required Firebase services are enabled
- Verify your project has the required APIs enabled

## Migration from localStorage to Firebase

The system automatically handles the transition:
1. If Firebase is available, it loads from Firebase first
2. If Firebase fails, it falls back to localStorage
3. When saving, it saves to both Firebase and localStorage
4. This ensures no data is lost during migration

## Security Notes

- The current password hashing (btoa) is not secure for production
- Use Firebase Auth's built-in security for production
- Implement proper password requirements
- Add email verification for new users
- Consider adding 2FA for admin accounts
