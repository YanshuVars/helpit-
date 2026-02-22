# UI Design Reference Document
## Social Welfare App — Web Redesign
### Based on Circle.so Design Pattern

---

## 1. OVERALL VISUAL LANGUAGE

### Color Palette (extracted from screenshots)

```
SIDEBAR / DARK SURFACES
- Sidebar background:     #1E1442  (deep navy-purple, from Image 1 dark bg)
- Sidebar hover state:    #2A1D55  (slightly lighter purple)
- Sidebar active item:    #FFFFFF  with background #3D2B7A
- Sidebar text:           #C4B5E8  (muted lavender)
- Sidebar active text:    #FFFFFF

MAIN CONTENT AREA
- Page background:        #F7F7F8  (near white, very light gray)
- Card background:        #FFFFFF
- Card border:            #E8E8EC  (1px, subtle gray)
- Card shadow:            0 1px 3px rgba(0,0,0,0.08)

TYPOGRAPHY COLORS
- Heading text:           #0F0F10  (near black)
- Body text:              #3D3D45  (dark gray)
- Muted / label text:     #8A8A96  (medium gray)
- Disabled text:          #C4C4CC

ACCENT / BRAND
- Primary purple:         #6B3FA0  (buttons, links, active states)
- Primary hover:          #5A3490
- CTA gradient:           linear-gradient(135deg, #6B3FA0, #4F46E5)
- Success green:          #16A34A
- Warning amber:          #D97706
- Error red:              #DC2626
- Info blue:              #2563EB

SPECIAL ELEMENTS
- Online indicator dot:   #22C55E
- Notification badge:     #EF4444
- Divider lines:          #F0F0F4
```

### Typography

```
FONT STACK
- Display / Headings:     'DM Sans', sans-serif  (weight: 600, 700)
- Body / UI text:         'DM Sans', sans-serif  (weight: 400, 500)
- Monospace (codes):      'JetBrains Mono', monospace

SCALE
- Page title:             24px / 700 / line-height 1.3
- Section heading:        18px / 600 / line-height 1.4
- Card title:             15px / 600 / line-height 1.4
- Body text:              14px / 400 / line-height 1.6
- Small / label:          12px / 500 / line-height 1.5 / letter-spacing 0.02em
- Tiny / caption:         11px / 400 / color: muted
```

### Spacing & Radius

```
BASE UNIT: 4px

Spacing scale:
  xs:  4px
  sm:  8px
  md:  16px
  lg:  24px
  xl:  32px
  2xl: 48px

Border radius:
  sm:   6px   (badges, tags, inputs)
  md:   10px  (cards, dropdowns, modals)
  lg:   14px  (sidebar items, larger cards)
  full: 9999px (avatars, pills, buttons)

Shadows:
  card:   0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)
  modal:  0 20px 60px rgba(0,0,0,0.18)
  dropdown: 0 4px 16px rgba(0,0,0,0.12)
```

---

## 2. LAYOUT ARCHITECTURE

### Master Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        TOP HEADER BAR                        │
│  (only visible on mobile — hamburger + logo + notifications) │
├──────────────┬──────────────────────────────────────────────┤
│              │          PAGE HEADER                          │
│   LEFT       │  (breadcrumb + page title + action buttons)  │
│   SIDEBAR    ├──────────────────────────────────────────────┤
│   240px      │                                              │
│   fixed      │         MAIN CONTENT AREA                    │
│              │         max-width: 1280px                     │
│              │         padding: 24px 32px                    │
│              │                                              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│  NO BOTTOM TAB BAR — completely removed                      │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

```
Mobile  (< 768px):
  - Sidebar hidden, accessible via hamburger drawer
  - Drawer slides in from left, overlay background
  - Single column content
  - Header shows: hamburger + logo + notification icon

Tablet  (768px – 1024px):
  - Sidebar collapses to 64px icon-only strip
  - Hovering an icon shows a floating label tooltip
  - Content adjusts to available width
  - 2-column grids become 1-column

Desktop (> 1024px):
  - Full sidebar 240px always visible
  - Multi-column layouts active
  - All widgets and panels visible
```

---

## 3. SIDEBAR — EXACT SPECIFICATION

### Visual Design (from Image 2)

