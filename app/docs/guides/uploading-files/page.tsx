import { Card } from "@heroui/card";

export default function UploadingFilesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Uploading Files</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        Uploading files to your Slack workspace through SlackShots is easy.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">Steps</h2>
        <ol className="list-decimal list-inside mt-4 text-lg">
          <li>
            From the dashboard, click the &quot;Upload&quot; button in the
            toolbar.
          </li>
          <li>Select the files you want to upload from your computer.</li>
          <li>
            The files will be uploaded to your Slack workspace and will appear
            in the dashboard.
          </li>
        </ol>
      </Card>
    </div>
  );
}
