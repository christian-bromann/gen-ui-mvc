import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize LangChain packages to avoid dynamic import issues
  serverExternalPackages: [
    "langchain",
    "@langchain/core",
    "@langchain/langgraph",
    "@langchain/langgraph-sdk",
    "@langchain/openai",
  ],
};

export default nextConfig;
