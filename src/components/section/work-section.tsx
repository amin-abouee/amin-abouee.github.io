/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DATA } from "@/data/resume";
import VideoGallery from "@/components/video-gallery";
import InlineVideo from "@/components/inline-video";

function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
      onError={() => setImageError(true)}
    />
  );
}

export default function WorkSection() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full grid gap-6"
    >
      {DATA.work.map((work) => (
        <AccordionItem
          key={work.company}
          value={work.company}
          className="w-full border-b-0 grid gap-2"
        >
          <AccordionTrigger className="hover:no-underline p-0 cursor-pointer transition-colors rounded-none group [&>svg]:hidden">
            <div className="flex items-center gap-x-3 justify-between w-full text-left">
              <div className="flex items-center gap-x-3 flex-1 min-w-0">
                <LogoImage src={work.logoUrl} alt={work.company} />
                <div className="flex-1 min-w-0 gap-0.5 flex flex-col">
                  <div className="font-semibold leading-none flex items-center gap-2">
                    {work.company}
                  </div>
                  <div className="font-sans text-sm text-muted-foreground">
                    {work.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                <span>
                  {work.start} - {work.end ?? "Present"}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0 ml-13 flex flex-col gap-3 text-xs sm:text-sm text-muted-foreground">
            <p>{work.description}</p>
            {work.highlights.length > 0 && (
              <div className="flex flex-col gap-3">
                {work.highlights.map((highlight, index) => (
                  <div key={highlight.title} className="flex gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <h3 className="text-sm font-semibold">{highlight.title}</h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {highlight.description}
                      </p>
                      {highlight.src && (
                        <div className="mt-2">
                          <InlineVideo src={highlight.src} title={highlight.title} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {work.videos.length > 0 && <VideoGallery videos={work.videos} />}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

