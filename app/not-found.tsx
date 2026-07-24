import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="gap-container standalone-page-container">
      <h1>Not Found</h1>
      <p>The requested resource could not be found.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
