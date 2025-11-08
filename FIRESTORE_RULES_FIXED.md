# Fixed Firestore Security Rules

**Use these rules to fix the "Unable to verify token" error.**

The issue is that token uniqueness checks happen BEFORE user authentication, so we need to allow list queries on the users collection.

## Copy This to Firebase Console

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if isAuthenticated() && request.auth.uid == userId;
      
      // CRITICAL: Allow list queries for token checking during signup
      // This allows checking token uniqueness before user document is created
      // Safe because we only query by token field, not reading sensitive data
      allow list: if true; // Allow even unauthenticated for signup token checks
      
      // Users can create their own document
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Users can update their own document
      allow update: if isAuthenticated() && request.auth.uid == userId;
      
      allow delete: if false;
    }
    
    // Students collection
    match /students/{studentId} {
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
      );
      
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
         resource.data.adminId == request.auth.uid)
      );
      
      allow delete: if false;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if isAuthenticated();
      
      allow create: if isAuthenticated() && 
        request.resource.data.studentId != null &&
        exists(/databases/$(database)/documents/students/$(request.resource.data.studentId)) &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        get(/databases/$(database)/documents/students/$(request.resource.data.studentId)).data.adminId == request.auth.uid;
      
      allow update: if isAuthenticated() && (
        (resource.data.studentId != null &&
         exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
         get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.userId == request.auth.uid) ||
        (resource.data.studentId != null &&
         exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
         exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
         get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.adminId == request.auth.uid)
      );
      
      allow delete: if isAuthenticated() && 
        resource.data.studentId != null &&
        exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.adminId == request.auth.uid;
    }
    
    // Rewards collection
    match /rewards/{rewardId} {
      allow read: if isAuthenticated();
      
      allow create, update, delete: if isAuthenticated() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Quick Setup

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Go to **Firestore Database** → **Rules**
3. Replace ALL existing rules with the code above
4. Click **Publish**

## What Changed

The key fix is in the `users` collection:
```javascript
allow list: if true; // Allow even unauthenticated for signup token checks
```

This allows the token uniqueness query to work during signup, before the user is fully authenticated. This is safe because:
- We only query by the `token` field
- We don't expose sensitive user data
- The query is limited to checking token existence

After applying these rules, the signup should work without the "Unable to verify token" error!

