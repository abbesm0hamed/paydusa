import { Text } from "@medusajs/ui";

import Medusa from "@/modules/common/icons/medusa";
import NextJs from "@/modules/common/icons/nextjs";
import PayloadCMS from "@/modules/common/icons/payloadcms";

const MedusaCTA = () => (
  <Text className="txt-compact-small-plus flex items-center gap-x-2">
    Powered by
    <a href="https://www.medusajs.com" target="_blank" rel="noreferrer">
      <Medusa fill="#9ca3af" className="fill-[#9ca3af]" />
    </a>
    &
    <a href="https://payloadcms.dev" target="_blank" rel="noreferrer">
      <PayloadCMS fill="#9ca3af" />
    </a>
    &
    <a href="https://nextjs.org" target="_blank" rel="noreferrer">
      <NextJs fill="#9ca3af" />
    </a>
  </Text>
);

export default MedusaCTA;