```
WIDTH:        240px (expanded) / 64px (icon-only collapsed)
BACKGROUND:   #1E1442 (deep navy-purple)
POSITION:     fixed left, full height, z-index: 50
BORDER-RIGHT: 1px solid rgba(255,255,255,0.06)

TOP SECTION — Brand/Org Name
  Height:       56px
  Content:      16px square logo/avatar + org name text
  Logo style:   rounded-lg, background: #6B3FA0, white letter
  Org name:     14px / 600 / color: #FFFFFF
  Dropdown icon: chevron-down, color: #8A7AB5, 16px

NAVIGATION GROUPS
  Group label:    10px / 600 / uppercase / letter-spacing: 0.08em
                  color: #6B5FA0 (muted purple)
                  margin-bottom: 6px
                  padding: 0 12px

  Nav item (default):
    Height:       36px
    Padding:      0 12px
    Border-radius: 8px
    Icon:         16px / color: #8A7AB5
    Label:        13px / 500 / color: #C4B5E8
    Hover bg:     rgba(255,255,255,0.07)

  Nav item (active):
    Background:   rgba(107,63,160,0.35)
    Border-left:  2px solid #9B71D4
    Icon color:   #FFFFFF
    Label color:  #FFFFFF
    Font-weight:  600

  Badge (notification count):
    Background:   #6B3FA0
    Color:        white
    Font-size:    10px
    Padding:      1px 6px
    Border-radius: 9999px
    Float right

BOTTOM SECTION — User Profile
  Border-top:   1px solid rgba(255,255,255,0.08)
  Padding:      12px
  Layout:       flex row, items centered

  Avatar:       32px circle, border: 2px solid #6B3FA0
  Name:         13px / 600 / #FFFFFF
  Role:         11px / 400 / #8A7AB5
  Online dot:   8px circle, #22C55E, bottom-right of avatar

COLLAPSE TOGGLE
  Position:     absolute, right: -12px, middle of sidebar
  Shape:        24px circle
  Background:   #FFFFFF
  Border:       1px solid #E8E8EC
  Icon:         chevron-left / chevron-right, 12px, #6B3FA0
```

### Nav Items Per Role

```
NGO SIDEBAR:
  [No group label]
    🏠 Dashboard
    📋 Requests
    👥 Volunteers
    📅 Events
    💰 Donations
    📝 Posts
    📦 Resources

  SETTINGS GROUP:
    ⚙️  Organization Settings
    👤 Members
    📊 Audit Log

DONOR SIDEBAR:
  [No group label]
    🏠 Dashboard
    🔍 Discover NGOs
    💳 Make a Donation
    📜 Donation History
    🧾 Receipts

VOLUNTEER SIDEBAR:
  [No group label]
    🏠 Dashboard
    📋 My Assignments
    🌍 Opportunities
    🗺️  Map View
    👤 My Profile

ADMIN SIDEBAR:
  [No group label]
    🏠 Dashboard
    👥 Users
    🏢 NGOs
    📊 Reports
    🗒️  Audit Logs

ALL ROLES (shown in header, not sidebar):
  🔔 Notifications
  💬 Messages
```

---

## 4. PAGE HEADER — EXACT SPECIFICATION

### Visual Design

```
CONTAINER:
  Background:   #FFFFFF
  Border-bottom: 1px solid #F0F0F4
  Height:       64px
  Padding:      0 32px
  Position:     sticky top-0, z-index: 40

LEFT SIDE:
  Breadcrumb trail:
    Separator:  / (forward slash, color: #C4C4CC)
    Items:      13px / 400 / color: #8A8A96
    Last item:  13px / 600 / color: #0F0F10 (current page, not a link)
    Hover:      color: #6B3FA0, cursor pointer

  Page Title:
    Font:       24px / 700 / color: #0F0F10
    Margin-top: 2px below breadcrumb

RIGHT SIDE (flex row, gap: 12px, items: center):
  Search bar:
    Width:      280px
    Height:     36px
    Background: #F7F7F8
    Border:     1px solid #E8E8EC
    Border-radius: 8px
    Placeholder: "Search..." — 13px / color: #8A8A96
    Icon:       search icon, 16px, left side, color: #8A8A96
    Padding:    0 12px 0 36px (left padding for icon)

  Notification bell:
    Size:       36x36px
    Background: transparent → #F7F7F8 on hover
    Border-radius: 8px
    Badge:      8px red dot, top-right, when unread notifications exist

  User avatar:
    Size:       36px circle
    Border:     2px solid transparent → #6B3FA0 on hover
    Cursor:     pointer → opens dropdown menu

PRIMARY ACTION BUTTON (rightmost, only on certain pages):
  Example: "New Post", "Create Request", "Add Volunteer"
  Background:   #6B3FA0
  Color:        #FFFFFF
  Height:       36px
  Padding:      0 16px
  Border-radius: 8px
  Font:         13px / 600
  Hover:        #5A3490
  Icon:         + icon, 16px, left of label
```

