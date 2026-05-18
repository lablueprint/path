import { createClient } from '@/app/lib/supabase/server-client';
import EditCategories from '@/app/(main)/manage/categories/components/EditCategories';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const role = claimsData?.claims?.user_role;

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`category_id, name, subcategories(subcategory_id, name)`)
    .order('name', { ascending: true })
    .order('name', { referencedTable: 'subcategories', ascending: true })
    .overrideTypes<
      {
        category_id: number;
        name: string;
        subcategories: {
          name: string;
          subcategory_id: number;
        }[];
      }[],
      { merge: false }
    >();

  if (error) {
    console.error(error);
    return <div>Failed to load categories.</div>;
  }

  return (
    <div>
      <Breadcrumbs
        labelMap={{
          manage: 'Manage Inventory',
        }}
      />
      <h1>Categories</h1>
      <div className="content-body">
        {role === 'admin' && (
          <ul>
            {categories?.map((cat) => (
              <li key={cat.category_id}>
                {cat.name}
                <ul>
                  {cat.subcategories?.map((sub) => (
                    <li key={sub.subcategory_id}>{sub.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {(role === 'superadmin' || role === 'owner') && (
          <EditCategories categories={categories} />
        )}
      </div>
    </div>
  );
}
