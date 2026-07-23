import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="gap-container not-found-container">
      <h1>Not Found</h1>
      <p>Could not find requested resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
