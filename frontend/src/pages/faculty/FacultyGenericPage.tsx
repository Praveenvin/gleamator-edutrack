import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";

const FacultyGenericPage = ({ title }: { title: string }) => (
  <FacultyDashboardLayout>
    <h1 className="text-2xl font-semibold text-foreground mb-6">{title}</h1>
    <div className="bg-card rounded-lg border border-border p-6">
      <p className="text-muted-foreground">This section is under development. Check back soon.</p>
    </div>
  </FacultyDashboardLayout>
);

export default FacultyGenericPage;
