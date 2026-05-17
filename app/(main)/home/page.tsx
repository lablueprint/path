import ActionButton from '@/app/(main)/components/ActionButton';
import { createClient } from '@/app/lib/supabase/server-client';
import recordGiftInKindIcon from '@/public/action-buttons/record-gift-in-kind.svg';
import requestInventoryIcon from '@/public/action-buttons/request-inventory.svg';
import manageInventoryIcon from '@/public/action-buttons/manage-inventory.svg';
import administrationIcon from '@/public/action-buttons/administration.svg';

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
          <ActionButton
            text="Record Gift-in-Kind"
            url="/home/donate"
            icon={recordGiftInKindIcon}
          />
        </div>
        <div className="col">
          {['requestor', 'admin', 'superadmin', 'owner'].includes(
            userRole ?? '',
          ) && (
            <ActionButton
              text="Request Inventory"
              url="/request"
              icon={requestInventoryIcon}
            />
          )}
        </div>
        <div className="col">
          {['admin', 'superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton
              text="Manage Inventory"
              url="/manage"
              icon={manageInventoryIcon}
            />
          )}
        </div>
        <div className="col">
          {['superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton
              text="Administration"
              url="/administration"
              icon={administrationIcon}
            />
          )}
        </div>
      </div>
    </>
  );
}
