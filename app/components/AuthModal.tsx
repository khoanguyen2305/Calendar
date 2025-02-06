import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import Logo from '@/public/logo.png';
import { signIn } from "../library/auth";
import { GithubAuthButton, GoogleAuthButton } from "./SubmitButton";

export function AuthModal(){
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button>Try for free</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center justify-center gap-1">
                        <Image src={Logo} alt="Logo" className="size-10"/>
                        <span className="text-2xl font-semibold text-primary">Calendar</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col mt-5 gap-3">
                    <form action={async() => {
                        "use server"
                        await signIn("google")
                    }} className="w-full">
                        <GoogleAuthButton/>
                    </form>
                    <form action={async() => {
                        "use server"
                        await signIn("github")
                    }} className="w-full">
                        <GithubAuthButton/>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}