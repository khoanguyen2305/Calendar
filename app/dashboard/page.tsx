import { requireUser } from "../library/hooks"


export default async function DashboardPage(){
    const session = await requireUser();

    return (
        <div>
            <h1>Dashboard Page</h1>
        </div>
    )
}