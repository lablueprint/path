import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <Link href="/home/donate">
        <p>Submit gift-in-kind form</p>
      </Link>
    </>
  );
}
