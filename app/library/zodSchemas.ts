import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const onboardingSchema = z.object({
    fullName: z.string().min(3).max(255),
    userName: z.string()
                .min(3)
                .max(255)
                .regex(/^[a-zA-Z0-9-]+$/
                , "Usernames must contain only lowercase letters, UPPERCASE letters, numbers and - !"),
});

export function onboardingSchemaValidation(options?: {
    isUsernameUnique: () => Promise<boolean>;
}){
    return z.object({
        userName: z.string()
                    .min(3)
                    .max(255)
                    .regex(/^[a-zA-Z0-9-]+$/, "Usernames must contain only lowercase letters, UPPERCASE letters, numbers and - !")
                    .pipe(z.string().superRefine((_, ctx) => {
                        if(typeof options?.isUsernameUnique !== "function"){
                            ctx.addIssue({
                                code: "custom",
                                message: conformZodMessage.VALIDATION_UNDEFINED,
                                fatal: true,
                            });

                            return;
                            }
                
                        return options.isUsernameUnique().then((isUnique) => {
                            if(!isUnique){
                                ctx.addIssue({
                                    code: "custom",
                                    message: "Username is already used",
                                });
                            }
                        });
                    })
                    ),
        fullName: z.string().min(3).max(255),
    })
}

export const settingSchema = z.object({
    fullName: z.string()
                .min(3)
                .max(255),

    profileImage: z.string()
})
 