'use client';

import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ViewToggle.module.css';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [view, setView] = useState<ViewMode>('grid');

  function handleToggle() {
    const newView = view === 'grid' ? 'list' : 'grid';
    setView(newView);
    onViewChange(newView);
  }

  return (
    <Button onClick={handleToggle} className={styles.button}>
      <div className={styles.imageWrapper}>
        <Image
          src={view === 'grid' ? '/grid-view.png' : '/list-view.png'}
          alt={view === 'grid' ? 'grid view' : 'list view'}
          width={76}
          height={40}
        />
      </div>
    </Button>
  );
}
