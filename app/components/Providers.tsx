"use client";

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit-auth");
      
      if (!response.ok) {
        throw new Error("Authentication request failed");
      }
      
      const data = await response.json();
      return data.authenticationParameters;
    } catch (error) {
      console.error("Authenticator error:", error);
      throw new Error("Authentication request failed");
    }
  };

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        <ImageKitProvider 
          urlEndpoint={urlEndpoint} 
          publicKey={publicKey} 
          authenticator={authenticator}
        >
          {children}
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
