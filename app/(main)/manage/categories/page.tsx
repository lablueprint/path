import { createClient } from '@/app/lib/supabase/server-client';
import EditCategories from '@/app/(main)/manage/categories/components/EditCategories';
import ViewCategories from '@/app/(main)/manage/categories/components/ViewCategories';
import Breadcrumbs from '@/app/(main)/components/Breadcrumbs';
import { Alert } from 'react-bootstrap';

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    return <Alert variant="danger">Failed to load user.</Alert>;
  }

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
    return <Alert variant="danger">Failed to load categories.</Alert>;
  }

  return (
    <>
      <Breadcrumbs
        labelMap={{
          manage: 'Manage Inventory',
        }}
      />
      <h1>Categories</h1>
      {role === 'admin' && <ViewCategories categories={categories} />}

      {(role === 'superadmin' || role === 'owner') && (
        <EditCategories categories={categories} />
      )}
    </>
  );
}
