'use client';
import { Box, Typography } from '@mui/material';

interface Props {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export default function ProgressRing({ percent, size = 80, strokeWidth = 7, color = '#7C4DFF', label }: Props) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" fontWeight={800} sx={{ color: '#fff', lineHeight: 1 }}>{percent}%</Typography>
        {label && <Typography sx={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>{label}</Typography>}
      </Box>
    </Box>
  );
}
