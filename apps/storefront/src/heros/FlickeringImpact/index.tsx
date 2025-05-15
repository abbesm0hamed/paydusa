import React from 'react';
import type { Page } from '@/payload-types';
import RichText from '@/components/RichText';
import { FlickeringGrid } from '@repo/design-system/components/ui/flickeringPatterns/flickeringDots';
import { cn } from '@repo/design-system/lib/utils';

type FlickeringImpactHeroType =
  | {
      children?: React.ReactNode;
      richText?: never;
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never;
      richText?: Page['hero']['richText'];
    });

export const FlickeringImpactHero: React.FC<FlickeringImpactHeroType> = ({
  children,
  richText,
}) => {
  return (
    <div className="relative overflow-hidden min-h-[42rem] h-fit fading-border-t">
      <div className="flex flex-col container">
        <div className="absolute inset-x-0 z-0 fading-border-b">
          <FlickeringGrid
            className={cn(
              'w-full h-full',
              '[mask-image:linear-gradient(to_right,transparent_0%,transparent_30%,white_50%),linear-gradient(to_bottom,transparent_0%,white_20%,white_80%,transparent_100%)] [mask-composite:intersect]'
            )}
            color="#60A5FA"
            maxOpacity={0.3}
            flickerChance={0.2}
            height={400}
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
          />
        </div>
        <div className="absolute inset-y-0 z-10 mt-4 md:mt-18">
          <div className="max-w-[35rem] py-16 font-hero text-left">
            {children ||
              (richText && (
                <RichText
                  data={richText}
                  enableGutter={false}
                  className="center-elem flex-col items-start text-left w-full text-2xl"
                />
              ))}
          </div>
          <div className="flex justify-start items-center w-full">
            <button className="fading-border relative p-6 shadow-md">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
