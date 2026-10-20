import { SideNav } from "../../components/organisms/dashboard/sidenav";
import { getCompanyProfile } from "@/lib/serverApi";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const result = await getCompanyProfile();
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav companyProfile={result} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

