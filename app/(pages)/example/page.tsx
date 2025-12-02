"use client";

import { createExampleEntry } from "@/app/api/example/actions";
import { createTicket } from "@/app/api/tickets/actions"

export default function Example() {
  const data = {
    id: 5,
    name: 'harry',
  };

  const ticketData = {
    requestor_user_id: "4c4f3502-1b31-4040-8a7a-2baedbc8a347",
    store_id: "94b6329f-7383-46e2-978d-e105d31c3813",
    status: "Pending",
  }

  const handleClick = async () => {
    await createExampleEntry(data);
  };

  const submitTicket = async () => {
    await createTicket(ticketData);
  }

  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <button onClick={handleClick}>
        Click to add data to the example table
      </button>
      <br />
      <button onClick={submitTicket}>
        Click to add ticket to the ticket table
      </button>
    </div>
  );
}