declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_ALLI_AI_API_KEY: string;
      EXPO_PUBLIC_API_URL: string;
    }
  }
}

export {};