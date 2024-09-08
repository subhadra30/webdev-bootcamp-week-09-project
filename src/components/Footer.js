import Link from "next/link";
export default function Footer() {
  return (
    <div className="footercontainer">
      <Link href="/about">About us</Link>
      <Link href="/Contact">Contact</Link>
    </div>
  );
}
