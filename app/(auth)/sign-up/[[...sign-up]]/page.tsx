import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-full">
      {/* Left panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 border-r border-border-default">
        <div className="max-w-sm">
          <p className="text-2xl font-semibold text-copy-primary tracking-tight">
            ghost<span className="text-accent-cyan">.</span>ai
          </p>
          <p className="mt-3 text-copy-secondary">
            Describe your architecture in plain English. We build the diagram.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-copy-muted">
            <li>AI-generated system design diagrams</li>
            <li>Real-time collaborative canvas</li>
            <li>Export to Markdown technical specs</li>
          </ul>
        </div>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <SignUp />
      </div>
    </div>
  )
}
