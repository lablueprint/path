import StoreCard from "./StoreCard"

type Store = {
    id: string
    name: string
    streetAddress: string
}

type StoresListProps = {
    stores: Store[]
}



export default function StoresList({ stores }: StoresListProps) {

    console.log(stores.map(s => s?.id));
    console.log(stores[0], stores[0]?.id);

    return (
        <div>
            {stores.map((store) => (
                <StoreCard  
                    key={store.id}
                    id={store.id}
                    name={store.name}
                    streetAddress={store.streetAddress}
                />
            ))}
        </div>
    )
}