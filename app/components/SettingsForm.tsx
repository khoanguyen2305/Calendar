"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButton";
import { useActionState, useState } from "react";
import { SettingsAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingSchema } from "../library/zodSchemas";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UploadDropzone } from "../library/uploadthing";
import clsx from "clsx";
import { toast } from "sonner";

interface iAppProps {
    fullName: string;
    email: string;
    profileImage: string;
}

export function SettingsForm({email, fullName, profileImage}: iAppProps){
    const [lastResult, formAction] = useActionState(SettingsAction, undefined);
    const [currentPrifileImage, setCurrentProfileImage] = useState(profileImage);
    const [form, fields] = useForm({
            lastResult,
    
            onValidate({ formData }){
                return parseWithZod (formData, {
                    schema: settingSchema,
                });
            },
    
            shouldValidate: "onBlur",
            shouldRevalidate: "onInput"
        });

    const handleDeleteImage = () => {
        setCurrentProfileImage("");
    };

    return(
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings!</CardDescription>
            </CardHeader>

            <form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate>
                <CardContent className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                        <Label>Full Name</Label>
                        <Input name={fields.fullName.name} key={fields.fullName.key} defaultValue={fullName} placeholder="Gemeni"/>
                        <p className="text-sm text-red-500">{fields.fullName.errors}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Email</Label>
                        <Input defaultValue={email} placeholder="gemini@gmail.com"/>
                    </div>
                    <div className="grid gap-y-5">
                        <Label>Profile Image</Label>
                        <Input type="hidden" name={fields.profileImage.name} key={fields.profileImage.key} value={currentPrifileImage}/>
                        {currentPrifileImage ? (
                            <div className="relative size-16">
                                <img src={currentPrifileImage} alt="Profile Image" className="size-16 rounded-lg"/>

                                <Button onClick={handleDeleteImage} variant="destructive" size="icon" className="absolute -top-3 -right-3">
                                    <X className="size-16"/>
                                </Button>
                            </div>
                        ): (
                            <UploadDropzone onClientUploadComplete={(res) => {
                                setCurrentProfileImage(res[0].url);
                                toast.success("Profile Image has been uploaded");
                            }}
                            onUploadError={(error) => {
                                console.log("Something went wrong", error);
                                toast.error(error.message);
                            }}
                            endpoint="imageUploader"/>
                        )}
                        <p className="text-sm text-red-500">{fields.profileImage.errors}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Save Changes"/>
                </CardFooter>
            </form>
        </Card>
    )
    
}