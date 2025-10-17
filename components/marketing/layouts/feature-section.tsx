"use client";
import { RocketLaunch, MagnifyingGlass, Lock } from "@phosphor-icons/react";

const features = [
  {
    name: "Lightning Fast",
    description: "Experience blazing fast file uploads, browsing, and search.",
    icon: RocketLaunch,
  },
  {
    name: "Intelligent Search",
    description: "Find files with natural language. It's like magic.",
    icon: MagnifyingGlass,
  },
  {
    name: "Secure & Private",
    description: "Privacy is paramount, your files stay yours.",
    icon: Lock,
  },
];

export function FeatureSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold text-slate-900/90 dark:text-slate-200/90">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-slate-900/90 dark:text-slate-200/90 sm:text-4xl">
            A better way to manage your Slack files
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            SlackShots is packed with features to make managing files in yout
            Slack workspace easier.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:space-y-0">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="drop-shadow-lg h-12 w-12 text-foreground rounded-lg font-semibold border border-zinc-400/40 group absolute flex items-center justify-center shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] whitespace-nowrape">
                    <feature.icon aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
