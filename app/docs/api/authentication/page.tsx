import { Card } from "@heroui/card";

export default function AuthenticationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Authentication</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        SlackShots uses a custom authentication solution called `better-auth` to
        handle user authentication.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">Authentication Flow</h2>
        <p className="mt-4 text-lg">The authentication flow is as follows:</p>
        <ol className="list-decimal list-inside mt-4 text-lg">
          <li>User clicks the &quot;Sign in with Slack&quot; button.</li>
          <li>User is redirected to Slack to authorize the application.</li>
          <li>
            User is redirected back to the application with an authorization
            code.
          </li>
          <li>
            The application exchanges the authorization code for an access
            token.
          </li>
          <li>The application creates a session for the user.</li>
        </ol>
      </Card>
    </div>
  );
}
