"use server"

import prisma from "./library/db";
import { requireUser } from "./library/hooks";
import { parseWithZod } from '@conform-to/zod';
import { onboardingSchemaValidation, settingSchema } from "./library/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function OnboardingAction(prevState: any, formData: FormData ){ 
    const session = await requireUser();

    const submission =  await parseWithZod(formData, {
        schema: onboardingSchemaValidation({
            async isUsernameUnique() {
                const exisitingUsername = await prisma.user.findUnique({
                    where: {
                        userName: formData.get('userName') as string,
                    },
                });   

                return !exisitingUsername;
            }, 
        }),

        async: true,
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            userName: submission.value.userName,
            name: submission.value.fullName,
            availability: {
                createMany: {
                    data: [
                        {
                            day: "Monday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Tuesday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Wednesday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Thursday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Friday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Saturday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                        {
                            day: "Sunday",
                            fromTime: "08:00",
                            tillTime: "18:00",
                        },
                    ]
                }
            }
        }
    })

    return redirect("/onboarding/grant-id");
}

export async function SettingsAction(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: settingSchema,
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            name: submission.value.fullName,
            image: submission.value.profileImage,
        },
    });

    return redirect("/dashboard");
}

export async function updateAvailabilityAction(formData: FormData) {
    const session = await requireUser();

    const rawData = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawData).filter((key) => key.startsWith("id-")).map((key) => {
        const id = key.replace("id-", "");

        return {
            id,
            isActive: rawData[`isActive-${id}`] === "on",
            fromTime: rawData[`fromTime-${id}`] as string,
            tillTime: rawData[`tillTime-${id}`] as string,
        }
    });

    try {
        await prisma.$transaction(availabilityData.map((item) => prisma.availability.update({
            where: {
                id: item.id
            },
            data: {
                isActive: item.isActive,
                fromTime: item.fromTime,
                tillTime: item.tillTime,
            }
        })));
        revalidatePath("/dashboard/availability")
    }
    catch (error){
        console.log(error);
    }
}