---

## 5. CONTENT AREA LAYOUT PATTERNS

### Pattern A — Dashboard Home (NGO, Donor, Volunteer, Admin)

```
LAYOUT:
  ┌─────────────────────────────────┐
  │  STAT CARDS ROW (4 cards)       │
  │  grid: 4 cols, gap: 16px        │
  └─────────────────────────────────┘
  ┌──────────────────┬──────────────┐
  │  MAIN FEED       │  RIGHT       │
  │  (col-span: 2)   │  WIDGETS     │
  │                  │  (col-span:1)│
  │  flex-1          │  280px fixed │
  └──────────────────┴──────────────┘

STAT CARD design:
  Background:   #FFFFFF
  Border:       1px solid #E8E8EC
  Border-radius: 10px
  Padding:      20px
  Icon:         40px square, border-radius: 10px
                background: light tint of accent color
                icon: 20px, colored
  Number:       28px / 700 / #0F0F10
  Label:        13px / 400 / #8A8A96
  Trend:        12px, green (▲ +12%) or red (▼ -3%)
  Hover:        box-shadow lifts slightly

RIGHT WIDGETS:
  Width:        280px
  Background:   #FFFFFF
  Border:       1px solid #E8E8EC
  Border-radius: 10px
  Padding:      16px

  Widget header: 14px / 600 / #0F0F10, border-bottom inside
  Widget items:  small rows, 36px height each, divider between
```

### Pattern B — List Pages (Requests, Volunteers, Events, Users)

```
LAYOUT: full width, single column

TOOLBAR ROW:
  Left:  Search input (320px) + Filter dropdowns
  Right: View toggle (grid/list) + Sort dropdown + Primary action button

TABLE DESIGN (for data tables):
  Header row:
    Background:   #F7F7F8
    Border-bottom: 2px solid #E8E8EC
    Text:         11px / 600 / uppercase / #8A8A96 / letter-spacing: 0.05em
    Height:       40px

  Data rows:
    Height:       52px
    Border-bottom: 1px solid #F0F0F4
    Hover bg:     #FAFAFA
    Font:         14px / 400 / #3D3D45

  Status badges (inline in rows):
    Pending:   bg #FEF3C7 / text #B45309 / border #FDE68A
    Active:    bg #DCFCE7 / text #15803D / border #BBF7D0
    Completed: bg #DBEAFE / text #1D4ED8 / border #BFDBFE
    Rejected:  bg #FEE2E2 / text #B91C1C / border #FECACA
    All:       font-size 11px / font-weight 600 / padding 2px 8px / border-radius 9999px

  Pagination:
    Position:   bottom right
    Style:      numbered page buttons, prev/next arrows
    Font:       13px / border: 1px solid #E8E8EC / radius: 6px
```

### Pattern C — Detail Pages (Request Detail, Event Detail, Receipt)

```
LAYOUT:
  ┌──────────────────────┬─────────────┐
  │  MAIN CONTENT        │  SIDE PANEL │
  │  flex: 1             │  320px      │
  │                      │             │
  │  Title               │  Status     │
  │  Description         │  Actions    │
  │  Timeline/Activity   │  Metadata   │
  │                      │  Assignees  │
  └──────────────────────┴─────────────┘

SIDE PANEL design:
  Background:   #FFFFFF
  Border:       1px solid #E8E8EC
  Border-radius: 10px
  Padding:      20px
  Sections separated by: 1px solid #F0F0F4 + 16px margin

  Action buttons: full width, stacked, gap: 8px
  Primary action:   filled purple button
  Secondary action: outlined button
  Danger action:    outlined red button
```

### Pattern D — Form / Create Pages

```
LAYOUT: centered, max-width: 680px, margin: 0 auto

FORM SECTIONS:
  Each section:
    Heading:      16px / 600 / #0F0F10
    Subtext:      13px / 400 / #8A8A96
    Border-bottom: 1px solid #F0F0F4
    Margin-bottom: 24px

FIELD DESIGN:
  Label:          13px / 500 / #3D3D45 / margin-bottom: 6px
  Input:          height 40px / border: 1px solid #E8E8EC
                  border-radius: 8px / padding: 0 12px
                  font: 14px / background: #FFFFFF
  Focus:          border-color: #6B3FA0 / box-shadow: 0 0 0 3px rgba(107,63,160,0.12)
  Error:          border-color: #DC2626 / error message 12px red below
  Textarea:       min-height: 100px / same styling as input
  Select:         same as input + chevron icon right side

FORM FOOTER:
  Border-top:     1px solid #F0F0F4
  Padding-top:    24px
  Layout:         flex, justify-end, gap: 12px
  Cancel button:  ghost style
  Submit button:  filled purple, "Save Changes" or context label
```

