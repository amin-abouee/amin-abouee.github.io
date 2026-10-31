import Link from "next/link";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in Touch
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground text-balance">
          Have a question about SLAM, VIO or APEX Solver — or think we should work
          together? Send me an email and I&apos;ll respond whenever I can.
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-2">
          <Button asChild>
            <a href={`mailto:${DATA.contact.email}`}>
              <Mail className="size-4" /> Email me
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/Abouee.pdf" download>
              <Download className="size-4" /> Download CV
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
