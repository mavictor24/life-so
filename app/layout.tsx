import type { Metadata, Viewport } from 'next';
import ThemeRegistry from './ThemeRegistry';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7C4DFF',
};

export const metadata: Metadata = {
  title: 'Life OS',
  description: 'Your Personal Life Operating System',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Life OS' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#7C4DFF" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, background: '#0B0F1A', overflowX: 'hidden', width: '100%', minHeight: '100dvh' }}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
