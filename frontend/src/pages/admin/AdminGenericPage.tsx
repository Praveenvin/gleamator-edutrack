import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { useEffect } from "react";

const AdminGenericPage = ({ title }: { title: string }) => {

  useEffect(() => {
    console.log(`${title} page loaded`);
  }, [title]);

  return (
    <AdminDashboardLayout>

      <h1 className="text-2xl font-semibold text-foreground mb-6">
        {title}
      </h1>

      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">
          This section is under development. Check back soon.
        </p>
      </div>

    </AdminDashboardLayout>
  );
};

export default AdminGenericPage;