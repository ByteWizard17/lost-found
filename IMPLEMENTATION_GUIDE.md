# Lost & Found - Complete Feature Implementation Guide

## ✅ BACKEND - COMPLETED

### Changes Made:

#### 1. **Updated Models**
- `User.js` - Added profile fields (phone, city, bio, profileImage, role, createdAt)
- `Item.js` - Added status, claims, reports, and userId fields
- `Notification.js` - New model for notifications

#### 2. **Created Controllers**
- `itemController.js` - Expanded with 15+ new functions:
  - Claims: `claimItem`, `approveClaim`, `rejectClaim`
  - Search/Filter: `searchItems`
  - Admin: `approveItem`, `rejectItem`, `getPendingItems`, `getAdminStats`
  - Reporting: `reportItem`
  
- `userController.js` - Complete user profile management:
  - `getUserProfile`, `updateProfile`
  - `getMyItems`, `getMyClaimsOnItems`, `getReceivedClaims`

- `notificationController.js` - New notification management:
  - `getNotifications`, `markAsRead`, `getUnreadCount`
  - Real-time Socket.io integration

- `emailService.js` - Email notifications via Nodemailer

#### 3. **Created/Updated Routes**
- `itemRoutes.js` - 10+ new endpoints
- `userRoutes.js` - New routes for profile & claims
- `notificationRoutes.js` - New routes for notifications

#### 4. **Set Up Services**
- Socket.io server for real-time notifications
- Email service with Gmail SMTP
- Import proper dependencies

---

## 🔧 FRONTEND - NEXT STEPS

### Step 1: Install Client Dependencies
```bash
cd client
npm install socket.io-client
npm start
```

### Step 2: Create API Service Functions

Create/update `src/services/itemService.js`:
```javascript
export const searchItems = async (keyword, category, dateFrom, dateTo, type) => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (category) params.append('category', category);
  if (type) params.append('type', type);
  
  const response = await api.get(`/items/search?${params.toString()}`);
  return response.data;
};

export const claimItem = async (itemId, message) => {
  return api.post(`/items/${itemId}/claim`, { message });
};

export const approveClaim = async (itemId, claimIndex) => {
  return api.patch(`/items/${itemId}/claim/${claimIndex}/approve`);
};
```

Create `src/services/userService.js`:
```javascript
export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  return api.put('/users/profile/update', profileData);
};

export const getMyItems = async () => {
  return api.get('/users/items/my-items');
};

export const getReceivedClaims = async () => {
  return api.get('/users/claims/received');
};
```

Create `src/services/notificationService.js`:
```javascript
export const getNotifications = async () => {
  return api.get('/notifications');
};

export const getUnreadCount = async () => {
  return api.get('/notifications/unread-count');
};

export const markAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};
```

### Step 3: Create Components

**1. SearchAndFilter Component** (`src/components/SearchAndFilter.jsx`)
- Input for keyword search
- Dropdown for category filter
- Date range picker
- Type filter (lost/found)

**2. UserProfile Page** (`src/pages/UserProfile.jsx`)
- Display user info (name, phone, city, bio)
- Edit profile button
- Show user's posted items
- Show claims received on their items
- Option to approve/reject claims

**3. MyItems Page** (`src/pages/MyItems.jsx`)
- List all items posted by user
- Status badge (pending/approved/rejected)
- View claims on each item
- Accept/reject claims

**4. MyClaims Page** (`src/pages/MyClaims.jsx`)
- Show items user has claimed
- Claim status (pending/accepted/rejected)
- Contact info of item owners

**5. AdminDashboard Page** (`src/pages/AdminDashboard.jsx`)
- Pending items to approve
- Statistics (total items, users, claims, etc.)
- Charts (Chart.js recommended)
- Approve/reject/report management

**6. NotificationCenter Component** (`src/components/NotificationCenter.jsx`)
- Show real-time notifications
- Mark as read
- Notification badge with unread count

### Step 4: Update Existing Components

**DashBoard.jsx**
- Add search/filter bar
- Show more item details (owner info, contact)
- Add "Claim Item" button

**App.jsx**
- Add Socket.io connection on app mount
- Set up notification listener

### Step 5: Gmail Configuration

To enable email notifications:

1. **Enable Gmail App Password:**
   - Go to myaccount.google.com
   - Enable 2-Factor Authentication
   - Create App Password for "Mail"
   - Copy the 16-character password

2. **Update .env in server:**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. **Update .env.example:**
   ```
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

---

## 📋 API ENDPOINTS REFERENCE

### Items
- `POST /api/items` - Create item (auth required)
- `GET /api/items` - Get all approved items
- `GET /api/items/search?keyword=&category=&type=` - Search items
- `POST /api/items/:itemId/claim` - Claim item
- `PATCH /api/items/:itemId/claim/:claimIndex/approve` - Approve claim
- `PATCH /api/items/:itemId/claim/:claimIndex/reject` - Reject claim
- `POST /api/items/:itemId/report` - Report item

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile/update` - Update profile (auth required)
- `GET /api/users/items/my-items` - Get my items (auth required)
- `GET /api/users/claims/received` - Get claims on my items (auth required)
- `GET /api/users/claims/my-claims` - Get my claims (auth required)

### Notifications
- `GET /api/notifications` - Get notifications (auth required)
- `GET /api/notifications/unread-count` - Get unread count (auth required)
- `PATCH /api/notifications/:notificationId/read` - Mark as read (auth required)

### Admin
- `GET /api/items/admin/pending` - Get pending items (admin only)
- `PATCH /api/items/admin/:itemId/approve` - Approve item (admin only)
- `PATCH /api/items/admin/:itemId/reject` - Reject item (admin only)
- `GET /api/items/admin/stats` - Get statistics (admin only)

---

## 🚀 Deployment Steps

### Server (Render)
```bash
cd server
npm install
git add .
git commit -m "Add complete feature set: claims, notifications, profile, admin dashboard"
git push
```

### Client (Vercel)
```bash
cd client
npm install socket.io-client
git add .
git commit -m "Add frontend for all new features"
git push
```

---

## 📝 TODO for Frontend Implementation

1. [ ] Create SearchAndFilter component
2. [ ] Create UserProfile page
3. [ ] Create MyItems page
4. [ ] Create MyClaims page
5. [ ] Create AdminDashboard page
6. [ ] Create NotificationCenter component
7. [ ] Update DashBoard with new details
8. [ ] Set up Socket.io in App.jsx
9. [ ] Update routes in AppRoutes.jsx
10. [ ] Test all email notifications
11. [ ] Test real-time notifications
12. [ ] Deploy both frontend & backend

---

## ⚙️ Installation - Step by Step

### Backend:
```bash
cd server
npm install
npm start
```

### Frontend:
```bash
cd client
npm install
npm start
```

---

## 🧪 Testing Checklist

- [ ] Create a post and verify it's pending admin approval
- [ ] Admin approve post and check email notification
- [ ] Other user claims item
- [ ] Item owner receives notification of claim
- [ ] Owner approves claim
- [ ] Claimer receives email confirmation
- [ ] Search/filter items by category, date, keyword
- [ ] View user profile with their posted items
- [ ] Check real-time notifications are working
- [ ] Verify Socket.io connection is active
- [ ] Check admin dashboard statistics

---

## 💡 Notes

- All items start as "pending" and need admin approval before showing
- Email service requires Gmail App Password (not regular password)
- Socket.io enables real-time notifications without page refresh
- Make sure MongoDB has enough space for new collections
- Test email configuration before deploying to production

Feel free to ask for help with any frontend component implementation!
