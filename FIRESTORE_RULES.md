# Firestore Security Rules

Copy and paste these rules into your Firestore Database → Rules section in Firebase Console.

## Production-Ready Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user document
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if isOwner(userId);
      
      // Allow list queries for token checking
      // This is needed during signup to check token uniqueness
      // Note: During signup, user is authenticated via Firebase Auth before checking token
      allow list: if request.auth != null;
      
      // Users can create their own document during signup
      allow create: if isOwner(userId);
      
      // Users can update their own document
      allow update: if isOwner(userId);
      
      // No one can delete user documents
      allow delete: if false;
    }
    
    // Students collection
    match /students/{studentId} {
      // Students can read their own data
      // Admins can read their assigned students' data
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isAdmin()
      );
      
      // Students can create their own document during signup
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      
      // Students can update their own data
      // Admins can update their assigned students' data
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        (isAdmin() && resource.data.adminId == request.auth.uid)
      );
      
      // No one can delete student documents
      allow delete: if false;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      // Students can read their own tasks
      // Admins can read tasks of their assigned students
      allow read: if isAuthenticated() && (
        resource.data.studentId != null &&
        (
          // Student reading their own tasks
          exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
          get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.userId == request.auth.uid ||
          // Admin reading tasks of their students
          (isAdmin() && 
           exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
           get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.adminId == request.auth.uid)
        )
      );
      
      // Admins can create tasks for their students
      // Students cannot create tasks (only admins assign)
      allow create: if isAuthenticated() && 
        request.resource.data.studentId != null &&
        exists(/databases/$(database)/documents/students/$(request.resource.data.studentId)) &&
        get(/databases/$(database)/documents/students/$(request.resource.data.studentId)).data.adminId == request.auth.uid;
      
      // Students can update their own tasks
      // Admins can update tasks of their assigned students
      allow update: if isAuthenticated() && (
        (resource.data.studentId != null &&
         exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
         get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.userId == request.auth.uid) ||
        (isAdmin() && 
         resource.data.studentId != null &&
         exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
         get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.adminId == request.auth.uid)
      );
      
      // Admins can delete tasks
      allow delete: if isAuthenticated() && 
        resource.data.studentId != null &&
        exists(/databases/$(database)/documents/students/$(resource.data.studentId)) &&
        get(/databases/$(database)/documents/students/$(resource.data.studentId)).data.adminId == request.auth.uid;
    }
    
    // Rewards collection
    match /rewards/{rewardId} {
      // All authenticated users can read rewards
      allow read: if isAuthenticated();
      
      // Only admins can create rewards
      allow create: if isAdmin();
      
      // Only admins can update rewards
      // Students can update to mark as redeemed (but this is handled in AppContext)
      allow update: if isAuthenticated() && (
        isAdmin() ||
        (request.resource.data.redeemed == true && resource.data.redeemed == false)
      );
      
      // Only admins can delete rewards
      allow delete: if isAdmin();
    }
  }
}
```

## Simplified Rules (If the above is too complex)

If you're getting errors with the above rules, use this simplified version for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for authenticated users (FOR TESTING ONLY)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING:** The simplified rules are for development/testing only. Use the production rules above for your live application.

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Paste the production rules above
5. Click **Publish**

## Required Firestore Indexes

After applying the rules, you may need to create these indexes:

1. **For token queries:**
   - Collection: `users`
   - Fields: `token` (Ascending)
   - Query scope: Collection

2. **For admin-student queries:**
   - Collection: `students`
   - Fields: `adminId` (Ascending)
   - Query scope: Collection

Firebase will usually prompt you to create indexes when needed, with a direct link in the error message.

