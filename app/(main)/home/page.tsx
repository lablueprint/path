import ActionButton from '@/app/(main)/home/components/ActionButton';
import { createClient } from '@/app/lib/supabase/server-client';
import DonateIcon from '@/public/donate.svg';
import HomeIcon from '@/public/home.svg';
import InventoryIcon from '@/public/inventory.svg';
import PieIcon from '@/public/pie.svg';
import { Col, Container, Row } from 'react-bootstrap';


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
      <h1 style={{marginBottom: '4rem'}}>Home</h1>
      <Container>
        <Row className="g-5 mb-4">
          <Col xs={"auto"}>
            <ActionButton text="Donate" url="/home/donate" icon={DonateIcon}/>
          </Col>

          <Col xs={"auto"}>
            {['requestor', 'admin', 'superadmin', 'owner'].includes(
              userRole ?? '',
            ) && <ActionButton text="Request Inventory" url="/request" icon={InventoryIcon}/>}
          </Col>
        </Row>

        <Row className="g-5">
          <Col xs={"auto"}>
            {['admin', 'superadmin', 'owner'].includes(userRole ?? '') && (
              <ActionButton text="Manage Inventory" url="/manage" icon={HomeIcon}/>
            )}
          </Col>
          <Col xs={"auto"}>
            {['superadmin', 'owner'].includes(userRole ?? '') && (
              <ActionButton text="HQ" url="/hq" icon={PieIcon}/>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
