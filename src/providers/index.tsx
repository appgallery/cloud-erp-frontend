'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  );
}