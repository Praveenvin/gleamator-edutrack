import { FacultyDashboardLayout } from "@/components/FacultyDashboardLayout";
import { Wrench } from "lucide-react";

const FacultyGenericPage = ({ title }: { title: string }) => (

  <FacultyDashboardLayout>

    <h1 className="text-2xl font-semibold text-foreground mb-6">
      {title}
    </h1>

    <div className="bg-card rounded-lg border border-border p-10 flex flex-col items-center justify-center text-center">

      <Wrench className="h-10 w-10 text-muted-foreground mb-4"/>

      <p className="text-muted-foreground">
        This section is under development. Check back soon.
      </p>

    </div>

  </FacultyDashboardLayout>

);

export default FacultyGenericPage;