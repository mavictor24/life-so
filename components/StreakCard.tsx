'use client';
import { Box, Typography } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { motion } from 'framer-motion';

interface Props {
  label: string;
  value: number;
  subtitle?: string;
  color?: string;
}

export default function StreakCard({ label, value, subtitle, color = '#FFD93D' }: Props) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
      <Box sx={{
        p: 2, borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', gap: 0.5,
        backdropFilter: 'blur(10px)',
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFireDepartmentIcon sx={{ color, fontSize: 28 }} />
          <Typography variant="h4" fontWeight={800} sx={{ color, lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}
