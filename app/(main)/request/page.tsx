import { createClient } from '@/app/lib/supabase/server-client';
import StoresList from '@/app/components/StoresList';

export default async function RequestPage() {
// get all stores from the stores table
    const supabase = await createClient();

    const { data, error: err } = await supabase.from('example').select('*');
    
    if (err) {
        console.error('Error fetching people:', err);
        return <div>Failed to load data.</div>;
    }
    
    return (
        <ul>
        {data?.map((person) => (
            <li key={person.id}>{person.name}</li>
        ))}
        </ul>
    );
}
