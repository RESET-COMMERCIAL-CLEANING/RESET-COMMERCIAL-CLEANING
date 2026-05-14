# RESET Website - Comprehensive Testing Checklist

## Device Testing Breakpoints
- [ ] Desktop (1200px+)
- [ ] Tablet (768px - 1024px)
- [ ] Mobile (320px - 767px)

---

## PAGE 1: HOMEPAGE (/)

### Desktop Testing
- [ ] Navigation bar displays correctly
- [ ] Logo is visible and clickable
- [ ] Hero section is properly aligned
- [ ] All CTA buttons are visible and clickable
- [ ] "See The Difference" section loads with sliders
- [ ] Comparison sliders work (drag/click to move)
- [ ] Checkboxes on comparisons work
- [ ] Industries section cards display properly
- [ ] Testimonials section displays
- [ ] CTA buttons (Sign Up, Get Quote) work
- [ ] Footer displays all links
- [ ] All fonts render correctly

### Tablet Testing (768px)
- [ ] Navigation adapts (menu should work)
- [ ] Hero text is readable
- [ ] Comparison sliders still functional
- [ ] Cards stack appropriately
- [ ] Touch interactions work (sliders)
- [ ] Buttons are tap-able (minimum 44px)

### Mobile Testing (375px)
- [ ] Hamburger menu works
- [ ] Navigation menu opens/closes
- [ ] Logo is visible
- [ ] Hero section is optimized
- [ ] Comparison sliders work with touch
- [ ] Text is readable (no overflow)
- [ ] Buttons are properly sized for touch
- [ ] No horizontal scroll
- [ ] All sections stack vertically
- [ ] Footer is accessible

---

## PAGE 2: SERVICES (/services)

### Functionality Tests
- [ ] All service cards display correctly
- [ ] Service domain images load
- [ ] Cards are responsive
- [ ] Click/tap interactions work
- [ ] Links navigate properly
- [ ] Hero section loads

### Responsive Tests
- [ ] Desktop: 3-column layout
- [ ] Tablet: 2-column layout
- [ ] Mobile: 1-column stack
- [ ] Images scale properly
- [ ] Text is readable at all sizes

---

## PAGE 3: ABOUT (/about)

### Content & Functionality
- [ ] About hero section displays
- [ ] Timeline or content sections display
- [ ] Images load properly
- [ ] Text is properly formatted
- [ ] CTA buttons work

### Responsive Tests
- [ ] Content blocks stack on mobile
- [ ] Images resize responsively
- [ ] Text remains readable
- [ ] No layout breaks

---

## PAGE 4: JOURNEY (/journey)

### Functionality
- [ ] Journey timeline displays
- [ ] All journey steps are visible
- [ ] Icons display correctly
- [ ] Content is readable

### Responsive
- [ ] Timeline adapts to mobile
- [ ] No horizontal scroll
- [ ] Text is readable
- [ ] Spacing is appropriate

---

## PAGE 5: PROCESS (/process)

### Functionality
- [ ] Process steps display
- [ ] All information visible
- [ ] Icons/images load
- [ ] Proper spacing

### Responsive
- [ ] Steps stack on mobile
- [ ] No overflow
- [ ] Readable text
- [ ] Touch-friendly layout

---

## PAGE 6: CONTACT (/contact)

### Functionality
- [ ] Contact form loads
- [ ] All form fields present (Name, Email, Message, etc.)
- [ ] Form submission works
- [ ] Validation works (if implemented)
- [ ] Contact information displays
- [ ] Map displays (if present)

### Form Testing
- [ ] Name field accepts input
- [ ] Email field accepts input
- [ ] Message field accepts input
- [ ] Submit button is clickable
- [ ] Error messages display (if validation fails)
- [ ] Success message displays (on submit)

### Responsive
- [ ] Form fields stack on mobile
- [ ] Labels are readable
- [ ] Input fields are touch-friendly
- [ ] Submit button is properly sized
- [ ] No horizontal scroll

---

## PAGE 7: SIGNUP (/signup)

### Functionality
- [ ] Signup form loads
- [ ] All fields present (Name, Email, Password, etc.)
- [ ] Form submission works
- [ ] Dropdown/select elements work (if present)
- [ ] Password field is masked
- [ ] Terms/conditions link works (if present)

### Form Testing
- [ ] All input fields accept text
- [ ] Dropdowns are functional
- [ ] Checkbox options work
- [ ] Submit button is clickable
- [ ] Form validation displays errors
- [ ] Success/redirect on submission

### Responsive
- [ ] Form stacks vertically on mobile
- [ ] Dropdowns work on touch
- [ ] Input fields are large enough
- [ ] Button is touch-friendly
- [ ] No horizontal scroll

---

## PAGE 8: LOGIN (/login)

