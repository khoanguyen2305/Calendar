import Link from "next/link";
import Image from "next/image"
import Logo from "@/public/logo.png"
import { Button } from "@/components/ui/button";
import { AuthModal } from "./AuthModal";

export function Navbar(){
    return (
        <div className="flex py-5 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-1">
                <Image src={Logo} alt="Logo" className="size-10"/>
                <h4 className="text-2xl font-semibold text-blue-500">Calendar</h4>
            </Link>
            <AuthModal/>
        </div>
    )
}