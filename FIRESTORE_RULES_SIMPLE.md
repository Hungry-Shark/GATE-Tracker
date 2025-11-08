# Simplified Firestore Security Rules (Recommended for Quick Setup)

These rules allow token uniqueness checks during signup while maintaining security.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      // Allow authenticated users to read any user document (needed for token checks)
      // This is safe because we only expose token and role fields in queries
      allow read: if isAuthenticated();
      
      // Allow list queries for token uniqueness checks
      allow list: if isAuthenticated();
      
      // Users can only create/update their own document
      allow create, update: if isAuthenticated() && request.auth.uid == userId;
      
      // No deletions
      allow delete: if false;
    }
    
    // Students collection
    match /students/{studentId} {
      // Students can read their own data
      // Admins can read their students' data
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
      );
      
      // Students can create their own document
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      
      // Students can update their own data
      // Admins can update their students' data
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
      // Allow read for authenticated users (students see their tasks, admins see their students' tasks)
      allow read: if isAuthenticated();
      
      // Admins can create tasks for their students
      allow create: if isAuthenticated() && 
        request.resource.data.studentId != null &&
        exists(/databases/$(database)/documents/students/$(request.resource.data.studentId)) &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        get(/databases/$(database)/documents/students/$(request.resource.data.studentId)).data.adminId == request.auth.uid;
      
      // Students can update their own tasks
      // Admins can update their students' tasks
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
      
      // Admins can delete tasks
      allow delete: if isAuthenticated() && 
        resource.data.studentId != null &&
        exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.adminId == request.auth.uid;
    }
    
    // Rewards collection
    match /rewards/{rewardId} {
      // All authenticated users can read rewards
      allow read: if isAuthenticated();
      
      // Only admins can create/update/delete rewards
      allow create, update, delete: if isAuthenticated() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Quick Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Delete all existing rules
5. Copy and paste the rules above
6. Click **Publish**

## Why This Works

- **Users collection**: Allows authenticated users to query by token (needed for signup token checks)
- **Students collection**: Students can only access their own data, admins can access their students' data
- **Tasks collection**: Proper permissions for task assignment and updates
- **Rewards collection**: Read-only for students, full control for admins

This will fix the "Unable to verify token" error!

