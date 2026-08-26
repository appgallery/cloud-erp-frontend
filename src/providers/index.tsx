'use client';

import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { GlobalLoadingBar } from '@/components/common/global-loading-bar';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Suspense fallback={null}>
          <GlobalLoadingBar />
        </Suspense>
        {children}
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  );
}