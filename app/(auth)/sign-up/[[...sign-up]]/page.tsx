import { SignUp } from "@clerk/nextjs"
import { Suspense } from "react"

export default function SignUpPage() {
  return (
    <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-border-default shadow-2xl">
      {/* Left panel — gradient, hidden on small screens */}
      <div
        className="relative hidden lg:flex lg:w-5/12 flex-col justify-between overflow-hidden p-8"
        style={{
          background:
            "linear-gradient(160deg, #080809 0%, #0b1120 25%, #001830 50%, #0d0520 75%, #080809 100%)",
        }}
      >
        {/* Color blobs */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 35%, rgba(0,200,212,0.35) 0%, transparent 55%), radial-gradient(ellipse at 75% 15%, rgba(139,92,246,0.45) 0%, transparent 50%), radial-gradient(ellipse at 55% 75%, rgba(6,182,212,0.2) 0%, transparent 45%), radial-gradient(ellipse at 85% 70%, rgba(168,85,247,0.3) 0%, transparent 40%)",
          }}
        />

        {/* Top label */}
        <p className="relative z-10 text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
          System Design AI
        </p>

        {/* Bottom text */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white">
            Build
            <br />
            Diagrams
            <br />
            Instantly
          </h2>
          <p className="mt-4 text-sm text-white/55">
            Turn your architecture ideas into clear, shareable system diagrams
            in seconds.
          </p>
        </div>
      </div>

      {/* Right panel — brand + Clerk form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-bg-surface px-8 py-12">
        <div className="mb-7">
          <p className="text-lg font-semibold tracking-tight text-copy-primary">
            ghost<span className="text-accent-cyan">.</span>ai
          </p>
        </div>
        <Suspense>
          <SignUp />
        </Suspense>
      </div>
    </div>
  )
}
