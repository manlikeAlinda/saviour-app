import { notFound } from "next/navigation";

// Homepage is served from app/page.tsx — this file should not be reached
export default function PublicGroupHomePage() {
  notFound();
}
