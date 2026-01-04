interface ImportMetaEnv {
  readonly VITE_PUBLIC_VAPID_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_STRIPE_KEY: string;
  readonly VITE_FEATURE_FLAG: string;
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_CLOUDINARY_URL: string;
  readonly VITE_ENV: "dev" | "prod";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
