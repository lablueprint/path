import ActionButton from '@/app/(main)/components/ActionButton';
import { createClient } from '@/app/lib/supabase/server-client';
import membersIcon from '@/public/action-buttons/members.svg';
import storesIcon from '@/public/action-buttons/stores.svg';
import exportsIcon from '@/public/action-buttons/exports.svg';

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
              url="/team/people"
              icon={membersIcon}
            />
          )}
        </div>
        <div className="col">
          {['admin', 'superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton text="Stores" url="/hq" icon={storesIcon} />
          )}
        </div>
        <div className="col">
          {['superadmin', 'owner'].includes(userRole ?? '') && (
            <ActionButton text="Exports" url="/hq" icon={exportsIcon} />
          )}
        </div>
      </div>
    </>
  );
}
