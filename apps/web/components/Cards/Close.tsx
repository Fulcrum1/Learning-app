"use client"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"


export default function Close() {
    const router = useRouter()
    return (
        <X onClick={() => {router.push("/lists")}} className="cursor-pointer" />
    )
}