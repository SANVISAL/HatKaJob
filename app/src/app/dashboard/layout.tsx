import { SideNav } from "../../components/organisms/dashboard/sidenav";
import axios from "axios";
import { cookies } from "next/headers";

async function getProfileCompany() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  const sigSession = cookieStore.get("session.sig");

  try {
    const response = await axios.get(
      "http://localhost:4000/v1/companies/profile",
      {
        withCredentials: true, // Include cookies if needed!
        headers: {
          Cookie: ` ${session!.name}=${session!.value}; ${sigSession!.name}=${
            sigSession!.value
          }`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(`getProfileCompany() Method error: `, error);
    return undefined;
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const result = await getProfileCompany();
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav companyProfile={result} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

