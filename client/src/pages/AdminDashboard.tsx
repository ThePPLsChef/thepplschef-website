/**
 * AdminDashboard — Brand-styled admin panel for The PPL's Chef.
 * Auth: password gate only (no Manus OAuth required).
 * The x-admin-token header is injected by main.tsx from sessionStorage.
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ClipboardList,
  Eye,
  ArrowLeft,
  RefreshCw,
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  ChefHat,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  LogOut,
} from "lucide-react";

const SESSION_KEY = "pplschef_admin_token";

const fontBody = { fontFamily: "var(--font-body)" };
const fontDisplay = { fontFamily: "var(--font-display)" };

type InquiryStatus = "new" | "reviewed" | "quoted" | "booked" | "cancelled";

const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; color: string; bg: string; icon: typeof AlertCircle }
> = {
  new: { label: "New", color: "text-[#ECA241]", bg: "bg-[#ECA241]/10 border-[#ECA241]/30", icon: AlertCircle },
  reviewed: { label: "Reviewed", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", icon: Eye },
  quoted: { label: "Quoted", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30", icon: FileText },
  booked: { label: "Booked", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: XCircle },
};

function StatusBadge({ status }: { status: InquiryStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider uppercase border ${config.bg} ${config.color}`}
      style={fontBody}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.reload();
}

export default function AdminDashboard() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ChefHat size={28} className="text-[#ECA241]" />
            <div>
              <h1 className="text-[#F3F1E9] text-lg" style={fontDisplay}>
                The PPL's <span className="text-[#D82E2B]">Chef</span>
              </h1>
              <p
                className="text-[#F3F1E9]/30 text-[10px] tracking-[0.2em] uppercase"
                style={fontBody}
              >
                Admin Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-[#ECA241]/60 hover:text-[#ECA241] text-xs tracking-wider uppercase transition-colors"
              style={fontBody}
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#F3F1E9]/40 hover:text-[#D82E2B] text-xs tracking-wider uppercase transition-colors"
              style={fontBody}
              title="Log out of admin"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === "list" ? (
          <InquiryListView
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectInquiry={(id) => {
              setSelectedId(id);
              setView("detail");
            }}
          />
        ) : (
          <InquiryDetailView
            inquiryId={selectedId!}
            onBack={() => setView("list")}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Stats Cards ─── */
