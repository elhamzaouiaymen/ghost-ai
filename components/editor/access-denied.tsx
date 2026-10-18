import Link from "next/link"
import { Lock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Lock className="size-8 text-copy-muted" />
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium text-copy-primary">Access denied</p>
        <p className="text-sm text-copy-muted">
          This project doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
      </div>
      <Link href="/editor" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Back to editor
      </Link>
    </div>
  )
}
