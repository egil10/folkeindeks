import Sidebar from "./Sidebar";

export default function StockDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-8">
      <Sidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