### Functionality
- [ ] Login form loads
- [ ] Email/Username field works
- [ ] Password field is masked
- [ ] "Forgot Password" link works (if present)
- [ ] Submit button is clickable
- [ ] "Sign Up" link works

### Form Testing
- [ ] Email field accepts input
- [ ] Password field accepts input
- [ ] Submit button triggers action
- [ ] Error messages display
- [ ] Navigation links work

### Responsive
- [ ] Form centered on all devices
- [ ] Input fields are readable
- [ ] Button is touch-sized
- [ ] No overflow

---

## PAGE 9: QUOTE (/quote)

### Functionality
- [ ] Form loads with all fields
- [ ] Dropdowns work (Service type, Property type, etc.)
- [ ] Input fields accept text
- [ ] Date picker works (if present)
- [ ] Submit button is clickable
- [ ] Form validation works

### Form Testing
- [ ] All dropdowns functional
- [ ] Text fields work
- [ ] Number fields work (if present)
- [ ] Submit button submits form
- [ ] Success message displays

### Responsive
- [ ] Form fields stack on mobile
- [ ] Dropdowns are touch-friendly
- [ ] Date picker works on mobile
- [ ] Buttons are large enough
- [ ] No horizontal scroll

---

## PAGE 10: PORTAL - SUBCONTRACTOR (/portal/subcontractor)

### Functionality
- [ ] Page loads correctly
- [ ] All sections display (Stats, Contracts, Assignment, Checklist)
- [ ] Checklist items display
- [ ] Checkbox toggles work
- [ ] "Upload Before & After" button visible
- [ ] Upload form opens correctly
- [ ] File input works (browse files)
- [ ] Upload submission works
- [ ] Photos display with uploads
- [ ] Comments field accepts input
- [ ] "Mark Complete" button works
- [ ] Navigation buttons work (Reschedule, etc.)
- [ ] Notifications display
- [ ] Profile section displays

### Checklist Testing
- [ ] Checkbox toggle on/off
- [ ] Upload form expands
- [ ] File selection works
- [ ] Image preview displays
- [ ] Comments can be entered
- [ ] Submit button works
- [ ] Photos are saved
- [ ] Task shows as complete
- [ ] All 5 tasks can be tested

### Responsive
- [ ] Layout adapts to tablet
- [ ] Forms are readable
- [ ] Buttons are touch-sized
- [ ] Checkboxes are tap-able
- [ ] Upload form is usable
- [ ] No horizontal scroll

---

## PAGE 11: PORTAL - CLIENT (/portal/client)

### Functionality
- [ ] Page loads
- [ ] All sections display
- [ ] Navigation works
- [ ] Buttons are functional
- [ ] Information displays correctly

### Responsive
- [ ] Proper layout on mobile
- [ ] Touch-friendly buttons
- [ ] Readable text
- [ ] No overflow

---

## CROSS-PAGE TESTING

### Navigation
- [ ] All navbar links work
- [ ] Logo navigates to homepage
- [ ] Mobile menu opens/closes
- [ ] Mobile menu items are clickable
- [ ] Footer links work
- [ ] All navigation is consistent

### Buttons & CTAs
- [ ] Sign Up button works everywhere
- [ ] Login button works
- [ ] Get Quote button works
- [ ] Contact button works
- [ ] All CTA buttons navigate correctly

### Forms
- [ ] Form submission works on all pages
- [ ] Validation displays errors properly
- [ ] Success messages display
- [ ] No form data is lost on errors

### Images & Media
- [ ] All images load (no broken images)
- [ ] Images are optimized for mobile
- [ ] Sliders work on all devices
- [ ] Videos play (if present)

---

## SPECIFIC FUNCTIONALITY TESTS

### Before & After Sliders
- [ ] Desktop: Click and drag works
- [ ] Desktop: Mouse move updates slider
- [ ] Tablet: Touch drag works
- [ ] Mobile: Touch drag works
- [ ] Slider handle displays correctly
- [ ] Before/After labels visible
- [ ] Images load properly

### Form Validation
- [ ] Required fields show errors when empty
- [ ] Email validation works
- [ ] Phone validation works (if present)
- [ ] Min/Max length validation works
- [ ] Select/Dropdown validation works
- [ ] Error messages are clear

### Responsive Images
- [ ] Images scale properly
- [ ] No image distortion
- [ ] Images load quickly
- [ ] Retina displays supported (if applicable)

---

## ISSUES FOUND

| Page | Issue | Device | Status |
|------|-------|--------|--------|
|      |       |        |        |
|      |       |        |        |

---

## NOTES

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on actual devices, not just browser DevTools
- Check touch responsiveness on tablets and phones
- Verify all animations work smoothly
- Check console for JavaScript errors
- Verify all links are correct
- Test form submission success/error states
- Check accessibility (keyboard navigation if applicable)
