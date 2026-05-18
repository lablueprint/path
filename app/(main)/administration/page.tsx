import ActionButton from '@/app/(main)/components/ActionButton';
import { createClient } from '@/app/lib/supabase/server-client';
import membersIcon from '@/public/action-buttons/members.svg';
import storesIcon from '@/public/action-buttons/stores.svg';
import exportsIcon from '@/public/action-buttons/exports.svg';
import storeAdminsIcon from '@/public/action-buttons/store-admins.svg';

export default async function AdministrationPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError) {
    console.error('Error fetching claims:', claimsError);
  }

  const userRole = claimsData?.claims?.user_role;

  return (
    <>
      <h1>Administration</h1>
      <div className="row row-cols-1 row-cols-sm-2 g-5">
        <div className="col">
          {['requestor', 'admin', 'superadmin', 'owner'].includes(
            userRole ?? '',
          ) && (
            <ActionButton
              text="Members"
              url="/administration/members"
              icon={membersIcon}
            />
          )}
        </div>
        <div className="col">
          {['admin', 'superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton
              text="Store Admins"
              url="/administration/store-admins"
              icon={storeAdminsIcon}
            />
          )}
        </div>
        <div className="col">
          {['superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton
              text="Stores"
              url="/administration/stores"
              icon={storesIcon}
            />
          )}
        </div>
        <div className="col">
          {['superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton
              text="Exports"
              url="/administration/exports"
              icon={exportsIcon}
            />
          )}
        </div>
      </div>
    </>
  );
}
