# HTTPFrequency Frontend

Web interface for the HTTPFrequency project with Vercel Speed Insights integration.

## Features

- Clean, modern UI for HTTP health checks
- Real-time response analysis
- CSV download of results
- Vercel Speed Insights for performance monitoring

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

This will start a Vite development server with hot module replacement.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Vercel Speed Insights

This project includes [@vercel/speed-insights](https://vercel.com/docs/speed-insights) for performance monitoring. The integration is automatically initialized in `script.js`.

When deployed to Vercel, Speed Insights will:
- Track Core Web Vitals (CLS, FID, LCP, FCP, TTFB, INP)
- Provide real-user performance data
- Help identify performance bottlenecks

No additional configuration is needed - it works out of the box on Vercel deployments.

## Project Structure

```
frontend/
├── index.html      # Main HTML file
├── script.js       # Application logic with Speed Insights
├── style.css       # Styling
├── package.json    # Dependencies and scripts
├── vite.config.js  # Vite bundler configuration
└── dist/           # Built files (generated)
```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Speed Insights will be enabled automatically on production

Build command: `npm run build`
Output directory: `dist`
