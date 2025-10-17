
import { Card } from "@heroui/card";
import { Snippet } from "@heroui/snippet";

export default function ConfigurationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Configuration</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        To run SlackShots, you need to configure your environment variables. Create a `.env.local` file in the root of the project and add the following variables:
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">Environment Variables</h2>
        <Snippet className="mt-4">
          {
`MONGODB_URI=your-mongodb-uri
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_REDIRECT_URI=your-slack-redirect-uri
`
          }
        </Snippet>
      </Card>
    </div>
  );
}
