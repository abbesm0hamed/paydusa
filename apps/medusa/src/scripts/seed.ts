import type {
  CreateInventoryLevelInput,
  ExecArgs,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const europeanCountries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  const africanCountries = ["tn"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
          {
            currency_code: "tnd",
          },
        ],
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          countries: europeanCountries,
          currency_code: "eur",
          name: "Europe",
          payment_providers: ["pp_system_default"],
        },
        {
          countries: africanCountries,
          currency_code: "tnd",
          name: "Africa",
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const europeRegion = regionResult[0];
  const africaRegion = regionResult[1];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  const allCountries = [...europeanCountries, ...africanCountries];
  await createTaxRegionsWorkflow(container).run({
    input: allCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          address: {
            address_1: "",
            city: "Copenhagen",
            country_code: "DK",
          },
          name: "European Warehouse",
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const europeanFulfillmentSet =
    await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      service_zones: [
        {
          geo_zones: europeanCountries.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
          name: "Europe",
        },
      ],
      type: "shipping",
    });

  const africanFulfillmentSet =
    await fulfillmentModuleService.createFulfillmentSets({
      name: "African Warehouse delivery",
      service_zones: [
        {
          geo_zones: africanCountries.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
          name: "Africa",
        },
      ],
      type: "shipping",
    });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: europeanFulfillmentSet.id,
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: africanFulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        prices: [
          {
            amount: 10,
            currency_code: "usd",
          },
          {
            amount: 10,
            currency_code: "eur",
          },
          {
            amount: 10,
            region_id: europeRegion.id,
          },
        ],
        provider_id: "manual_manual",
        rules: [
          {
            attribute: "enabled_in_store",
            operator: "eq",
            value: "true",
          },
          {
            attribute: "is_return",
            operator: "eq",
            value: "false",
          },
        ],
        service_zone_id: europeanFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          code: "standard",
          description: "Ship in 2-3 days.",
          label: "Standard",
        },
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        prices: [
          {
            amount: 10,
            currency_code: "usd",
          },
          {
            amount: 10,
            currency_code: "eur",
          },
          {
            amount: 10,
            region_id: europeRegion.id,
          },
        ],
        provider_id: "manual_manual",
        rules: [
          {
            attribute: "enabled_in_store",
            operator: "eq",
            value: "true",
          },
          {
            attribute: "is_return",
            operator: "eq",
            value: "false",
          },
        ],
        service_zone_id: europeanFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          code: "express",
          description: "Ship in 24 hours.",
          label: "Express",
        },
      },
      {
        name: "Standard Shipping Africa",
        price_type: "flat",
        prices: [
          {
            amount: 15,
            currency_code: "tnd",
          },
          {
            amount: 15,
            currency_code: "eur",
          },
          {
            amount: 15,
            region_id: africaRegion.id,
          },
        ],
        provider_id: "manual_manual",
        rules: [
          {
            attribute: "enabled_in_store",
            operator: "eq",
            value: "true",
          },
          {
            attribute: "is_return",
            operator: "eq",
            value: "false",
          },
        ],
        service_zone_id: africanFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          code: "standard",
          description: "Ship in 5-7 days.",
          label: "Standard",
        },
      },
      {
        name: "Express Shipping Africa",
        price_type: "flat",
        prices: [
          {
            amount: 25,
            currency_code: "tnd",
          },
          {
            amount: 25,
            currency_code: "eur",
          },
          {
            amount: 25,
            region_id: africaRegion.id,
          },
        ],
        provider_id: "manual_manual",
        rules: [
          {
            attribute: "enabled_in_store",
            operator: "eq",
            value: "true",
          },
          {
            attribute: "is_return",
            operator: "eq",
            value: "false",
          },
        ],
        service_zone_id: africanFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          code: "express",
          description: "Ship in 2-3 days.",
          label: "Express",
        },
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      add: [defaultSalesChannel[0].id],
      id: stockLocation.id,
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          created_by: "",
          title: "Webshop",
          type: "publishable",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      add: [defaultSalesChannel[0].id],
      id: publishableApiKey.id,
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          is_active: true,
          name: "Shirts",
        },
        {
          is_active: true,
          name: "Sweatshirts",
        },
        {
          is_active: true,
          name: "Pants",
        },
        {
          is_active: true,
          name: "Merch",
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          category_ids: [
            categoryResult.find((cat) => cat.name === "Shirts")!.id,
          ],
          description:
            "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
          handle: "t-shirt",
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Color",
              values: ["Black", "White"],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
          shipping_profile_id: shippingProfile.id,
          status: ProductStatus.PUBLISHED,
          title: "Medusa T-Shirt",
          variants: [
            {
              options: {
                Color: "Black",
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-S-BLACK",
              title: "S / Black",
            },
            {
              options: {
                Color: "White",
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-S-WHITE",
              title: "S / White",
            },
            {
              options: {
                Color: "Black",
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-M-BLACK",
              title: "M / Black",
            },
            {
              options: {
                Color: "White",
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-M-WHITE",
              title: "M / White",
            },
            {
              options: {
                Color: "Black",
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-L-BLACK",
              title: "L / Black",
            },
            {
              options: {
                Color: "White",
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-L-WHITE",
              title: "L / White",
            },
            {
              options: {
                Color: "Black",
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-XL-BLACK",
              title: "XL / Black",
            },
            {
              options: {
                Color: "White",
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHIRT-XL-WHITE",
              title: "XL / White",
            },
          ],
          weight: 400,
        },
        {
          category_ids: [
            categoryResult.find((cat) => cat.name === "Sweatshirts")!.id,
          ],
          description:
            "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
          handle: "sweatshirt",
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
          shipping_profile_id: shippingProfile.id,
          status: ProductStatus.PUBLISHED,
          title: "Medusa Sweatshirt",
          variants: [
            {
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATSHIRT-S",
              title: "S",
            },
            {
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATSHIRT-M",
              title: "M",
            },
            {
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATSHIRT-L",
              title: "L",
            },
            {
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATSHIRT-XL",
              title: "XL",
            },
          ],
          weight: 400,
        },
        {
          category_ids: [
            categoryResult.find((cat) => cat.name === "Pants")!.id,
          ],
          description:
            "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
          handle: "sweatpants",
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
          shipping_profile_id: shippingProfile.id,
          status: ProductStatus.PUBLISHED,
          title: "Medusa Sweatpants",
          variants: [
            {
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATPANTS-S",
              title: "S",
            },
            {
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATPANTS-M",
              title: "M",
            },
            {
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATPANTS-L",
              title: "L",
            },
            {
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SWEATPANTS-XL",
              title: "XL",
            },
          ],
          weight: 400,
        },
        {
          category_ids: [
            categoryResult.find((cat) => cat.name === "Merch")!.id,
          ],
          description:
            "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
          handle: "shorts",
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["S", "M", "L", "XL"],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
          shipping_profile_id: shippingProfile.id,
          status: ProductStatus.PUBLISHED,
          title: "Medusa Shorts",
          variants: [
            {
              options: {
                Size: "S",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHORTS-S",
              title: "S",
            },
            {
              options: {
                Size: "M",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHORTS-M",
              title: "M",
            },
            {
              options: {
                Size: "L",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHORTS-L",
              title: "L",
            },
            {
              options: {
                Size: "XL",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "eur",
                },
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 35,
                  currency_code: "tnd",
                },
              ],
              sku: "SHORTS-XL",
              title: "XL",
            },
          ],
          weight: 400,
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      inventory_item_id: inventoryItem.id,
      location_id: stockLocation.id,
      stocked_quantity: 1_000_000,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
