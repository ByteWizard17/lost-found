# 🧪 Testing & Verification Guide

## ✅ What to Test

### 1. Admin Role Assignment
- [ ] Register a new user
- [ ] In MongoDB, update role to "admin"
- [ ] Verify user data stored correctly
- [ ] Check JWT contains role

### 2. Admin Login & Authentication
- [ ] Login as admin user
- [ ] Verify "👑 Admin" link appears in navbar
- [ ] Verify non-admin doesn't see "👑 Admin" link
- [ ] Verify role stored in localStorage
- [ ] Try accessing `/admin` as non-admin → should redirect

### 3. Admin Dashboard Access
- [ ] Click "👑 Admin" link → should go to `/admin`
- [ ] Direct URL access to `/admin` → should work for admins
- [ ] Dashboard loads without errors
- [ ] Statistics show correct numbers

### 4. Dashboard Tab
- [ ] View statistics (total items, users, etc.)
- [ ] Verify numbers match database
- [ ] See recent pending items preview

### 5. Pending Tab
- [ ] See items awaiting approval
- [ ] Click item to expand
- [ ] View full item details
- [ ] Try ✅ Approve → item status changes to "approved"
- [ ] Try ❌ Reject → item status changes to "rejected"
- [ ] Verify poster receives notification

### 6. All Posts Tab
- [ ] View all posts regardless of status
- [ ] See status badges (approved/pending/rejected)
- [ ] Delete a post → item removed from database
- [ ] Verify poster notified of deletion

### 7. Users Tab
- [ ] View all users in system
- [ ] See each user's info (name, email, role, joined date)
- [ ] Click 🚫 Block → user marked as blocked
- [ ] Verify isBlocked flag in database
- [ ] Click 🔓 Unblock → user re-enabled
- [ ] Click 🗑️ Delete → user deleted and their posts deleted

### 8. Reports Tab (Optional - Bonus Feature)
- [ ] Check Reports tab (should be empty initially)
- [ ] As regular user, report a post (if you added report UI)
- [ ] Go back to Reports tab as admin
- [ ] See the report
- [ ] Try "Delete Post" → post deleted, poster notified
- [ ] Try "Dismiss Report" → report marked resolved

### 9. API Endpoints (Manual Testing with Postman/Curl)

#### Test Admin Item Endpoints
```bash
# Get all items (with admin auth)
GET /api/items/admin/all
Headers: Authorization: Bearer {ADMIN_TOKEN}

# Get pending items
GET /api/items/admin/pending
Headers: Authorization: Bearer {ADMIN_TOKEN}

# Approve an item
PATCH /api/items/admin/{itemId}/approve
Headers: Authorization: Bearer {ADMIN_TOKEN}

# Delete an item
DELETE /api/items/admin/{itemId}
Headers: Authorization: Bearer {ADMIN_TOKEN}
Body: { "reason": "Spam content" }
```

#### Test Admin User Endpoints
```bash
# Get all users
GET /api/users/admin/all
Headers: Authorization: Bearer {ADMIN_TOKEN}

# Block user
POST /api/users/admin/{userId}/block
Headers: Authorization: Bearer {ADMIN_TOKEN}
Body: { "reason": "Violating community guidelines" }

# Delete user
DELETE /api/users/admin/{userId}
Headers: Authorization: Bearer {ADMIN_TOKEN}
```

#### Test Report Endpoints
```bash
# Create report (as regular user)
POST /api/reports
Headers: Authorization: Bearer {USER_TOKEN}
Body: { 
  "itemId": "{itemId}", 
  "reason": "spam",
  "description": "This is clearly spam"
}

# Get reports (as admin)
GET /api/reports
Headers: Authorization: Bearer {ADMIN_TOKEN}

# Resolve report
PATCH /api/reports/{reportId}/resolve
Headers: Authorization: Bearer {ADMIN_TOKEN}
Body: { 
  "action": "deleted",
  "deleteReason": "Violates community standards"
}
```

---

## 🔍 Verification Checklist

### Backend
- [ ] Admin middleware works (rejects non-admin requests)
- [ ] Role included in JWT token
- [ ] Login returns role in response
- [ ] All admin endpoints return 403 for non-admins
- [ ] Database saves all changes correctly
- [ ] Notifications sent when posts deleted/rejected

### Frontend
- [ ] AuthContext stores role correctly
- [ ] isAdmin computed property works
- [ ] Admin link shows/hides based on role
- [ ] ProtectedRoute blocks non-admin access
- [ ] Admin Dashboard loads all data
- [ ] All 5 tabs work
- [ ] Actions (approve, reject, delete, block) work
- [ ] UI updates after actions

