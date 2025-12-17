'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // replace() avoids adding to browser history
    router.replace('/test');
  }, [router]);

  return null;
}
