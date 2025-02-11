import { notFound } from "next/navigation";
import prisma from "../library/db";
import { requireUser } from "../library/hooks"
import { EmptyState } from "../components/EmptyState";

async function getData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            userName: true,
            eventType: {
                select: {
                    id: true,
                    active: true,
                    title: true,
                    url: true,
                    duration: true,
                },
            },
        },
    });

    if(!data) {
        return notFound();
    }

    return data;
}

export default async function DashboardPage(){
    const session = await requireUser();
    const data = await getData(session.user?.id as string)

    return (
        <>
        {data.eventType.length === 0 ? (
            <EmptyState/>
        ): (
            <p>We have event types</p>
        )}
        </>
    )
}