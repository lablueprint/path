'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateStoreItemQuantity, updateStoreItemIsHidden } from '@/app/actions/store';

export default function StoreItemForm({
    store_id,
    store_item_id,
    quantity,
    visibility,
}: {
    store_id: string;
    store_item_id: string;
    quantity: number;
    visibility: boolean;
}) {
    const [saveError, setSaveError] = useState<string>('');
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, errors, isSubmitting },
    } = useForm({
        defaultValues: {
            quantity_available: quantity,
            is_hidden: visibility,
        },
    });
    
    const onSubmit = async (values: {
        quantity_available: number;
        is_hidden: boolean;
    }) => {
        setSaveError("");
        
        try {
            await updateStoreItemQuantity(store_id, store_item_id, values.quantity_available);
            await updateStoreItemIsHidden(store_id, store_item_id, values.is_hidden);
            reset(values);
        } catch (e: any) {
            setSaveError(e?.message ?? 'Failed to save changes.');
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '14px', }}>
                <label>Quantity Available: </label>
                <input
                    type='number'
                    min={0}
                    step={1}
                    disabled={isSubmitting}
                    {...register('quantity_available', {
                        valueAsNumber: true,
                        required: 'Error: Please enter a numeric quantity (or cancel).', // for empty input
                        validate: (v) => Number.isInteger(v) && v >= 0 || 'Error: Please enter a combination of digits only (0-9).'
                    })}
                />
                
                {errors.quantity_available && (
                    <div style={{color: 'red',}}>
                        {errors.quantity_available.message}
                    </div>
                )}
            </div>
            
            <div>
                <label>Hidden? </label>
                <input type='checkbox' disabled={isSubmitting} {...register('is_hidden')} />
            </div>
            
            {isDirty && (
                <div>
                    <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
                    <button type='button' disabled={isSubmitting} onClick={() => reset()}>Cancel</button>
                </div>
            )}
        </form>
    );
}