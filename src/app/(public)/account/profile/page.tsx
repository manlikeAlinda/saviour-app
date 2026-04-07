"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronRight, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Profile { fullName: string; email: string; phone: string | null }

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/account/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/v1/account/profile")
      .then((r) => r.json())
      .then((p: Profile) => {
        setProfile(p);
        setForm((f) => ({ ...f, fullName: p.fullName, phone: p.phone ?? "" }));
      });
  }, [status]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const body: Record<string, string> = { fullName: form.fullName, phone: form.phone };
    if (form.newPassword && form.currentPassword) {
      body.currentPassword = form.currentPassword;
      body.newPassword = form.newPassword;
    }
    const res = await fetch("/api/v1/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated: Profile = await res.json();
      setProfile(updated);
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
      setMessage("Profile updated successfully.");
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Update failed.");
    }
    setSaving(false);
  }

  if (status === "loading" || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-gray-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black font-bold">Profile</span>
          </nav>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <User className="h-6 w-6 text-green-600" />
          <h1 className="text-3xl font-bold text-black tracking-tighter">My Profile</h1>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 text-sm font-mono">
          <Link href="/account/orders" className="text-gray-500 hover:text-black transition-colors">Orders</Link>
          <Link href="/account/wishlist" className="text-gray-500 hover:text-black transition-colors">Wishlist</Link>
          <span className="text-green-700 font-bold">Profile</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="ml-auto text-red-400 hover:text-red-600 transition-colors">Sign Out</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled className="bg-gray-50 text-gray-400" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>

          <div className="border-t border-gray-200 pt-5 space-y-4">
            <p className="text-sm font-bold text-gray-700">Change Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></p>
            <div className="space-y-2">
              <Label htmlFor="currentPw">Current Password</Label>
              <Input id="currentPw" type="password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPw">New Password</Label>
              <Input id="newPw" type="password" value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} minLength={6} />
            </div>
          </div>

          {message && <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>{message}</p>}

          <Button type="submit" disabled={saving} className="w-full bg-black text-white hover:bg-gray-900 font-bold">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
