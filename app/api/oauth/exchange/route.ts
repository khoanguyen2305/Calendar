import prisma from "@/app/library/db";
import { requireUser } from "@/app/library/hooks";
import { nylas, nylasConfig } from "@/app/library/nylas";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await requireUser();

    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if(!code){
        return Response.json("Hey we did not get a code",{
            status: 400,
        });
    }

    try {
        const response = await nylas.auth.exchangeCodeForToken({
            clientSecret: nylasConfig.apiKey,
            clientId: nylasConfig.clientId,
            redirectUri: nylasConfig.redirectUri,
            code: code,
        });

        const { grantId, email} = response;

        await prisma.user.update({
            where: {
                id:session.user?.id
            },
            data: {
                grandId: grantId,
                GrantEmail: email,
            }
        })
    } catch (error) {
        console.log("Error something went wrong", error);
    }

    return redirect("/dashboard");
}