"use client";

import Image from "next/image";
import { Button } from "@heroui/button";
import { Link as HeroLink } from "@heroui/link";

import SlackLogo from "@/public/SLA-appIcon-desktop.png";
import { useAuth } from "@/hooks/use-auth";

export function SlackAuthButton() {
  const openSlackAuthPopup = () => {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    if (!process.env.NEXT_PUBLIC_SLACKSHOTS_OAUTH_CLIENT_URL) {
      /* eslint-disable no-console */
      console.error("Slack OAuth URL is not defined.");

      return;
    }

    window.open(
      process.env.NEXT_PUBLIC_SLACKSHOTS_OAUTH_CLIENT_URL,
      "Add Application to Worksapce via Slack Authentication",
      `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  return (
    <Button
      isExternal
      aria-label="Add Slacks to Your Slack Workspace"
      as={HeroLink}
      className="bg-transparent cursor-pointer p-0"
      radius="none"
      onPress={openSlackAuthPopup}
    >
      <Image
        priority
        alt="Add to Slack"
        height={40}
        src="https://platform.slack-edge.com/img/add_to_slack@2x.png"
        width={139}
      />
    </Button>
  );
}
