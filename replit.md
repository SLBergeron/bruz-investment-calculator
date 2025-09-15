# Bruz Real Estate Investment Calculator

## Overview
A sophisticated French real estate investment calculator built with React + Vite + TypeScript and shadcn/ui framework. Analyzes investment profitability for a 57m² apartment in Bruz (35) at €200,000 with interactive charts, downloads, and comprehensive financial calculations.

**Current State**: ✅ **Production Ready** - Fully functional with professional UI, accurate calculations, and automated GitHub Pages deployment

## Recent Changes (September 15, 2025)
- ✅ **Complete shadcn/ui rebuild** with proper TypeScript path resolution and dual environment Vite configuration
- ✅ **Critical IRR calculation fix** - Corrected model to include rental income from year 1 instead of unrealistic 5-year delay
- ✅ **Enhanced currency formatting** - EUR with French locale and proper input validation
- ✅ **Professional Charts & Downloads** - Interactive Recharts visualizations with BASE_URL-compatible file downloads
- ✅ **GitHub Actions deployment** - Complete automated build and Pages deployment workflow
- ✅ **Cross-environment compatibility** - Works seamlessly on Replit development (port 5000) and GitHub Pages production

## User Preferences
- **Framework**: React 18 + Vite + TypeScript for modern development
- **UI Library**: shadcn/ui with Tailwind CSS v4 for professional, accessible components
- **Charts**: Recharts for interactive data visualizations
- **Deployment**: Dual environment support (Replit dev + GitHub Pages production)
- **Currency**: EUR formatting with French locale for local market relevance

## Project Architecture

### Core Components
- **InvestmentCalculator.tsx** - Main calculator interface with real-time calculations
- **ChartsDisplay.tsx** - Interactive Recharts visualizations (Line + Bar charts)
- **DownloadSection.tsx** - File downloads with BASE_URL compatibility
- **lib/calculations.ts** - Financial calculation engine with IRR, NPV, ROI calculations

### Key Technical Decisions
1. **Dual Environment Configuration**: 
   - Development: Vite base path "/" for Replit port 5000
   - Production: Base path "/bruz-investment-calculator/" for GitHub Pages
   - Uses `import.meta.env.BASE_URL` for runtime path resolution

2. **IRR Calculation Model**: 
   - **Corrected cashflow model** includes rental income from year 1
   - Avoids unrealistic 5-year no-income assumption
   - Provides accurate investment profitability analysis

3. **Asset Management**:
   - Download files in public/ directory (Excel, PDF, Python simulator)
   - BASE_URL-compatible paths for cross-environment downloads
   - Proper asset copying to dist/ during build

4. **Build Optimization**:
   - Manual code splitting: vendor, ui, charts bundles
   - Terser minification for production
   - Responsive design with mobile-first approach

### File Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── InvestmentCalculator.tsx
│   ├── ChartsDisplay.tsx
│   └── DownloadSection.tsx
├── lib/
│   ├── utils.ts         # shadcn/ui utilities
│   └── calculations.ts  # Financial calculations
├── index.css           # Tailwind base styles
└── main.tsx            # App entry point

public/
├── bruz_calculator.xlsx
├── bruz_invest_report.pdf
└── bruz_simulator.py

.github/workflows/
└── deploy.yml          # GitHub Actions deployment
```

### Dependencies
- **Frontend**: React 18, Vite 7, TypeScript 5
- **UI**: shadcn/ui, Tailwind CSS v4, Radix UI primitives
- **Charts**: Recharts for interactive visualizations
- **Icons**: Lucide React for consistent iconography

## Deployment Configuration

### Development (Replit)
- **Server**: Vite dev server on 0.0.0.0:5000
- **Base Path**: "/" for local development
- **Hot Reload**: Working with HMR updates

### Production (GitHub Pages)
- **Build**: Automated via GitHub Actions
- **Base Path**: "/bruz-investment-calculator/" for project site
- **Assets**: Properly prefixed with base URL
- **Deployment**: Triggered on push to main branch

### Setup Instructions
1. In GitHub repo Settings > Pages, set Source to "GitHub Actions"
2. Push to main branch to trigger automated deployment
3. Application will be available at: `https://<username>.github.io/bruz-investment-calculator/`

## Financial Calculations
- **Investment Amount**: €200,000 for 57m² apartment in Bruz (35)
- **Rental Income**: €750/month from year 1 (corrected from previous year 6 assumption)
- **Metrics**: IRR, NPV, ROI, Cash Flow projections over 10 years
- **Charts**: Property value progression and annual cash flow visualization
- **Downloads**: Excel calculator, PDF report, Python simulator

## Notes
- HMR CSS updates in logs are normal startup behavior (confirmed by architecture review)
- All download files verified and working in both environments
- Screenshot automation may have intermittent issues but application functionality is confirmed working
- Professional UI with proper error handling and input validation throughout