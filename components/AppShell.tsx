'use client';
import { Box } from '@mui/material';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{
      minHeight: '100dvh',
      background: '#0B0F1A',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1100 },
        mx: 'auto',
        pb: { xs: 9, sm: 10 },
        px: { xs: 0, sm: 2, md: 4 },
        minHeight: '100dvh',
      }}>
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
}
