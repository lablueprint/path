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