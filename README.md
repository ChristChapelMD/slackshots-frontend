# SlackShots

![SlackShots Logo](public/logo.png)

SlackShots is a powerful web application designed to make uploading and managing files in Slack workspaces effortless. With SlackShots, users can batch upload hundreds of files to Slack channels with ease, organize them efficiently, and manage their uploads from a centralized dashboard.

## 🌟 Features

- **Batch Uploads**: Upload multiple files to Slack channels at once
- **Customizable Batch Size**: Control how many files are sent per Slack message
- **Channel Selection**: Choose which Slack channel to upload files to
- **Modern Dashboard**: Organize, view, and manage all your uploaded files
- **Grid View**: Responsive grid layout with adjustable density settings
- **Selection Mode**: Select multiple files for batch operations (download, delete)
- **Slack OAuth Integration**: Seamless authentication with your Slack workspace

## 🚀 Tech Stack

- **Frontend Framework**: Next.js 15
- **UI Components**: HeroUI v2
- **Styling**: Tailwind CSS with tailwind-variants
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Slack OAuth
- **File Upload**: TUS protocol via tus-js-client
- **Icons**: Phosphor Icons
- **Animation**: Framer Motion

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.0.0 or higher)
- npm, yarn, pnpm, or bun

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/slackshots-frontend.git
cd slackshots-frontend
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

> **Note for pnpm users**: You need to add the following code to your `.npmrc` file:
> ```
> public-hoist-pattern[]=*@heroui/*
> ```
> After modifying the `.npmrc` file, run `pnpm install` again.

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_SERVER_PROTOCOL=http
NEXT_PUBLIC_SERVER_HOST=localhost:3000
NEXT_PUBLIC_SLACKSHOTS_OAUTH_CLIENT_URL=https://slack.com/oauth/v2/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=channels:history,channels:read,chat:write,files:read,files:write,groups:history,groups:read,im:read,mpim:read,users:read,users:read.email,channels:join&user_scope=

# Optional PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Demo mode - set to true to use demo API endpoints instead of real backend
NEXT_PUBLIC_DEMO_MODE=false
```

> **Important**: Replace `YOUR_SLACK_CLIENT_ID` with your actual Slack app client ID. To obtain this, you need to create a Slack app at [api.slack.com](https://api.slack.com/apps).

### 4. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## 🔄 Connecting to the Backend

SlackShots frontend works together with the SlackShots backend. For complete functionality, you'll need to set up the backend as well:

1. Clone the backend repository: [SlackShots Backend](https://github.com/ChristChapelMD/slackshots-backend-node)
2. Follow the setup instructions in the backend repository
3. Update your `.env.local` file to point to your backend server (defaults to `NEXT_PUBLIC_SERVER_HOST=localhost:8080`)

## 🏗️ Project Architecture

SlackShots follows a modular architecture with the following key components:

### Core Structure
- **app/**: Next.js app directory with page routes
  - **(marketing)/**: Marketing/landing pages
  - **auth/**: Authentication routes
  - **dashboard/**: Main application dashboard
  - **api/**: API routes for the frontend
- **components/**: Reusable UI components
- **services/**: API services for data fetching
- **stores/**: Zustand stores for state management
- **hooks/**: Custom React hooks
- **lib/**: Utility functions and third-party client wrappers

### State Management

The application uses Zustand for state management with these key stores:
- **FileStore**: Manages file data, loading states, and pagination
- **UIStore**: Manages UI preferences (view mode, grid density)
- **SelectionStore**: Manages file selection state
- **DrawerStore**: Manages drawer/modal states
- **UploadProcessStore**: Manages upload process state and progress
- **UploadFormStore**: Manages form state for uploads
- **AuthStore**: Manages authentication state

### Data Flow

1. User authenticates with Slack OAuth
2. User selects files and a target channel
3. Files are uploaded using the TUS protocol for reliable resumable uploads
4. Upload progress is tracked and displayed to the user
5. On completion, files appear in the dashboard grid
6. Users can interact with uploaded files (view, download, delete)

## 📦 Build for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 🧪 Demo Mode

SlackShots includes a demo mode that simulates backend API responses. This is useful for development or demonstration purposes without requiring a backend connection.

To enable demo mode, set `NEXT_PUBLIC_DEMO_MODE=true` in your `.env.local` file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [SlackShots Backend Repository](https://github.com/ChristChapelMD/slackshots-backend-node)
- [Report an Issue](https://github.com/your-username/slackshots-frontend/issues)
- [Slack API Documentation](https://api.slack.com/docs)
