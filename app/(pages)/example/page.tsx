"use client";

import { createExampleEntry } from "@/app/api/example/actions";
import {
  createTicket,
  deleteTicket,
  updateTicketStatus,
} from "@/app/api/tickets/actions";
import { useState } from "react";
import { createStore } from "@/app/api/stores/action";
import { ExampleType } from "@/app/types/ExampleType";
import { Ticket } from "@/app/types/Ticket";
import { Store } from "@/app/types/Store";
import { deleteStore } from "@/app/api/stores/action";
import TestDonationsPage from "../test-donations/page";

export default function Example() {
  const [ticketToDelete, setDelete] = useState("");
  const [ticketToUpdate, setUpdateTicket] = useState("");

  const [updateStatus, setStatus] = useState("");

  const data: ExampleType = {
    id: 5,
    name: "harry",
  };

  const storeData: Store = {
    store_id: "550e8400-e29b-41d4-a716-446655440000",
    name: "test store",
    street_address: "test address",
  };

  const ticketData: Ticket = {
    ticket_id: "",
    requestor_user_id: "4c4f3502-1b31-4040-8a7a-2baedbc8a347",
    store_id: "94b6329f-7383-46e2-978d-e105d31c3813",
    status: "ready",
    date_submitted: "",
  };

  const handleExampleClick = async () => {
    await createExampleEntry(data);
  };

  const submitTicket = async () => {
    await createTicket(ticketData);
  };

  const sendTicketDeletion = async () => {
    await deleteTicket(ticketToDelete);
  };

  const updateTicket = async () => {
    await updateTicketStatus(updateStatus, ticketToUpdate);
  };

  const handleAddStoreClick = async () => {
    await createStore(storeData);
  };

  const handleDeleteStoreClick = async () => {
    await deleteStore(storeData.store_id);
  };
  return (
    <div>
      Welcome to PATH! This is an example page.
      <br />
      <button onClick={handleExampleClick}>
        Click to add data to the example table
      </button>
      <br />
      <br />
      <h2>Ticket Testing</h2>
      <button onClick={submitTicket}>
        Click to add ticket to the ticket table
      </button>
      <br />
      <label>
        Ticket to delete:{" "}
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
        Ticket to update:{" "}
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
        New Status:{" "}
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
      <h2>Store Testing</h2>
      <button onClick={handleAddStoreClick}>
        Click to add store to stores table
      </button>
      <button onClick={handleDeleteStoreClick}>
        Click to delete store from stores table
      </button>
      <TestDonationsPage />
    </div>
  );
}
