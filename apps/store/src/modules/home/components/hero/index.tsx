import { Heading } from "@medusajs/ui";

const Hero = () => (
  <div className="border-ui-border-base bg-ui-bg-subtle relative h-[75vh] w-full border-b">
    <div className="small:p-32 absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 text-center">
      <span>
        <Heading
          level="h1"
          className="text-ui-fg-base text-3xl leading-10 font-normal"
        >
          Ecommerce Starter Template
        </Heading>
        <Heading
          level="h2"
          className="text-ui-fg-subtle text-3xl leading-10 font-normal"
        >
          with payloadcms and medusa
        </Heading>
      </span>
    </div>
  </div>
);

export default Hero;
