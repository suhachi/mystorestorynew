# T14-06~T14-10 Testing Guide

## Quick Start

### Access the Pages

1. **Customer Checkout Page**
   - Route: `customer-checkout`
   - Navigate via: `navigate('customer-checkout')`
   - URL param: `?page=customer-checkout`

2. **Order Tracking Page**
   - Route: `customer-order-track`
   - Navigate via: `navigate('customer-order-track', { orderId: 'ORD-123' })`
   - URL param: `?page=customer-order-track&orderId=ORD-123`

3. **Notification Preferences**
   - Route: `customer-notification-prefs`
   - Navigate via: `navigate('customer-notification-prefs')`
   - URL param: `?page=customer-notification-prefs`

4. **Owner Order Management**
   - Route: `owner-orders-manage`
   - Navigate via: `navigate('owner-orders-manage')`
   - URL param: `?page=owner-orders-manage`
   - **Requires:** Owner or Staff role

5. **Notification Operations Panel**
   - Route: `owner-notify-ops`
   - Navigate via: `navigate('owner-notify-ops')`
   - URL param: `?page=owner-notify-ops`
   - **Requires:** Owner role

## Mock Authentication

### Login as Different Roles

The app uses mock authentication. To test role-based access:

```javascript
// Open browser console and run:

// Login as Owner
const { useAuth } = await import('./hooks/useAuth');
const auth = useAuth();
auth.login('owner', 'store_demo_001');

// Login as Staff
auth.login('staff', 'store_demo_001');

// Login as Customer
auth.login('customer');

// Login as Admin
auth.login('admin');

// Logout
auth.logout();
```

Or add this to the app for quick role switching:

```tsx
import { useAuth } from './hooks/useAuth';

function RoleSwitch() {
  const { login, logout, user } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <p className="font-medium mb-2">
        Current: {user?.role || 'None'}
      </p>
      <div className="flex gap-2">
        <button onClick={() => login('customer')}>Customer</button>
        <button onClick={() => login('staff', 'store1')}>Staff</button>
        <button onClick={() => login('owner', 'store1')}>Owner</button>
        <button onClick={() => login('admin')}>Admin</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
```

## Test Scenarios

### T14-06: Checkout

**Test Case 1: Successful Order**
1. Navigate to checkout page
2. Fill in customer info:
   - Name: "홍길동"
   - Phone: "010-1234-5678"
   - Email: "test@example.com" (optional)
3. Add delivery address (optional)
4. Add special requests (optional)
5. Click "주문하기"
6. Verify success message
7. Verify redirect to tracking page

**Test Case 2: Empty Cart**
- Modify `cartItems` to empty array
- Verify error message: "장바구니가 비어있습니다"

**Test Case 3: Invalid Phone**
- Enter phone: "123"
- Click submit
- Verify error: "유효한 전화번호를 입력해주세요"

**Test Case 4: Offline Mode**
- Open DevTools > Network > Set "Offline"
- Try to submit order
- Verify retry queue message
- Go back online
- Verify order processed

### T14-07: Order Tracking

**Test Case 1: View Order**
1. Navigate to tracking page with orderId
2. Verify order details display
3. Verify masked customer info (김*수, 010-***-5678)
4. Verify totals calculated from items
5. Verify timeline shows history

**Test Case 2: Real-time Updates**
- Open tracking page
- Simulate status change (in production, another user changes status)
- Verify live region announces change to screen readers
- Verify UI updates without refresh

**Test Case 3: Offline Mode**
1. Load tracking page
2. Go offline
3. Verify offline indicator shows
4. Verify last snapshot remains visible
5. Go online
6. Verify reconnection and updates resume

**Test Case 4: 404 Order**
- Navigate with invalid orderId
- Verify error message
- Verify "Go Back" button works

### T14-08: Order Management

**Test Case 1: Access Control**
1. Logout (or login as customer)
2. Try to access owner-orders-manage
3. Verify "Access Denied" message
4. Login as owner
5. Verify page loads

**Test Case 2: View Orders**
1. Login as owner/staff
2. Navigate to orders management
3. Verify order list sorted by newest
4. Click an order
5. Verify details display

**Test Case 3: Status Transitions**
1. Select order with status NEW
2. Verify available actions: CONFIRMED, CANCELLED
3. Click CONFIRMED
4. Verify status updates
5. Verify timeline adds entry
6. Verify new available actions: PREPARING, CANCELLED

**Test Case 4: Invalid Transitions**
1. Select order with status FULFILLED
2. Verify no action buttons
3. Verify message: "더 이상 수정할 수 없습니다"

**Test Case 5: Warning Messages**
1. Change order status
2. If random warning triggers (20% chance in mock)
3. Verify warning displays
4. Verify order still updated

### T14-09: Cloud Functions Integration

