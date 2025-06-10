"use client";

import { useState } from "react";
import { Suspense } from "react";
import {
  StackSimple,
  Rows,
  Article,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { Button } from "@heroui/button";

import { FileRenderer } from "@/components/file-types/file-renderer";
import { generateMockFiles } from "@/lib/mock/mock-files";
import { initializeFileTypeRegistry } from "@/lib/file-types";
import { useUIStore } from "@/stores/ui-store";

// Initialize the registry on the client side
if (typeof window !== "undefined") {
  initializeFileTypeRegistry();
}

export default function RendererTest() {
  // Use viewMode from the UI store instead of local state
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  // Keep these as local state
  const [mockFiles] = useState(() => generateMockFiles(20));
  const [selectedFile, setSelectedFile] = useState(mockFiles[0]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Renderer Test Page</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Test different file renderers and view modes
          </p>

          {/* View mode toggler */}
          <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-md shadow w-fit">
            <button
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <StackSimple size={24} />
            </button>
            <button
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("list")}
            >
              <Rows size={24} />
            </button>
            <button
              className={`p-2 rounded ${
                viewMode === "detail"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("detail")}
            >
              <Article size={24} />
            </button>
            <button
              className={`p-2 rounded ${
                viewMode === "preview"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setViewMode("preview")}
            >
              <MagnifyingGlass size={24} />
            </button>
          </div>
        </header>

        <main>
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockFiles.map((file) => (
                <Button key={file.fileID} onClick={() => setSelectedFile(file)}>
                  <Suspense
                    fallback={
                      <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
                    }
                  >
                    {/* Remove mode prop - it's not used by FileRenderer */}
                    <FileRenderer item={file} />
                  </Suspense>
                </Button>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
              {mockFiles.map((file) => (
                <Button key={file.fileID} onClick={() => setSelectedFile(file)}>
                  <Suspense
                    fallback={
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    }
                  >
                    {/* Remove mode prop */}
                    <FileRenderer item={file} />
                  </Suspense>
                </Button>
              ))}
            </div>
          )}

          {viewMode === "detail" && (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow h-[80vh]">
              <Suspense
                fallback={
                  <div className="h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                }
              >
                {/* Remove mode prop */}
                <FileRenderer item={selectedFile} />
              </Suspense>
            </div>
          )}

          {viewMode === "preview" && (
            <Suspense
              fallback={
                <div className="h-[80vh] bg-gray-200 dark:bg-gray-700 animate-pulse" />
              }
            >
              {/* Remove mode prop */}
              <FileRenderer item={selectedFile} />
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
