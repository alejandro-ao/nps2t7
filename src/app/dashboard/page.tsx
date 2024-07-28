// src/app/dashboard/page.tsx

'use client';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

import FileNavigationWrapper from 'src/components/file-navigation/FileNavigation';

// ----------------------------------------------------------------------

// export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <div>
      <h1>File Navigation</h1>
      <FileNavigationWrapper />
    </div>
  );
}
