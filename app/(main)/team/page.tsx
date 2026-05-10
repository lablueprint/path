import Link from 'next/link';
import ViewToggle from '../components/ViewToggle';

export default async function TeamPage() {
  return (
    <div>
      <h1>Team</h1>
      <Link href="/team/people">People</Link>
      <br />
      <Link href="/team/store-admins">Store Admins</Link>
    </div>
  );
}
