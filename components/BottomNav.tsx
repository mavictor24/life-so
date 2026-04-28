'use client';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';

const NAV_ITEMS = [
  { label: 'Home',    icon: <HomeRoundedIcon />,          href: '/' },
  { label: 'Daily',   icon: <TodayRoundedIcon />,         href: '/daily' },
  { label: 'Weekly',  icon: <DateRangeRoundedIcon />,     href: '/weekly' },
  { label: 'Monthly', icon: <CalendarMonthRoundedIcon />, href: '/monthly' },
  { label: 'Movies',  icon: <MovieRoundedIcon />,         href: '/movies' },
  { label: 'Recipes', icon: <RestaurantMenuRoundedIcon />, href: '/recipes' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router   = useRouter();

  const value = NAV_ITEMS.findIndex(n => n.href === pathname);

  return (
    <Paper
      sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        width: '100%', zIndex: 100,
        background: 'rgba(11,15,26,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(124,77,255,0.15)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={value}
        onChange={(_, i) => router.push(NAV_ITEMS[i].href)}
        sx={{
          background: 'transparent',
          maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1100 },
          mx: 'auto',
          height: { xs: 56, sm: 64 },
          '& .MuiBottomNavigationAction-root': { color: 'rgba(255,255,255,0.35)', minWidth: 0, padding: { xs: '6px 0', sm: '8px 0' } },
          '& .Mui-selected': { color: '#7C4DFF' },
          '& .MuiBottomNavigationAction-label': { fontSize: { xs: '0.6rem', sm: '0.7rem' }, fontWeight: 600 },
          '& .MuiBottomNavigationAction-root .MuiSvgIcon-root': { fontSize: { xs: '1.4rem', sm: '1.6rem' } },
        }}
      >
        {NAV_ITEMS.map(n => (
          <BottomNavigationAction key={n.href} label={n.label} icon={n.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
