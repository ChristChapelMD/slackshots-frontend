import { Card } from "@heroui/card";
import { Snippet } from "@heroui/snippet";

export default function FilesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Files API</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        The Files API allows you to interact with files in a user&apos;s Slack
        workspace.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">GET /api/files</h2>
        <p className="mt-4 text-lg">
          Fetches a paginated list of files for the authenticated user.
        </p>
        <h3 className="text-xl font-bold mt-4">Query Parameters</h3>
        <ul className="list-disc list-inside mt-4 text-lg">
          <li>`page` (optional): The page number to fetch.</li>
          <li>`limit` (optional): The number of files to fetch per page.</li>
        </ul>
        <h3 className="text-xl font-bold mt-4">Example Response</h3>
        <Snippet className="mt-4">
          {`{
  "files": [
    {
      "_id": "...",
      "fileName": "...",
      "fileSize": "...",
      "fileType": "...",
      "uploads": [
        {
          "provider": "...",
          "providerFileId": "..."
        }
      ]
    }
  ],
  "hasMore": true
}`}
        </Snippet>
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">DELETE /api/files</h2>
        <p className="mt-4 text-lg">
          Deletes one or more files from the user&apos;s Slack workspace.
        </p>
        <h3 className="text-xl font-bold mt-4">Request Body</h3>
        <Snippet className="mt-4">
          {`{
  "files": [
    {
      "fileId": "...",
      "deleteFlag": "app" // or "both"
    }
  ]
}`}
        </Snippet>
      </Card>
    </div>
  );
}
