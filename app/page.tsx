import { Navbar } from "./components/Navbar";
import { auth } from "./library/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if(session?.user){
    return redirect("/dashboard");
  }

  return (
    <div className="max-w-100 mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar/>
    </div>
  );
}
