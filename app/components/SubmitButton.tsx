"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import GoogleLogo from "@/public/google.svg"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import GithubLogo from "@/public/github.svg"
import { cn } from "@/lib/utils"

interface iAppProps {
    text: string,
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    className?: string;
}

export function SubmitButton({text, variant, className}: iAppProps){
    const {pending} = useFormStatus();

    return (
        <>
        {pending? (
            <Button disabled variant="outline" className={cn("w-fit", className)}>
                <Loader2 className="size-3 mr-2 animate-spin"/> Please wait ...
            </Button>
        ): (
            <Button type="submit" variant={variant} className={cn("w-fit", className)}>{text}</Button>
        )}
        </>
    )
}

export function GoogleAuthButton(){
    const {pending} = useFormStatus()

    return(
        <>
        {pending? (
            <Button disabled variant="outline" className="w-full">
                <Loader2 className="size-3 mr-2 animate-spin"/> Please wait ...
            </Button>
        ): (
            <Button variant="outline" className="w-full">
                <Image src={GoogleLogo} alt="Google Logo" className="size-4 mr-1"/>
                Signin with Google
            </Button>
        )}
        </>
    )
}

export function GithubAuthButton(){
    const {pending} = useFormStatus()

    return(
        <>
        {pending? (
            <Button disabled variant="outline" className="w-full">
                <Loader2 className="size-3 mr-2 animate-spin"/> Please wait ...
            </Button>
        ): (
            <Button variant="outline" className="w-full">
                <Image src={GithubLogo} alt="Github Logo" className="size-4 mr-1"/>
                Signin with Github
            </Button>
        )}
        </>
    )
}