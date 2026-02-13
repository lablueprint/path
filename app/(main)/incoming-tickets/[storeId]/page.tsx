export default async function IncomingTicketsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  return <div>
    <h1 style={{ fontSize: 40 }}>Incoming Tickets</h1>
    <p>Store ID = {storeId}</p>
  </div>;
  
  
}