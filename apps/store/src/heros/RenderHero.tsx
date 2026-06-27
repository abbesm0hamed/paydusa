import type { Page } from "@payload-types";
import React from "react";

import { FlickeringImpactHero } from "@/heros/FlickeringImpact";
import { HighImpactHero } from "@/heros/HighImpact";
import { LowImpactHero } from "@/heros/LowImpact";
import { MediumImpactHero } from "@/heros/MediumImpact";

const heroes = {
  flickeringImpact: FlickeringImpactHero,
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
};

export const RenderHero: React.FC<Page["hero"]> = (props) => {
  const { type } = props || {};

  if (!type || type === "none") return null;

  const HeroToRender = heroes[type];

  if (!HeroToRender) return null;

  return <HeroToRender {...props} />;
};