**Test Case 1: Idempotency**
- Call setOrderStatusApi twice with same mutationId
- Verify second call is ignored (in production)
- Verify no duplicate history entries

**Test Case 2: Error Handling**
- Simulate network error
- Verify error message displays
- Verify order state unchanged

**Test Case 3: Graceful Degradation**
- Simulate notification failure
- Verify warning message
- Verify order status still changed

### T14-10: Notifications

**Test Case 1: Update Preferences**
1. Navigate to notification preferences
2. Toggle FCM channel off
3. Toggle Slack channel on
4. Enable quiet hours (22:00 - 08:00)
5. Change timezone to Tokyo
6. Change locale to English
7. Click save
8. Verify success message
9. Reload page
10. Verify settings persisted

**Test Case 2: Event Filters**
1. Disable "order.created" notifications
2. Enable "order.fulfilled" notifications
3. Save preferences
4. Verify changes saved

**Test Case 3: Operations Panel - Stats**
1. Login as owner
2. Navigate to notify ops panel
3. Verify statistics display:
   - Total notifications
   - Success count
   - Failed count
   - Success rate %
4. Verify channel breakdown

**Test Case 4: Operations Panel - Retry**
1. Navigate to "Failed" tab
2. Verify failed notifications list
3. Click "Retry" on one notification
4. Verify loading state
5. Verify notification removed from list
6. Verify stats updated

**Test Case 5: Operations Panel - Retry All**
1. Navigate to "Failed" tab
2. Click "전체 재시도"
3. Verify all notifications retry
4. Verify list clears
5. Verify stats updated

## Accessibility Testing

### Screen Reader Testing

**Tools:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)
- TalkBack (Android)

**Test Cases:**
1. Navigate to order tracking
2. Tab through interface
3. Verify status announcements
4. Change order status (owner view)
5. Verify live region announces changes
6. Verify all buttons have labels
7. Verify all inputs have labels
8. Verify form errors announced

### Keyboard Navigation

**Test All Pages:**
1. Tab through all interactive elements
2. Verify focus indicators visible
3. Verify tab order logical
4. Test Enter/Space on buttons
5. Test Escape to close modals
6. Test Arrow keys in dropdowns/selects

### Color Contrast

**Verify:**
- All text meets WCAG AA (4.5:1)
- Status badges readable
- Error messages visible
- Focus indicators visible
- Loading states clear

## Performance Testing

### Page Load
- Checkout: < 1s
- Tracking: < 1s
- Preferences: < 1s
- Order Management: < 2s (with order list)
- Ops Panel: < 2s (with stats)

### Real-time Updates
- Status change propagation: < 2s
- Live region update: immediate
- UI refresh: < 500ms

## Browser Compatibility

**Test in:**
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

**Mobile:**
- iOS Safari
- Chrome Mobile
- Samsung Internet

## Data Validation

### Checkout
- Name: required, min 1 char
- Phone: required, min 9 digits
- Email: optional, valid format
- Address: optional
- Special requests: optional, max 500 chars

### Status Changes
- Must be valid transition
- Cannot change completed/cancelled orders
- Note: optional, max 200 chars

### Notification Preferences
- At least one channel enabled
- Quiet hours: valid time format
- Timezone: valid IANA timezone
- Locale: supported locale code

## Mock Data

### Default Cart Items
```javascript
[
  {
    id: 'item1',
    name: '치즈버거',
    quantity: 2,
    price: 8000,
    subtotal: 16000,
    options: [
      { name: '사이즈', value: 'Large', price: 1000 }
    ]
  },
  {
    id: 'item2',
    name: '감자튀김',
    quantity: 1,
    price: 3000,
    subtotal: 3000
  }
]
```

### Default Order
- Store ID: `store_demo_001`
- Status: `CONFIRMED`
- Created: 30 minutes ago
- Updated: Now

### Default Preferences
- FCM: enabled
- Slack: disabled
- Email: enabled
- Quiet Hours: disabled
- Locale: ko-KR

## Debugging

### Enable Debug Logs
```javascript
// In browser console
localStorage.setItem('DEBUG', 'true');
```

### Check Local Storage
```javascript
// View all stored data
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}

// Clear all
localStorage.clear();
```

### Network Monitoring
- Open DevTools > Network
- Filter by "XHR" or "Fetch"
- Monitor API calls (mocked in current version)
- Check response times

## Known Issues

### Current Limitations
1. Mock authentication - no real Firebase Auth
2. Local storage - no Firestore
3. Simulated delays - not actual network
4. No real FCM/Slack integration
5. No real payment processing

### Expected Errors
- None - all errors should be handled gracefully

### Workarounds
- Role switching via console
- Manual localStorage editing for testing
- Browser refresh to reset state

---

**Last Updated:** Saturday, October 4, 2025  
**Version:** T14-10  
**Status:** Ready for testing
