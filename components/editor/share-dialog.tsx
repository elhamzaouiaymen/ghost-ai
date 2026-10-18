"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserCircle, X, Link, Check, Loader2 } from "lucide-react"

interface Collaborator {
  email: string
  name: string | null
  avatar: string | null
}

interface ShareDialogProps {
  projectId: string
  isOwner: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({ projectId, isOwner, open, onOpenChange }: ShareDialogProps) {
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([])
  const [loading, setLoading] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [isInviting, setIsInviting] = React.useState(false)
  const [removingEmail, setRemovingEmail] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/projects/${projectId}/collaborators`)
      .then((r) => r.json())
      .then((data) => setCollaborators(data.collaborators ?? []))
      .catch(() => setCollaborators([]))
      .finally(() => setLoading(false))
  }, [open, projectId])

  async function handleInvite() {
    if (!inviteEmail.trim() || isInviting) return
    setIsInviting(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })
      if (!res.ok) return
      const collab: Collaborator = await res.json()
      setCollaborators((prev) =>
        prev.some((c) => c.email === collab.email) ? prev : [...prev, collab]
      )
      setInviteEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email)
    try {
      await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setCollaborators((prev) => prev.filter((c) => c.email !== email))
    } finally {
      setRemovingEmail(null)
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
        </DialogHeader>

        {isOwner && (
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Invite by email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || isInviting}
              className="shrink-0 bg-accent-cyan text-[var(--bg-base)] hover:bg-accent-cyan/80"
            >
              {isInviting ? <Loader2 className="size-4 animate-spin" /> : "Invite"}
            </Button>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-copy-muted">
            Collaborators
          </p>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="size-4 animate-spin text-copy-muted" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-copy-muted">No collaborators yet</p>
          ) : (
            <ScrollArea className="max-h-48">
              <div className="space-y-0.5 pr-3">
                {collaborators.map((collab) => (
                  <div
                    key={collab.email}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5"
                  >
                    {collab.avatar ? (
                      // eslint-disable-next-line @next/next-image-prefer-image
                      <img
                        src={collab.avatar}
                        alt=""
                        className="size-6 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="size-6 shrink-0 text-copy-muted" />
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      {collab.name && (
                        <span className="truncate text-sm text-copy-primary">{collab.name}</span>
                      )}
                      <span className="truncate text-xs text-copy-muted">{collab.email}</span>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemove(collab.email)}
                        disabled={removingEmail === collab.email}
                        aria-label={`Remove ${collab.email}`}
                      >
                        {removingEmail === collab.email ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <X className="size-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {isOwner && (
          <div className="border-t border-border-default pt-3">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="w-full">
              {copied ? (
                <>
                  <Check className="mr-1.5 size-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Link className="mr-1.5 size-3.5" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
