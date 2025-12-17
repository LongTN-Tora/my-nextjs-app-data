import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to my Next.js App</h1>
      <p>This is a simple web application.</p>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <Link href="/about">Go to About Page</Link>
        <Link href="/powerapp">Power Apps Integration</Link>
      </div>
    </div>
  );
}
