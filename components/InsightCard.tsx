'use client';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  icon: string;
  title: string;
  description: string;
  gradient?: string;
}

export default function InsightCard({ icon, title, description, gradient = 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(74,0,224,0.05))' }: Props) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{
        p: 2, borderRadius: '20px',
        background: gradient,
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        <Typography fontSize={28}>{icon}</Typography>
        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ color: '#fff' }}>{title}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{description}</Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