### Database
- [ ] User model has role field
- [ ] User model has isBlocked, blockedReason, blockedAt fields
- [ ] Report collection created
- [ ] Deleted items removed from Items collection
- [ ] Deleted users removed from Users collection
- [ ] Reports show correct status

---

## 🚀 Full E2E Test Scenario

### Test 1: Complete Admin Workflow
1. Register as User1
2. Register as User2
3. User1 posts a "Lost" item
4. Make User2 an admin
5. Login as User2
6. Go to Admin → Pending tab
7. Approve User1's item
8. Go to All Posts tab
9. Verify item is now approved
10. Create fake admin account
11. Go to Users tab
12. Block the fake account
13. Go back to Dashboard
14. Verify stats updated

### Test 2: Report & Moderation
1. Login as regular user
2. Post an item (user A)
3. Login as different user (user B)
4. Report the item (if report UI exists)
5. Login as admin
6. Go to Reports tab
7. See user B's report
8. Delete the post
9. Check user A was notified
10. Verify post deleted from All Posts

### Test 3: User Management
1. Create test user
2. Login as admin
3. Go to Users tab
4. Find test user
5. Block the user
6. Try logging in as test user → should be allowed (backend check needed)
7. Unblock user
8. Delete user
9. Verify user and their posts deleted

### Test 4: Responsive Design
1. View dashboard on desktop → should look good
2. Resize to tablet size → should adapt
3. Resize to mobile size → should stack vertically
4. Test all buttons clickable on mobile

---

## 🐛 Troubleshooting

### Issue: "👑 Admin" link doesn't appear
- [ ] Check role saved in localStorage
- [ ] Check AuthContext isAdmin computed property
- [ ] Verify user role is "admin" in database
- [ ] Clear browser cache and reload

### Issue: Can't access `/admin`
- [ ] Verify user is logged in
- [ ] Check role is "admin"
- [ ] Check ProtectedRoute adminOnly prop works
- [ ] Check console for errors

### Issue: Admin actions don't work
- [ ] Check API token is sent in headers
- [ ] Check adminMiddleware is protecting routes
- [ ] Check console for error messages
- [ ] Verify adminService.js has correct API URLs
- [ ] Check Backend Netlify/render logs

### Issue: Stats don't update
- [ ] Check getAdminStats endpoint
- [ ] Verify data counting logic
- [ ] Check database has correct data
- [ ] Try refreshing page

### Issue: Notifications not sent
- [ ] Check emailService configuration
- [ ] Verify SMTP settings in .env
- [ ] Check user has valid email
- [ ] Check backend logs for email errors

---

## 📋 Manual Test Cases

### Test Case 1: Create Admin
**Steps:**
1. Register user with email "admin@test.com"
2. Update in MongoDB: `db.users.updateOne({email: "admin@test.com"}, {$set: {role: "admin"}})`
3. Logout and login again
**Expected:** "👑 Admin" link appears

### Test Case 2: Approve Item
**Steps:**
1. Login as admin
2. Click ⏳ Pending tab
3. Expand first item
4. Click ✅ Approve
**Expected:** Item status becomes "approved" and poster notified

### Test Case 3: Delete Spam Post
**Steps:**
1. Login as admin
2. Click 📋 All Posts tab
3. Click Delete on any post
4. Confirm deletion
**Expected:** Post removed, poster notified

### Test Case 4: Block User
**Steps:**
1. Login as admin
2. Click 👥 Users tab
3. Find user
4. Click 🚫 Block
5. Enter reason
6. Click Confirm
**Expected:** User marked as blocked with reason shown

---

## ✨ Sign-Off Checklist

- [ ] All 5 dashboard tabs working
- [ ] Admin authentication working
- [ ] Post management working
- [ ] User management working
- [ ] Report system working (if implemented)
- [ ] Responsive design verified
- [ ] No console errors
- [ ] All buttons clickable
- [ ] Database updates working
- [ ] Notifications sending
- [ ] Admin can't be locked out
- [ ] Security tests passed

---

## 🎉 Ready for Production?

Once all checks pass:
1. ✅ Deploy backend with new routes
2. ✅ Deploy frontend with admin dashboard
3. ✅ Create initial admin user
4. ✅ Test on production
5. ✅ Monitor admin actions
6. ✅ Setup email notifications
7. ✅ Document for support team

---

Good luck with testing! 🚀
