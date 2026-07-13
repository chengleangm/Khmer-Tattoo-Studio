import type { R2Bucket } from "@cloudflare/workers-types";

declare global {
  interface CloudflareEnv {
    STUDIO_STORAGE: R2Bucket;
    R2_PUBLIC_URL?: string;
  }
}

export {};
