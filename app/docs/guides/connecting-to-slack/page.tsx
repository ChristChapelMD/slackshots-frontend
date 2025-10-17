import { Card } from "@heroui/card";

export default function ConnectingToSlackPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Connecting to Slack</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        Connecting your Slack workspace to SlackShots is a simple process.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">Steps</h2>
        <ol className="list-decimal list-inside mt-4 text-lg">
          <li>
            From the dashboard, click the &quot;Connect a Workspace&quot;
            button.
          </li>
          <li>You will be redirected to Slack to authorize the application.</li>
          <li>
            Click &quot;Allow&quot; to grant SlackShots access to your
            workspace.
          </li>
          <li>
            You will be redirected back to the dashboard, where you will see
            your files.
          </li>
        </ol>
      </Card>
    </div>
  );
}
