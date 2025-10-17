<div align="center">
![SlackShots Logo](./public/SSLOGO_NOBG.png)

# Slackshots

**Fast, private, and intelligent file management for Slack**


SlackShots is a web-based application designed to be a fast, private, and intelligent file management for Slack. It aims to solve the problem of uploading and managing large numbers of files within a user's Slack workspace, which can become difficult as the volume of files grows. The application provides a dedicated interface for users to browse, search, and manage their Slack files, with a focus on speed, and privacy.
</div>


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ChristChapelMD/slackshots.git
cd slackshots
```

### 2. Install dependencies


Using npm:
```bash
npm install
```

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
```

> **Important**: Replace `YOUR_SLACK_CLIENT_ID` with your actual Slack app client ID. To obtain this, you need to create a Slack app at [api.slack.com](https://api.slack.com/apps).
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:3000.

_For more examples, please refer to the [Documentation](https://slackshots.app/docs)_

## Project Structure
- **app/**: Next.js app directory with page routes
  - **(marketing)/**: Marketing/landing pages
  - **auth/**: Authentication routes
  - **docs/**: Application documentation
  - **dashboard/**: Main application dashboard
  - **api/**: API routes for the frontend
- **components/**: Reusable UI components
- **services/**: API services for data fetching
- **stores/**: Zustand stores for state management
- **hooks/**: Custom React hooks
- **lib/**: Utility functions and third-party client wrappers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

## Links
- [Report an Issue](https://github.com/ChristChapelMD/slackshots/issues)
- [Slack API Documentation](https://api.slack.com/docs)
