import { Card } from "@heroui/card";

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Introduction</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        Welcome to the documentation for SlackShots. This documentation will
        help you get started with the project and provide you with all the
        information you need to use it effectively.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold">What is SlackShots?</h2>
        <p className="mt-4 text-lg">
          SlackShots is a web-based application designed to be a fast, private,
          and intelligent file management for Slack. It aims to solve the
          problem of finding and managing files within a user&apos;s Slack
          workspace, which can become difficult as the volume of files grows.
          The application provides a dedicated interface for users to browse,
          search, and manage their Slack files, with a focus on speed, privacy,
          and search that actually understands you.
        </p>
      </Card>
    </div>
  );
}
