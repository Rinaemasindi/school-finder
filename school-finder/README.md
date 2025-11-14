# SA Schools Finder

A modern, mobile-first web application for browsing and exploring South African schools information.

## Features

### 1. Browse Schools
- **Mobile-responsive grid layout** displaying all schools
- **Advanced filtering** by sector, phase, quintile, and verification status
- **Real-time search** by school name, city, or municipality
- **Verification badges** to identify verified schools
- Click on any school card to view detailed information

### 2. School Details
- **Comprehensive school information** including contact details
- **Verification status** prominently displayed
- **School statistics** with learner-educator ratios
- **Location coordinates** for mapping
- **Responsive layout** adapting from mobile to desktop

### 3. Find Schools (Map View)
- **Interactive map** using Leaflet/OpenStreetMap
- **Search and filter** schools by location
- **Click on markers** to view school information
- **Dynamic map updates** based on filters
- **Mobile-optimized** touch interactions

### 4. Analytics Dashboard
- **Statistics cards** showing total schools, learners, and educators
- **Visual charts** for sector, phase, and quintile distributions
- **Verification rates** across all schools
- **Responsive charts** that adapt to screen size

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Architecture Pattern

This project follows the **colocation pattern**, where page-specific components are stored alongside their pages:

```
src/app/
├── (browse)/
│   └── _components/
│       ├── SchoolCard.tsx
│       └── SchoolFilters.tsx
├── school/[id]/
│   └── _components/
│       ├── SchoolHeader.tsx
│       └── SchoolInfo.tsx
├── find/
│   └── _components/
│       ├── SchoolMap.tsx
│       └── MapSearch.tsx
└── analytics/
    └── _components/
        ├── StatsCards.tsx
        └── AnalyticsCharts.tsx
```

## Getting Started

### Installation

```bash
cd school-finder
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Mobile-First Design

The application is built with a mobile-first approach:

- **Responsive navigation** with hamburger menu on mobile
- **Adaptive grid layouts** (1 column on mobile, 2-3 on desktop)
- **Touch-friendly** interactions and buttons
- **Optimized font sizes** for readability on all screens
- **Flexible card layouts** that stack on smaller screens

## Data Structure

The application uses mock data based on the South African schools dataset, including:

- School identification (NatEMIS ID)
- Basic information (name, province, city)
- Classification (sector, phase, type, quintile)
- Contact details (address, telephone)
- Statistics (learners, educators)
- Verification status
- Geographic coordinates

## Future Enhancements

- Real API integration with actual school database
- User authentication and saved schools
- Advanced search with more filters
- Export functionality for analytics
- School comparison features
- Reviews and ratings system
- Offline support with PWA
