import ActionButton from '@/app/(main)/home/components/ActionButton';
import { createClient } from '@/app/lib/supabase/server-client';
import DonateIcon from '@/public/donate.svg';
import HomeIcon from '@/public/home.svg';
import InventoryIcon from '@/public/inventory.svg';
import PieIcon from '@/public/pie.svg';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    console.error('Error fetching claims:', claimsError);
  }

  const userRole = claimsData?.claims?.user_role;

  return (
    <>
      <h1>Home</h1>
      <div className="row row-cols-1 row-cols-sm-2 g-5">
        <div className="col">
          <ActionButton text="Donate" url="/home/donate" icon={DonateIcon} />
        </div>
        <div className="col">
          {['requestor', 'admin', 'superadmin', 'owner'].includes(
            userRole ?? '',
          ) && (
            <ActionButton
              text="Request Inventory"
              url="/request"
              icon={InventoryIcon}
            />
          )}
        </div>
        <div className="col">
          {['admin', 'superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton
              text="Manage Inventory"
              url="/manage"
              icon={HomeIcon}
            />
          )}
        </div>
        <div className="col">
          {['superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton text="HQ" url="/hq" icon={PieIcon} />
          )}
        </div>
      </div>
    </>
  );
}
