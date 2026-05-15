# Superuser Access & Admin Portal Guide

## 🔐 How Superusers Access the Admin Portal

### Step 1: Navigate to Superuser Login
Go to: `http://localhost:3000/portal/superuser-login`

Or click the link from the home page navigation.

### Step 2: Enter Credentials
Use the superuser credentials to login:

```
Email:    admin@reset.com.au
Password: Reset@Admin123!
```

### Step 3: System Verifies Access
- System checks if user email exists in superuser database
- Verifies password is correct
- Checks if user has `isSuperuser: true` flag
- If authorized → redirected to `/portal/admin`
- If not authorized → shows error message and returns to login

### Step 4: Access Admin Dashboard
Once logged in, you can:
- View all support tickets
- Filter tickets by status
- Add responses to issues
- Mark tickets as resolved
- See real-time statistics

## 🔑 Superuser Roles

### **SUPERUSER** (Full Admin Access)
- Email: `admin@reset.com.au`
- Password: `Reset@Admin123!`
- Access: All admin functions
- Permissions:
  - View all tickets
  - Respond to issues
  - Resolve tickets
  - Add new superusers
  - Create client/subcontractor accounts

### **ADMIN** (Support Staff)
- Similar permissions but may have limited features
- Can respond to and resolve tickets
- Cannot create other superusers

### **USER** (Regular Accounts)
- Business Owners: `/portal/client`
- Service Providers: `/portal/subcontractor`
- Can submit support tickets but cannot access admin

## 📊 Admin Dashboard Features

### **Dashboard Overview**
```
┌─────────────────────────────────────────────────┐
│         ADMIN DASHBOARD                         │
│  Logged in: Admin Manager (admin@reset.com.au)  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Open: 2]  [In Progress: 1]  [Resolved: 1]    │
│  [Total: 4]                                    │
│                                                 │
├─────────────────────────────────────────────────┤
│ TICKETS              │  DETAILS                  │
│                      │                           │
│ TKT-001 [MEDIUM]    │  Ticket Number: TKT-001   │
│ TKT-002 [HIGH]      │  Status: OPEN             │
│ TKT-003 [URGENT]    │  Priority: MEDIUM         │
│ TKT-004 [LOW]       │  User: Sarah Johnson      │
│                      │  Email: admin@...         │
│                      │  Subject: Extra charge... │
│                      │                           │
│                      │  [Add Response]           │
│                      │  [Mark Resolved]          │
│                      │  [Logout]                 │
└─────────────────────────────────────────────────┘
```

### **Key Functions**

#### 1. **View Tickets**
- Left panel shows all tickets
- Color-coded by priority (Red=Urgent, Orange=High, etc.)
- Shows ticket number, priority, status, user type
- Click to view full details

#### 2. **Filter Tickets**
- All: Show all tickets
- Open: Only new tickets requiring attention
- In Progress: Tickets being worked on
- Resolved: Completed issues

#### 3. **Respond to Issues**
- Click "Add Response" button
- Type your response
- Send - Status automatically changes to "IN PROGRESS"
- User receives notification via email

#### 4. **Resolve Tickets**
- Click "Mark Resolved" button
- Status changes to "RESOLVED"
- Ticket appears in resolved section
- User receives final notification

## 🔄 Complete Workflow for Superuser

### **Example: Handling a Billing Issue**

```
1. USER REPORTS ISSUE
   └─ Creates ticket TKT-001
      Category: Billing
      Subject: "Extra charge on invoice"
      Message: "I see a $50 charge I don't recognize"

2. SUPERUSER SEES NOTIFICATION
   └─ Logs into admin dashboard
      Sees TKT-001 marked as OPEN (MEDIUM priority)

3. SUPERUSER INVESTIGATES
   └─ Reviews user's invoice in accounting system
      Finds error: Job was billed twice
      Decision: Issue $50 refund

4. SUPERUSER RESPONDS
   └─ Clicks "Add Response"
      Types: "We found the issue - you were billed twice. 
              We're issuing a $50 refund to your account."
      Clicks "Send"
      Status → "IN PROGRESS"
      User gets email: "Your issue is being addressed"

5. SUPERUSER FIXES
   └─ Issues refund in accounting system
      Updates payment records
      Confirms in user's account

6. SUPERUSER RESOLVES
   └─ Clicks "Mark Resolved"
      Status → "RESOLVED"
      User gets email: "Your issue has been resolved"

7. TICKET COMPLETE
   └─ Appears in "Resolved" section
      User can see resolution in their account
```

