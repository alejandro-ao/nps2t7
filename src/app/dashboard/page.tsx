'use client';

import { CONFIG } from 'src/config-global';
import { Typography, Box } from '@mui/material';
import FileNavigationWrapper from 'src/components/file-navigation/FileNavigation';

export default function Page() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        File Navigation
      </Typography>
      <FileNavigationWrapper />
    </Box>
  );
}
