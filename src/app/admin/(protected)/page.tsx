import Link from "next/link";
import { Package, MessageSquare, Tags, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const [
    totalProducts,
    activeProducts,
    totalInquiries,
    newInquiries,
    recentInquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { _count: { select: { items: true } } },
    }),
  ]);

  return { totalProducts, activeProducts, totalInquiries, newInquiries, recentInquiries };
}

const statusColors: Record<string, "default" | "warning" | "success" | "info" | "secondary" | "destructive"> = {
  new: "warning",
  contacted: "info",
  quoted: "info",
  awaiting_customer: "secondary",
  confirmed: "success",
  shipped: "success",
  completed: "default",
  cancelled: "destructive",
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  awaiting_customer: "Awaiting",
  confirmed: "Confirmed",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your store activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{data.totalProducts}</div>
              <Package className="h-8 w-8 text-gray-200" />
            </div>
            <p className="text-xs text-green-600 mt-1">{data.activeProducts} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900">{data.totalInquiries}</div>
              <MessageSquare className="h-8 w-8 text-gray-200" />
            </div>
            <p className="text-xs text-amber-600 mt-1">{data.newInquiries} new</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-amber-600">{data.newInquiries}</div>
              <AlertCircle className="h-8 w-8 text-amber-100" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-green-700">{data.activeProducts}</div>
              <TrendingUp className="h-8 w-8 text-gray-200" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Visible in store</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Add Product", href: "/admin/products/new", icon: Package, desc: "Add a new product to the catalog" },
          { label: "Manage Products", href: "/admin/products", icon: Tags, desc: "Edit, activate, or deactivate products" },
          { label: "View Inquiries", href: "/admin/inquiries", icon: MessageSquare, desc: "Review and update inquiry status" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-green-500 hover:shadow-sm transition-all"
          >
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
              <action.icon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{action.label}</div>
              <div className="text-xs text-gray-400">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Link href="/admin/inquiries" className="text-sm text-green-600 hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentInquiries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No inquiries yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 font-medium text-gray-500">Reference</th>
                    <th className="text-left py-2 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-2 font-medium text-gray-500 hidden sm:table-cell">Location</th>
                    <th className="text-left py-2 font-medium text-gray-500 hidden md:table-cell">Items</th>
                    <th className="text-left py-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-2 font-medium text-gray-500 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentInquiries.map((inq) => (
                    <tr key={inq.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5">
                        <Link href={`/admin/inquiries/${inq.id}`} className="text-green-600 hover:underline font-mono text-xs">
                          {inq.inquiryReference}
                        </Link>
                      </td>
                      <td className="py-2.5">
                        <div className="font-medium text-gray-900">{inq.customerName}</div>
                        <div className="text-xs text-gray-400">{inq.customerPhone}</div>
                      </td>
                      <td className="py-2.5 text-gray-600 hidden sm:table-cell">{inq.deliveryLocation}</td>
                      <td className="py-2.5 text-gray-600 hidden md:table-cell">{inq._count.items} item{inq._count.items !== 1 ? "s" : ""}</td>
                      <td className="py-2.5">
                        <Badge variant={statusColors[inq.status] || "secondary"}>
                          {statusLabels[inq.status] || inq.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-gray-400 text-xs hidden lg:table-cell">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
