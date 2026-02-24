'use client';

import { useFormContext } from "react-hook-form";
import { AddStoreItemSearch } from './AddStoreItemSearch'

export default function StoreItemsForm() {
    // get props from parents
    const methods = useFormContext()

    return (<div>
        <AddStoreItemSearch />
    </div>)
}

