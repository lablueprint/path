'use client';

import { useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useUserStore } from '@/app/lib/store/user-store';

interface Ticket {
  id: number | string;
  name: string;
  price: number;
  status: string;
}

export default function InStockTicketItemCard({ ticketData }: { ticketData: Ticket }) {
  return (
    <div className="card">
      <h3>{ticketData.name}</h3>
      <p>Price: ${ticketData.price}</p>
      <button>Buy Now</button>
    </div>
  );
}