## 🔒 Security Features

### **Access Control**
- Only users with `isSuperuser: true` can access admin
- Session stored in localStorage (browser)
- Automatic logout on browser close (future enhancement)
- Redirect to login if session expires

### **Audit Trail** (Future Enhancement)
- Log all admin actions (who did what, when)
- Track all responses and resolutions
- Monitor access attempts

### **Role Segregation**
Different access levels for different roles:
```
┌──────────────┬────────────┬───────────┬──────────┐
│ Action       │ User       │ Admin     │ Superuser│
├──────────────┼────────────┼───────────┼──────────┤
│ Submit Ticket│ ✓          │ ✓         │ ✓        │
│ View Own     │ ✓          │ ✓         │ ✓        │
│ View All     │ ✗          │ ✓         │ ✓        │
│ Add Response │ ✗          │ ✓         │ ✓        │
│ Resolve      │ ✗          │ ✓         │ ✓        │
│ Manage Users │ ✗          │ ✗         │ ✓        │
└──────────────┴────────────┴───────────┴──────────┘
```

## 🌐 Authentication in Different Environments

### **Development** (Current)
```javascript
// Demo credentials stored in lib/auth.ts
const SUPERUSER_CREDENTIALS = {
  email: 'admin@reset.com.au',
  password: 'Reset@Admin123!',
};
```

### **Production** (Recommended)
Replace with backend authentication:

```typescript
// 1. Use JWT tokens
const loginSuperuser = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const { token, user } = await response.json();
  localStorage.setItem('authToken', token);
  // Token verified with backend on each request
};

// 2. Or use OAuth (Google, Microsoft, etc.)
// 3. Or use session-based auth (secure cookies)
```

### **Security Checklist for Production**

- [ ] Hash passwords using bcrypt or similar
- [ ] Use HTTPS for all authentication
- [ ] Implement rate limiting (prevent brute force)
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Use secure HTTP-only cookies for sessions
- [ ] Implement password reset functionality
- [ ] Add login attempt logging
- [ ] Use JWT with expiration times
- [ ] Implement refresh token rotation
- [ ] Add IP whitelisting for admin access
- [ ] Monitor for suspicious activities

## 📝 Managing Superusers

### **Add New Superuser** (Future Feature)
```typescript
// In admin panel, add new superuser
addSuperuser({
  id: 'super-3',
  name: 'Support Manager',
  email: 'support@reset.com.au',
  role: 'admin',
  isSuperuser: true
});
```

### **Remove Superuser** (Future Feature)
```typescript
// Only other superusers can remove
removeSuperuser('super-2');
```

### **Update Superuser Info** (Future Feature)
```typescript
// Change name, email, role
updateSuperuser('super-1', {
  name: 'Senior Admin Manager'
});
```

## 🆘 Troubleshooting

### **"Invalid credentials" Error**
- Check email spelling: `admin@reset.com.au`
- Check password: `Reset@Admin123!`
- Verify caps lock is off
- Clear browser cache and try again

### **Redirected to Login Page**
- Your session expired
- You don't have superuser permissions
- Contact your manager to enable superuser access

### **Cannot See Specific Ticket**
- Ticket might be private (for specific user only)
- Check your access level permissions
- Ticket might have been deleted

### **Response Not Sending**
- Check internet connection
- Fill all required fields
- Check browser console for errors
- Try refreshing the page

## 📞 Admin Support Contacts

For issues with the admin portal:
- **Tech Support**: tech@reset.com.au
- **Access Issues**: admin-support@reset.com.au
- **Report Bug**: bugs@reset.com.au

---

## Quick Links

- 🏠 [Home](http://localhost:3000)
- 🔐 [Superuser Login](http://localhost:3000/portal/superuser-login)
- 📊 [Admin Dashboard](http://localhost:3000/portal/admin)
- 📖 [Support System Guide](./SUPPORT_SYSTEM.md)
