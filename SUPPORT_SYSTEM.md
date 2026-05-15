# RESET Support & Admin System Documentation

## Overview
The support system enables users (business owners and service providers) to report issues and get help from the support team. Superusers/admins can manage and resolve all support tickets.

## How It Works in the Real World

### 1. **User Reports an Issue**
- User clicks "Contact Support" from any page (Navbar, Portal, etc.)
- Fills out a support ticket form with:
  - Name & Email (auto-filled)
  - Category (Billing, Technical, Quality, Job, General, Other)
  - Subject (brief description)
  - Message (detailed explanation)
- System creates a ticket with:
  - Unique Ticket Number (TKT-001, TKT-002, etc.)
  - Auto-assigned Priority (can be escalated manually)
  - Status: "OPEN"
  - Timestamp of creation

### 2. **Admin Reviews Tickets**
- Superuser logs in to Admin Dashboard (`/portal/admin`)
- Sees all support tickets with:
  - Filters: All, Open, In Progress, Resolved
  - Stats showing count of open, in-progress, resolved tickets
  - Ticket list sorted by priority and creation date

### 3. **Admin Takes Action**
The admin can do several things:

#### **Add Response**
- Read the user's issue description
- Add a response message explaining what will be done
- Status automatically changes to "IN PROGRESS"
- User is notified (in real system, via email)

#### **Investigate & Fix**
Depending on the issue category:

- **Billing Issues**: 
  - Review invoice and charges
  - Adjust billing if needed
  - Issue credit or refund
  - Update payment records

- **Technical Problems**:
  - Reset passwords
  - Fix account access issues
  - Update profile information
  - Resolve system errors

- **Quality Complaints**:
  - Review job photos/records
  - Assign new cleaning team for next service
  - Provide discount or credit
  - Update team ratings

- **Job Assignment Issues**:
  - Manually assign jobs to service providers
  - Send notifications
  - Reschedule if needed

- **General Questions**:
  - Provide information and guidance
  - Answer FAQs

#### **Mark as Resolved**
- Once issue is fixed, click "Mark Resolved"
- Status changes to "RESOLVED"
- Ticket is moved to resolved section
- User receives final response notification
- Issue is closed

### 4. **Real-World Example**

**Scenario: Service Provider Didn't Receive Job Assignment**

1. **Provider Reports Issue** (TKT-002)
   - Category: "Job Related"
   - Subject: "Job assignment issue"
   - Message: "I did not receive the job assignment for March 15th"
   - Status: OPEN, Priority: HIGH

2. **Admin Reviews**
   - Sees the ticket in admin dashboard
   - Checks system to find March 15th job
   - Confirms it wasn't assigned to this provider

3. **Admin Responds**
   - Adds response: "We are investigating this issue. Please check your email for job details."
   - Status changes to IN PROGRESS
   - System sends email to provider with response

4. **Admin Fixes**
   - Manually assigns the job to the provider
   - Updates job records
   - Sends confirmation email

5. **Mark Resolved**
   - Clicks "Mark Resolved" button
   - Status changes to RESOLVED
   - Ticket is closed
   - Provider receives notification

## System Access Levels

### **User Level**
- Can only submit support tickets
- Can see their own ticket status in portal (future feature)
- Receives email notifications

### **Superuser/Admin Level**
- Access to `/portal/admin` dashboard
- Can view all support tickets
- Can add responses and notes
- Can change ticket status
- Can mark issues as resolved
- Can see statistics and analytics

## Ticket Status Flow

```
OPEN
  ↓
IN PROGRESS (when admin responds)
  ↓
RESOLVED (when issue is fixed)
  ↓
CLOSED (automatically after resolved)
```

## Priority Levels

- **URGENT** (Red): Critical issues blocking work, account locked, payment failures
- **HIGH** (Orange): Important issues affecting service, quality complaints, missed jobs
- **MEDIUM** (Yellow): Billing questions, minor bugs, clarifications needed
- **LOW** (Blue): General questions, feature requests, feedback

## Best Practices for Support Team

1. **Quick Response**: Respond to HIGH and URGENT tickets within 1-2 hours
2. **Clear Communication**: Explain what happened and what you're doing
3. **Follow Up**: Don't leave tickets in IN PROGRESS for too long
4. **Document Everything**: Keep detailed notes of what was done
5. **Prevent Recurrence**: Look for patterns and fix root causes
6. **Escalate if Needed**: For serious issues, involve management

## Real-World Common Issues & Fixes

| Issue Type | Action |
|-----------|--------|
| Billing Dispute | Review invoice, adjust if needed, issue credit |
| Login Problem | Reset password, verify email, send temporary credentials |
| Quality Complaint | Assign new team, offer discount, schedule re-clean |
| Job Not Assigned | Manually assign in system, send notification |
| Payment Failed | Check payment method, retry, contact user |
| Profile Error | Update information, clear cache, re-login |
| Rating Error | Review job details, verify rating, correct if needed |

## Future Enhancements

1. **Automated Responses**: Pre-written templates for common issues
2. **Ticket History**: Users can see their past tickets
3. **Email Notifications**: Auto-email when status changes
4. **Knowledge Base**: FAQ and self-service solutions
5. **Escalation Rules**: Auto-escalate old tickets
6. **Performance Metrics**: Track response time and resolution rate
7. **Customer Satisfaction Survey**: Rate support quality
