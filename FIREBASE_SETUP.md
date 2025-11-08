# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for the GATE Tracker application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Click on **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in production mode** (for production)
4. Select a location for your database (choose the closest to your users)
5. Click **Enable**

### Firestore Security Rules (for production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Students can read/write their own student document
    match /students/{studentId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Tasks can be read/written by the student or their admin
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Rewards can be read by all authenticated users, written by admins
    match /rewards/{rewardId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. If you don't have a web app, click **</>** (Web) icon to add one
5. Register your app with a nickname (e.g., "GATE Tracker")
6. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (or copy from `.env.example`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id-here
```

Replace the values with your actual Firebase configuration values.

## Step 6: Install Dependencies

Make sure Firebase is installed:

```bash
npm install firebase
```

## Step 7: Initialize Default Data

When you first run the app, it will automatically create:
- Default rewards in the `rewards` collection
- Student documents when students sign up
- User documents when users sign up

## Firestore Collections Structure

The app uses the following Firestore collections:

### `users`
- Stores user account information (email, name, role, token, adminId)
- Document ID: Firebase Auth UID

### `students`
- Stores student progress data (XP, level, streaks, badges)
- Document ID: `student_{userId}`
- Fields: `userId`, `adminId`, `name`, `totalXP`, `level`, `currentStreak`, `longestStreak`, `badges`, `lastLogin`

### `tasks`
- Stores tasks assigned to students
- Document ID: Auto-generated
- Fields: `studentId`, `title`, `subject`, `type`, `priority`, `dueDate`, `estimatedTime`, `xpReward`, `status`, `completedAt`

### `rewards`
- Stores available rewards
- Document ID: Auto-generated or `reward1`, `reward2`, `reward3` for defaults
- Fields: `title`, `description`, `xpCost`, `redeemed`

## Troubleshooting

### "Permission denied" errors
- Make sure your Firestore security rules allow the operations you're trying to perform
- For development, you can use test mode (allows all reads/writes for 30 days)

### Token validation not working
- Ensure Firestore indexes are created (Firebase will prompt you if needed)
- Check that the `token` field is indexed in the `users` collection

### Authentication errors
- Verify that Email/Password authentication is enabled in Firebase Console
- Check that your Firebase configuration in `.env.local` is correct

## Next Steps

1. Run `npm run dev` to start the development server
2. Visit the landing page
3. Sign up as an admin to get your unique token
4. Share the token with students so they can sign up

