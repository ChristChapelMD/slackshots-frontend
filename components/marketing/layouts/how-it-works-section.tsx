"use client";
import {
  Handshake,
  Upload,
  ShieldCheck,
  Wrench,
  MagnifyingGlass,
} from "@phosphor-icons/react";

import { MediaPlayer } from "@/components/ui/media-player";

interface StaggeredFeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
  imageOnLeft?: boolean;
}

function StaggeredFeature({
  title,
  description,
  icon: Icon,
  imageOnLeft = false,
}: StaggeredFeatureProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-8 mb-8 ${imageOnLeft ? "md:grid-flow-col-dense" : ""}`}
    >
      <div
        className={`flex flex-col justify-center ${imageOnLeft ? "md:col-start-2" : ""}`}
      >
        <h3 className="flex flex-col text-2xl text-center font-bold text-slate-900/90 dark:text-slate-200/90">
          <div className="mx-auto drop-shadow-lg h-12 w-12 text-foreground rounded-lg font-semibold border border-zinc-400/40 group mb-4 flex items-center justify-center shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] whitespace-nowrape">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </div>
          {title}
        </h3>
        <p className="mt-2 text-base  text-slate-900/90 dark:text-slate-200/90">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <MediaPlayer />
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold  text-slate-900/90 dark:text-slate-200/90">
            How it Works
          </h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight  text-slate-900/90 dark:text-slate-200/90 sm:text-4xl">
            Get started in minutes
          </p>
          <p className="mt-4 max-w-2xl text-xl  text-slate-900/90 dark:text-slate-200/90 lg:mx-auto">
            Connecting your Slack workspace is a breeze.
          </p>
        </div>

        <div className="mt-10 space-y-16">
          <StaggeredFeature
            description="Securely connect your Slack account to SlackShots in just a few clicks. Your privacy is our priority."
            icon={Handshake}
            title="Connect to your workspace"
          />
          <StaggeredFeature
            imageOnLeft
            description="Drag and drop your files to upload them to your Slack workspace. We handle the rest."
            icon={Upload}
            title="Upload your files"
          />
          <StaggeredFeature
            description="All your files are stored securely in your Slack workspace. We never store your files on our servers."
            icon={ShieldCheck}
            title="Browse securely"
          />
          <StaggeredFeature
            imageOnLeft
            description="Easily download, delete, and manage your files from the SlackShots dashboard."
            icon={Wrench}
            title="Manage files"
          />
          <StaggeredFeature
            description="Find any file in seconds with our intelligent search. You can even search for text within images."
            icon={MagnifyingGlass}
            title="Smart search"
          />
        </div>
      </div>
    </section>
  );
}
