import { FlickeringGrid } from "@paydusa/design-system/components/flickeringPatterns/flickeringDots";
import { cn } from "@paydusa/design-system/lib/utils";
import type { Page } from "@payload-types";
import React from "react";

import RichText from "@/components/RichText";

type FlickeringImpactHeroType =
  | {
      children?: React.ReactNode;
      richText?: never;
    }
  | (Omit<Page["hero"], "richText"> & {
      children?: never;
      richText?: Page["hero"]["richText"];
    });

export const FlickeringImpactHero: React.FC<FlickeringImpactHeroType> = ({
  children,
  richText,
}) => (
  <div className="fading-border-t relative h-fit min-h-[42rem] overflow-hidden">
    <div className="container flex flex-col">
      <div className="fading-border-b absolute inset-x-0 z-0">
        <FlickeringGrid
          className={cn(
            "h-full w-full",
            "[mask-image:linear-gradient(to_right,transparent_0%,transparent_30%,white_50%),linear-gradient(to_bottom,transparent_0%,white_20%,white_80%,transparent_100%)] [mask-composite:intersect]"
          )}
          color="#60A5FA"
          maxOpacity={0.3}
          flickerChance={0.2}
          height={400}
          width={typeof window === "undefined" ? 1920 : window.innerWidth}
        />
      </div>
      <div className="absolute inset-y-0 z-10 mt-4 md:mt-18">
        <div className="font-hero max-w-[35rem] py-16 text-left">
          {children ||
            (richText && (
              <RichText
                data={richText}
                enableGutter={false}
                className="center-elem w-full flex-col items-start text-left text-2xl"
              />
            ))}
        </div>
        <div className="flex w-full items-center justify-start">
          <button className="fading-border relative p-6 shadow-md">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  </div>
);