### Pattern E — Settings Pages

```
LAYOUT:
  ┌───────────────┬─────────────────────────────┐
  │  SETTINGS     │  SETTINGS CONTENT           │
  │  SUBNAV       │                             │
  │  200px        │  Same as Form Pattern D     │
  │               │                             │
  │  Tab list     │                             │
  └───────────────┴─────────────────────────────┘

SUBNAV TABS (vertical):
  Item height:    40px
  Active:         background #F0EAFA / text #6B3FA0 / font-weight 600
  Default:        text #3D3D45 / hover bg #F7F7F8
  Border-radius:  8px
  Padding:        0 12px
  Font:           14px
```

### Pattern F — Auth Pages (Login, Register)

```
LAYOUT: split screen, NO sidebar, NO header

┌────────────────────┬────────────────────┐
│   LEFT PANEL       │   RIGHT PANEL      │
│   50% width        │   50% width        │
│   bg: #1E1442      │   bg: #FFFFFF      │
│                    │                    │
│   Logo             │   Form card        │
│   Tagline          │   centered         │
│   Illustration     │   max-width: 400px │
│   or stats         │                    │
└────────────────────┴────────────────────┘

LEFT PANEL:
  Background:   linear-gradient(160deg, #1E1442 0%, #2D1B69 100%)
  Logo:         white, top-left, 24px / 700
  Tagline:      28px / 700 / #FFFFFF / max-width: 360px
  Sub-text:     15px / 400 / #C4B5E8
  Bottom quote or illustration

RIGHT PANEL:
  Form container:
    Width:        400px
    Centered:     vertically and horizontally

  Title:          24px / 700 / #0F0F10
  Subtitle:       14px / 400 / #8A8A96
  Fields:         same as Form Pattern D
  Submit button:  full width, height 44px, background: #6B3FA0
  Links:          13px / #6B3FA0 / underline on hover

  Social divider: "— or continue with —" style separator
  Bottom link:    "Don't have an account? Sign up" — 13px
```

### Pattern G — Messages Page

```
LAYOUT: 3-column, full height, NO scroll on outer container

┌───────────────┬──────────────────────┬──────────────┐
│  CONVERSATION │   CHAT WINDOW        │  DETAILS     │
│  LIST         │                      │  PANEL       │
│  280px        │   flex: 1            │  280px       │
│  scrollable   │                      │  scrollable  │
└───────────────┴──────────────────────┴──────────────┘

CONVERSATION LIST:
  Search:       input at top, full width
  Items:        64px height, avatar + name + preview + time
  Active item:  bg #F0EAFA / border-left: 3px solid #6B3FA0
  Unread:       bold name + blue dot

CHAT WINDOW:
  Messages:     alternating left (others) / right (me) bubbles
  My bubble:    bg #6B3FA0 / text white / border-radius: 14px 14px 4px 14px
  Their bubble: bg #F0F0F4 / text #0F0F10 / border-radius: 14px 14px 14px 4px
  Input area:   border-top, textarea + send button
```

---

## 6. UNIVERSAL COMPONENTS

### Buttons

```
PRIMARY:
  Background:   #6B3FA0
  Color:        #FFFFFF
  Height:       36px (default) / 40px (large) / 28px (small)
  Padding:      0 16px
  Border-radius: 8px
  Font:         13px / 600
  Hover:        #5A3490, translateY(-1px)
  Active:       #4A2880, translateY(0)
  Disabled:     opacity 0.5, cursor not-allowed

SECONDARY (outlined):
  Background:   transparent
  Border:       1px solid #E8E8EC
  Color:        #3D3D45
  Hover:        bg #F7F7F8

GHOST:
  Background:   transparent
  Color:        #3D3D45
  Hover:        bg #F7F7F8

DANGER:
  Background:   #DC2626 (filled) or border #DC2626 (outlined)
  Color:        #FFFFFF or #DC2626
```

### Cards

