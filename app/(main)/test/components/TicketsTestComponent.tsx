'use client';

import {
  createTicket,
  deleteTicket,
  updateTicketStatus,
} from '@/app/actions/ticket';
import { useState, useEffect } from 'react';
import { Ticket, TicketInsert } from '@/app/types/ticket';
import { createClient } from '@/app/lib/supabase/browser-client';

export default function TicketsTestComponent() {
  const [ticketToDelete, setDelete] = useState('');
  const [ticketToUpdate, setUpdateTicket] = useState('');
  const [updateStatus, setStatus] = useState('');

  const url = './';

  const ticketData: TicketInsert = {
    requestor_user_id: 'ac05fc68-ad0c-42fa-a383-1612313fc608',
    store_id: 'f11145b6-127d-4e68-ab5c-27ec619950d6',
    status: 'ready',
  };

  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data, error: err } = await supabase.from('tickets').select('*');
      if (err) {
        console.error('Error fetching people:', err);
      }
      setTickets(data);
    };
    getData();
  }, []);

  const submitTicket = async () => {
    await createTicket(ticketData);
  };

  const sendTicketDeletion = async () => {
    await deleteTicket(ticketToDelete);
  };

  const updateTicket = async () => {
    await updateTicketStatus(updateStatus, ticketToUpdate);
  };

  return (
    <div>
      <h2>Ticket Testing</h2>
      <a href={url + 'outgoing-tickets'}>
        <button>View Outgoing Tickets</button>
      </a>
      <ul>
        <li>Tickets you can read will appear here.</li>
        {tickets?.map((ticket) => (
          <li key={ticket.ticket_id}>{ticket.ticket_id}</li>
        ))}
      </ul>
      <button onClick={submitTicket}>
        Click to add ticket to the ticket table
      </button>
      <br />
      <label>
        Ticket to delete:{' '}
        <input
          name="ticketDeletionInput"
          value={ticketToDelete}
          onChange={(event) => {
            setDelete(event.target.value);
          }}
        />
      </label>
      <br />
      <button onClick={sendTicketDeletion}>
        Click to delete ticket from the ticket table
      </button>
      <br />
      <label>
        Ticket to update:{' '}
        <input
          name="ticketUpdateInput"
          value={ticketToUpdate}
          onChange={(event) => {
            setUpdateTicket(event.target.value);
          }}
        />
      </label>
      <br />
      <label>
        New Status:{' '}
        <input
          name="statusUpdate"
          value={updateStatus}
          onChange={(event) => {
            setStatus(event.target.value);
          }}
        />
      </label>
      <br />
      <button onClick={updateTicket}>Click to update status of ticket</button>
      <br />
      <br />
    </div>
  );
}
