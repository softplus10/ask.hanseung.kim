declare global {
  namespace App {
    interface Platform {
      env: {
        POCKETBASE_URL?: string;
      };
      context: ExecutionContext;
      caches: CacheStorage;
    }
  }
}

export {};
