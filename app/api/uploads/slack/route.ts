import { NextApiRequest, NextApiResponse } from "next";

import { api } from "@/services/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { files, channel, comment } = req.body;

    if (!files || !channel) {
      return res.status(400).json({ error: "Missing files or channel" });
    }

    const result = await api.slack.upload.uploadFiles(
      process.env.SLACK_ACCESS_TOKEN!,
      files,
      channel,
      comment,
    );

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Slack upload error:", err);

    return res.status(500).json({ error: err.message });
  }
}
