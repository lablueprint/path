export default async function InventoryPage() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('inventory_items').select(`inventory_item_id, name, photo_url, subcategories(name), categories(name)`)


    return <div />
}