# Authentication Flow

12 Test Gig uses Firebase Authentication. 

## Flow
1. **Registration**: Validates input -> Creates Firebase User -> Stores Profile in Firestore `users` collection -> Assigns Role -> Redirects.
2. **Login**: Verifies credentials -> Fetches User Profile -> Redirects based on Role.
3. **Roles**: `customer`, `tester`, `earner`, `admin`, `super_admin`.

Admin roles cannot be selected during public registration.
