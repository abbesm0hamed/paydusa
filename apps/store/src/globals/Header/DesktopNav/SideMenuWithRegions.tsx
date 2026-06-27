import { listRegions } from "@lib/data/regions";
import type { StoreRegion } from "@medusajs/types";
import SideMenu from "@modules/layout/components/side-menu";

export async function SideMenuWithRegions() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions);

  return <SideMenu regions={regions} />;
}
