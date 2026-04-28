'use client';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import StartupIntro from '@/components/StartupIntro';

function NextAppDirEmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: 'mui' });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (!names.length) return null;
    let styles = '';
    for (const name of names) {
      if (cache.inserted[name] !== true) {
        styles += cache.inserted[name];
      }
    }
    return (
      <style
        key="emotion-mui"
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#7C4DFF' },
    secondary:  { main: '#FFD93D' },
    background: { default: '#0B0F1A', paper: '#121A2A' },
    text:       { primary: '#FFFFFF', secondary: 'rgba(255,255,255,0.6)' },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 50, textTransform: 'none', fontWeight: 700 },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
      return;
    }

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(console.error);

    if ('caches' in window) {
      caches.keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(console.error);
    }
  }, []);

  return (
    <NextAppDirEmotionCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1E2A3A', color: '#fff', borderRadius: 16, border: '1px solid rgba(124,77,255,0.3)', fontFamily: 'inherit' },
            duration: 2500,
          }}
        />
        <StartupIntro>{children}</StartupIntro>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
