import { Card } from "@heroui/card";

export default function WorkspacesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Workspaces API</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        The Workspaces API allows you to interact with a user&apos;s Slack
        workspaces.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">GET /api/workspace/current</h2>
        <p className="mt-4 text-lg">
          Fetches the current workspace for the authenticated user.
        </p>
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">POST /api/workspace/add</h2>
        <p className="mt-4 text-lg">
          Adds a new Slack workspace for the authenticated user.
        </p>
      </Card>
    </div>
  );
}
