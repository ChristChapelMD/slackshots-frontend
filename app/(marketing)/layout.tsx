import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SlackShots. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link
              className="hover:text-blue-500 transition-colors text-sm"
              href="privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="hover:text-blue-500 transition-colors text-sm"
              href="tos"
            >
              Terms of Service
            </Link>
            <Link
              className="hover:text-blue-500 transition-colors text-sm"
              href="/contact"
            >
              Contact
            </Link>
          </div>

          <div className="flex gap-3">
            <Link className="hover:text-blue-500 transition-colors" href="#">
              <i className="fab fa-twitter" />
            </Link>
            <Link className="hover:text-blue-500 transition-colors" href="#">
              <i className="fab fa-github" />
            </Link>
            <Link className="hover:text-blue-500 transition-colors" href="#">
              <i className="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