```
BASE CARD:
  Background:   #FFFFFF
  Border:       1px solid #E8E8EC
  Border-radius: 10px
  Padding:      20px
  Shadow:       0 1px 3px rgba(0,0,0,0.07)
  Hover:        shadow becomes 0 4px 12px rgba(0,0,0,0.10)
  Transition:   all 200ms ease

CARD HEADER:
  Border-bottom: 1px solid #F0F0F4
  Padding-bottom: 14px
  Margin-bottom: 14px
  Title:        15px / 600 / #0F0F10
  Action link:  13px / #6B3FA0 / float right
```

### Avatar

```
SIZES:
  sm:  24px  (in table rows, comment lists)
  md:  32px  (sidebar, chat bubbles)
  lg:  40px  (profile cards)
  xl:  64px  (profile page)

STYLE:
  Shape:          circle
  Border:         2px solid #FFFFFF (with shadow behind)
  Fallback:       colored background (hashed from name) + initials
  Online dot:     8px circle #22C55E, positioned bottom-right
```

### Empty States

```
LAYOUT: centered, padding: 48px
  Illustration:   SVG icon, 80px, color: #C4C4CC
  Title:          16px / 600 / #3D3D45
  Description:    14px / 400 / #8A8A96 / max-width: 280px / text-center
  CTA button:     primary button below, optional
```

### Toast Notifications

```
POSITION:   top-right, 16px from edges
WIDTH:      320px
BORDER-RADIUS: 10px
PADDING:    14px 16px

Success:  border-left: 4px solid #16A34A / icon: check-circle green
Error:    border-left: 4px solid #DC2626 / icon: x-circle red
Warning:  border-left: 4px solid #D97706 / icon: alert-triangle amber
Info:     border-left: 4px solid #2563EB / icon: info blue

Animation: slide in from right (300ms ease-out), auto-dismiss 4000ms
```

---

## 7. ANIMATIONS & INTERACTIONS

```
PAGE TRANSITIONS:
  New page content: fade-in 200ms ease-out
  Sidebar items:    no animation (instant)

SIDEBAR:
  Expand/collapse:  width transition 250ms ease-in-out
  Mobile drawer:    translateX slide 280ms ease-in-out
  Overlay:          fade 200ms

CARDS:
  Hover lift:       transform: translateY(-2px) + shadow — 200ms ease

BUTTONS:
  Hover:            200ms background color change
  Active press:     translateY(1px) — 100ms

MODALS:
  Backdrop:         fade-in 200ms
  Modal card:       scale(0.97)→scale(1) + fade-in 250ms ease-out

DROPDOWNS:
  Open:             translateY(-6px)→translateY(0) + fade 180ms
  Close:            immediate or 120ms fade

LOADING SKELETON:
  Use shimmer effect: background gradient animating left to right
  Color:            #F0F0F4 → #E8E8EC → #F0F0F4
  Border-radius:    matches the component it represents
```

---

## 8. WHAT TO REMOVE — CRITICAL

```
❌ REMOVE COMPLETELY:
  - Bottom tab bar (all role variants)
  - Any max-width: 375px, 390px, 428px containers
  - Any min-height: 100vh with phone aspect ratio
  - Safe area insets (padding-bottom for mobile notch)
  - Any "mobile-container" wrapper divs
  - Fixed positioning for bottom navigation

✅ REPLACE WITH:
  - Left sidebar (spec above)
  - Full-width responsive containers
  - Page header with breadcrumbs (spec above)
  - Proper desktop grid layouts (spec above)
```

---

## 9. QUICK REFERENCE — MOST USED VALUES

```css
/* Paste this as your CSS variables */
:root {
  --sidebar-bg: #1E1442;
  --sidebar-width: 240px;
  --sidebar-collapsed: 64px;
  --header-height: 64px;

  --color-primary: #6B3FA0;
  --color-primary-hover: #5A3490;
  --color-bg: #F7F7F8;
  --color-surface: #FFFFFF;
  --color-border: #E8E8EC;
  --color-border-subtle: #F0F0F4;

  --color-text-heading: #0F0F10;
  --color-text-body: #3D3D45;
  --color-text-muted: #8A8A96;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --shadow-card: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05);
  --shadow-modal: 0 20px 60px rgba(0,0,0,0.18);
  --shadow-dropdown: 0 4px 16px rgba(0,0,0,0.12);

  --font-sans: 'DM Sans', sans-serif;
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

---

*This document defines the complete visual language. Apply every value exactly as specified. Do not deviate from the color palette, spacing, or typography. Every component should feel like it belongs to the same system.*