function StatsCards() {
  const { data: stats, isLoading } = trpc.inquiry.stats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-20 mb-3" />
            <div className="h-8 bg-white/5 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Inquiries", value: stats?.total ?? 0, icon: ClipboardList, color: "text-[#ECA241]" },
    { label: "New", value: stats?.newCount ?? 0, icon: AlertCircle, color: "text-[#ECA241]" },
    { label: "This Week", value: stats?.thisWeek ?? 0, icon: Calendar, color: "text-blue-400" },
    { label: "Booked", value: stats?.byStatus?.booked ?? 0, icon: CheckCircle2, color: "text-green-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#0a0a0a] border border-white/5 p-6 hover:border-[#ECA241]/20 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[#F3F1E9]/40 text-[10px] tracking-wider uppercase"
              style={fontBody}
            >
              {card.label}
            </span>
            <card.icon size={16} className={card.color} />
          </div>
          <div className="text-3xl text-[#F3F1E9] font-bold" style={fontDisplay}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Inquiry List View ─── */
function InquiryListView({
  statusFilter,
  setStatusFilter,
  onSelectInquiry,
}: {
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onSelectInquiry: (id: number) => void;
}) {
  const { data: inquiries, isLoading, refetch, error } = trpc.inquiry.list.useQuery();

  const filtered = useMemo(() => {
    if (!inquiries) return [];
    if (statusFilter === "all") return inquiries;
    return inquiries.filter((i) => i.status === statusFilter);
  }, [inquiries, statusFilter]);

  if (error) {
    return (
      <div className="text-center py-20 bg-[#0a0a0a] border border-white/5">
        <XCircle size={48} className="text-[#D82E2B]/40 mx-auto mb-4" />
        <p className="text-[#F3F1E9]/50 text-sm mb-2" style={fontBody}>
          Failed to load inquiries.
        </p>
        <p className="text-[#F3F1E9]/30 text-xs" style={fontBody}>
          {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-[#ECA241] text-black text-xs font-bold tracking-wider uppercase"
          style={fontBody}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <StatsCards />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-xl text-[#F3F1E9]" style={fontDisplay}>
          Inquiries
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1">
            {["all", "new", "reviewed", "quoted", "booked", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[10px] tracking-wider uppercase font-semibold transition-all duration-200 ${
                  statusFilter === s
                    ? "bg-[#ECA241] text-black"
                    : "bg-[#0a0a0a] text-[#F3F1E9]/40 border border-white/5 hover:border-[#ECA241]/30 hover:text-[#F3F1E9]/70"
                }`}
                style={fontBody}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 bg-[#0a0a0a] border border-white/5 text-[#F3F1E9]/40 hover:text-[#ECA241] hover:border-[#ECA241]/30 transition-all"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#ECA241]" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0a0a] border border-white/5">
          <ClipboardList size={48} className="text-[#F3F1E9]/10 mx-auto mb-4" />
          <p className="text-[#F3F1E9]/30 text-sm" style={fontBody}>
            {statusFilter === "all" ? "No inquiries yet." : `No ${statusFilter} inquiries.`}
          </p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Submitted", "Name", "Email", "Phone", "Service", "Event Date", "Guests", "Budget", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase font-semibold whitespace-nowrap"
                        style={fontBody}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => onSelectInquiry(inq.id)}
                  >
                    <td className="px-4 py-4 text-[#F3F1E9]/50 text-xs whitespace-nowrap" style={fontBody}>
                      {new Date(inq.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-[#F3F1E9] text-sm font-medium whitespace-nowrap" style={fontBody}>
                      {inq.name}
                    </td>
                    <td className="px-4 py-4 text-[#F3F1E9]/60 text-xs" style={fontBody}>
                      {inq.email}
                    </td>
                    <td className="px-4 py-4 text-[#F3F1E9]/50 text-xs whitespace-nowrap" style={fontBody}>
                      {inq.phone || "—"}
                    </td>
                    <td className="px-4 py-4 text-[#ECA241]/70 text-xs whitespace-nowrap" style={fontBody}>
                      {inq.serviceTypeName || "—"}
                    </td>
                    <td className="px-4 py-4 text-[#F3F1E9]/50 text-xs whitespace-nowrap" style={fontBody}>
                      {inq.eventDate || "—"}
                    </td>
                    <td className="px-4 py-4 text-[#F3F1E9]/50 text-xs" style={fontBody}>
                      {inq.guestCount || "—"}
                    </td>
                    <td className="px-4 py-4 text-[#F3F1E9]/50 text-xs whitespace-nowrap" style={fontBody}>
                      {inq.budget || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={inq.status as InquiryStatus} />
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-[#ECA241]/40 hover:text-[#ECA241] transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Inquiry Detail View ─── */
function InquiryDetailView({
  inquiryId,
  onBack,
}: {
  inquiryId: number;
  onBack: () => void;
}) {
  const { data: inquiry, isLoading, refetch } = trpc.inquiry.detail.useQuery({ id: inquiryId });
  const utils = trpc.useUtils();

  const updateStatusMutation = trpc.inquiry.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
      utils.inquiry.list.invalidate();
      utils.inquiry.stats.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  if (isLoading || !inquiry) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#ECA241]" size={32} />
      </div>
    );
  }

  const detailRows = [
    { icon: Mail, label: "Email", value: inquiry.email },
    { icon: Phone, label: "Phone", value: inquiry.phone },
    { icon: ClipboardList, label: "Service Type", value: inquiry.serviceTypeName },
    { icon: Calendar, label: "Event Date", value: inquiry.eventDate },
    { icon: Clock, label: "Event Time", value: inquiry.eventTime },
    { icon: MapPin, label: "Location", value: inquiry.location },
    { icon: Users, label: "Guest Count", value: inquiry.guestCount },
    { icon: DollarSign, label: "Budget", value: inquiry.budget },
    { icon: ChefHat, label: "Food Preferences", value: inquiry.foodPreferences },
    { icon: AlertCircle, label: "Allergies", value: inquiry.allergies },
  ];

  const statuses: InquiryStatus[] = ["new", "reviewed", "quoted", "booked", "cancelled"];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#ECA241]/60 hover:text-[#ECA241] text-xs tracking-wider uppercase mb-6 transition-colors"
        style={fontBody}
      >
        <ArrowLeft size={14} /> Back to Inquiries
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-[#F3F1E9] mb-1" style={fontDisplay}>
                  {inquiry.name}
                </h2>
                <p className="text-[#F3F1E9]/40 text-xs" style={fontBody}>
                  Submitted{" "}
                  {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(inquiry.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <StatusBadge status={inquiry.status as InquiryStatus} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {detailRows.map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <row.icon size={16} className="text-[#ECA241]/40 mt-0.5 flex-shrink-0" />
                  <div>
                    <div
                      className="text-[#F3F1E9]/30 text-[10px] tracking-wider uppercase"
                      style={fontBody}
                    >
                      {row.label}
                    </div>
                    <div className="text-[#F3F1E9] text-sm" style={fontBody}>
                      {row.value || "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {inquiry.notes && (
            <div className="bg-[#0a0a0a] border border-white/5 p-8">
              <h3
                className="text-[#ECA241] text-[10px] tracking-wider uppercase font-semibold mb-4"
                style={fontBody}
              >
                Notes / Special Requests
              </h3>
              <p
                className="text-[#F3F1E9]/70 text-sm leading-relaxed whitespace-pre-wrap"
                style={fontBody}
              >
                {inquiry.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 p-6">
            <h3
              className="text-[#ECA241] text-[10px] tracking-wider uppercase font-semibold mb-4"
              style={fontBody}
            >
              Update Status
            </h3>
            <div className="space-y-2">
              {statuses.map((s) => {
                const config = STATUS_CONFIG[s];
                const isCurrent = inquiry.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      if (!isCurrent) updateStatusMutation.mutate({ id: inquiryId, status: s });
                    }}
                    disabled={isCurrent || updateStatusMutation.isPending}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-200 ${
                      isCurrent
                        ? `${config.bg} ${config.color} border`
                        : "bg-transparent border border-white/5 text-[#F3F1E9]/40 hover:border-[#ECA241]/30 hover:text-[#F3F1E9]/70"
                    } disabled:cursor-default`}
                    style={fontBody}
                  >
                    <config.icon size={14} />
                    <span className="tracking-wider uppercase text-xs font-semibold">
                      {config.label}
                    </span>
                    {isCurrent && (
                      <span className="ml-auto text-[10px] opacity-60">Current</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 p-6">
            <h3
              className="text-[#ECA241] text-[10px] tracking-wider uppercase font-semibold mb-4"
              style={fontBody}
            >
              Quick Actions
            </h3>
            <div className="space-y-2">
              <a
                href={`mailto:${inquiry.email}?subject=Your Inquiry with The PPL's Chef&body=Hi ${inquiry.name},%0A%0AThank you for your inquiry with The PPL's Chef!%0A%0A`}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[#D82E2B] text-white text-xs tracking-wider uppercase font-semibold hover:bg-[#ECA241] hover:text-black transition-all duration-300"
                style={fontBody}
              >
                <Mail size={14} /> Reply via Email
              </a>
              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-white/10 text-[#F3F1E9]/60 text-xs tracking-wider uppercase font-semibold hover:border-[#ECA241]/30 hover:text-[#ECA241] transition-all duration-300"
                  style={fontBody}
                >
                  <Phone size={14} /> Call {inquiry.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
