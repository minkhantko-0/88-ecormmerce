'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { ConvexClientProvider } from '@/app/ConvexClientProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute='class'
      defaultTheme='dark'
      disableTransitionOnChange
    >
      <ConvexClientProvider>{children}</ConvexClientProvider>
      <ToasterProvider />
    </ThemeProvider>
  );
}

function ToasterProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      closeButton
      position='top-center'
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}
