import Link from "next/link";

export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
}

