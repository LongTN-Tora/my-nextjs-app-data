import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1><b>Welcome to my Next.js App</b></h1>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <Link href="/about">Register Data Power Apps</Link>
        <Link href="/powerapp">List Data Power Apps</Link>
      </div>
    </div>
  );
}
