'use client';
import { deleteStoreAdmin } from '@/app/actions/store';

export default function DeleteStoreAdminButton ({ storeAdminId }: { storeAdminId: string; }) {
    return (
        <button type='button' onClick={() => deleteStoreAdmin(storeAdminId)}>Remove Admin</button>
    );
}