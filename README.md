# Mirabelle's AI Design System

My personal design system management application that integrates with Storybook and uses AI to generate component code and analyze design system health.

## Features

- **Storybook Integration**: Connect to your existing Storybook instance
- **AI Code Generation**: Generate production-ready React components using Claude AI
- **Design System Analytics**: AI-powered analysis of your design system health
- **Component Management**: View, search, and manage your design system components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Storybook instance (optional)

### Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Claude API Key (required for AI features)
REACT_APP_CLAUDE_API_KEY=your_claude_api_key_here

# Storybook URL (optional - can be set in the service)
REACT_APP_STORYBOOK_URL=https://your-storybook-url.com
```

### Connecting to Storybook

1. Set your Storybook URL in the environment variables or service
2. The app will automatically attempt to connect to your Storybook
3. Check the connection status on the Dashboard
4. If connected, you'll see your components loaded
5. Click **Open Storybook** to view your Storybook in a new tab

## Usage

### Component Library

1. Navigate to the **Components** tab
2. View all your design system components
3. Click **Generate Code** to create new components
4. The AI will analyze your component's Storybook data and generate production-ready code

### Component Actions

- **View Docs**: Opens the component's Storybook documentation page
- **View Story**: Opens the component's Storybook story page
- **Generate Code**: Creates new component code using AI

### AI Analysis

1. Click **AI Analysis** to analyze your design system health
2. Review insights and recommendations
3. Take action on suggested improvements

## Architecture

### Core Services

- **AI Service**: Handles Claude API communication for code generation and analysis
- **Storybook Integration**: Direct API calls to Storybook's `stories.json` endpoint

### Component Structure

```
src/
│   ├── components/
│   │   ├── Dashboard.tsx   # Main dashboard view
│   │   ├── ComponentLibrary.tsx # Component management
│   │   ├── CodeGenerator.tsx # AI code generation
│   │   ├── DesignTokens.tsx # Design token management
│   │   └── ui/ # Reusable UI components
│   ├── services/
│   │   ├── aiService.ts # Claude AI integration
│   │   └── storybookService.ts # Storybook integration
│   └── stories/ # Storybook stories
```

## Troubleshooting

### Storybook Connection Issues

- Verify your Storybook URL is accessible
- Check that your Storybook has CORS enabled
- Ensure your Storybook is running and accessible

### AI Generation Issues

- Verify your Claude API key is valid
- Check your API usage limits
- Verify your Storybook has components with proper story configurations

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run storybook` - Start Storybook
- `npm run test` - Run tests

## Built With

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Claude AI API
- Storybook
