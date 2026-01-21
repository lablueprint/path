export default async function ManageStorePage({ 
    params,
}: { 
    params: Promise<{ storeId: string }>
}) {
    const { storeId } = await params

    return (
        <div>
            <div>My store: {storeId}</div>
        </div>
    );
}