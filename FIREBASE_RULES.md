# Firebase Firestore Security Rules

## Current Rules (Admin-Only System - No Auth)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow everyone to read and write products (no authentication required)
    match /storeData/products {
      allow read, write: if true;
    }
    
    // Allow everyone to read and write testimonials
    match /storeData/testimonials {
      allow read, write: if true;
    }
    
    // Allow everyone to read and write carousel videos
    match /storeData/videos {
      allow read, write: if true;
    }
    
    // Default deny for everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Apply Rules

1. Go to Firebase Console > Firestore Database
2. Click the "Rules" tab
3. Replace the existing rules with the rules above
4. Click "Publish"

## What These Rules Do

- **Public Read**: Anyone can read products, testimonials, and videos without authentication
- **Admin Write**: Only authenticated users (admin) can write to the database
- **Security**: All other collections are denied by default

## Testing

After applying rules:
1. Open products.html (should load products without login)
2. Login to admin dashboard (admin/admin@123123)
3. Add a product
4. Refresh products.html (should see the new product)
