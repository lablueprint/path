"use client";


import { useRouter } from "next/navigation"
import { deleteStore } from "../../../../actions/store";




type RemoveStoreButtonProp = {
    storeId: string;
};


export function RemoveStoreButton({ storeId }: RemoveStoreButtonProp) {
    const router = useRouter();


    const handleDeletion = async() => {
        try {
            await deleteStore(storeId);
            router.push("/hq");
        } catch (error) {
            alert("Failed to remove store.");
        }
    }


    return (
        <button type = "button" onClick = {handleDeletion}>
            Remove Store
        </button>
    );
}