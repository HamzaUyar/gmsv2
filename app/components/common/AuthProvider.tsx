"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      // Refetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetch when window focuses
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
} 