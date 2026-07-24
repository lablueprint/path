import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="gap-container standalone-page-container">
      <h1>Authentication Link Expired</h1>
      <p>
        This verification link is invalid, incomplete, or has already been used.
        For security, email links are only valid for a limited time.
      </p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
