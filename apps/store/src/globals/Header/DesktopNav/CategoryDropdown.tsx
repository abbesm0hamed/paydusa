"use client";

import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import { ChevronDownMini } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const CategoryTreeItem = ({
  category,
  depth,
  close,
}: {
  category: HttpTypes.StoreProductCategory;
  depth: number;
  close: () => void;
}) => {
  const hasChildren =
    category.category_children && category.category_children.length > 0;

  return (
    <div>
      <LocalizedClientLink
        href={`/categories/${category.handle}`}
        className={`flex items-center justify-between px-4 py-2 txt-xsmall-plus hover:bg-accent hover:text-foreground ${
          depth === 0 ? "text-muted-foreground" : "text-muted-foreground/70"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={close}
      >
        <span>{category.name}</span>
        {hasChildren && (
          <ChevronDownMini className="w-3 h-3 -rotate-90 text-muted-foreground/50 shrink-0" />
        )}
      </LocalizedClientLink>

      {hasChildren && (
        <div>
          {category.category_children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              depth={depth + 1}
              close={close}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryDropdown = ({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[];
}) => {
  const topLevelCategories = categories.filter(
    (category) => !category.parent_category
  );

  if (topLevelCategories.length === 0) {
    return null;
  }

  return (
    <Popover className="relative h-full flex">
      {({ open, close }) => (
        <>
          <Popover.Button className="relative h-full flex items-center gap-x-1 txt-xsmall-plus text-muted-foreground hover:text-foreground focus:outline-none">
            Categories
            <ChevronDownMini className="w-3 h-3" />
          </Popover.Button>

          <Transition
            show={open}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <PopoverPanel className="absolute top-full left-0 bg-background border border-border shadow-lg min-w-[220px] z-50">
              <div className="py-1">
                {topLevelCategories.map((category) => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    depth={0}
                    close={close}
                  />
                ))}
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export { CategoryDropdown };
