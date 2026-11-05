"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Hits, InstantSearch, SearchBox } from "react-instantsearch";

import { searchClient } from "../../../../lib/config";
import Modal from "../../../common/components/modal";

interface SearchHit {
  objectID: string;
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Hit = ({ hit, onClose }: { hit: SearchHit; onClose: () => void }) => {
  const hasValidThumbnail = hit.thumbnail && hit.thumbnail.trim() !== "";

  return (
    <div className="border-ui-border-base hover:bg-ui-bg-subtle relative rounded border p-3">
      <div className="flex gap-3">
        {hasValidThumbnail ? (
          <Image
            src={hit.thumbnail}
            alt={hit.title}
            width={60}
            height={60}
            className="rounded object-cover"
          />
        ) : (
          <div className="bg-ui-bg-subtle flex h-[60px] w-[60px] items-center justify-center rounded">
            <span className="text-ui-fg-muted text-xs">No Image</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-ui-fg-base truncate text-sm font-medium">
            {hit.title}
          </h3>
          <p className="text-ui-fg-muted mt-1 line-clamp-2 text-xs">
            {hit.description}
          </p>
        </div>
      </div>
      <Link
        href={`/products/${hit.handle}`}
        className="absolute inset-0"
        aria-label={`View Product: ${hit.title}`}
        onClick={() => onClose()}
      />
    </div>
  );
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (pathname !== previousPathname && isOpen) {
      onClose();
      setPreviousPathname(pathname);
    }
  }, [pathname, previousPathname, isOpen, onClose]);

  // Auto-focus the search input when modal opens and restore previous value
  useEffect(() => {
    if (isOpen) {
      const focusInput = () => {
        const searchInput = document.querySelector(
          ".ais-SearchBox-input"
        ) as HTMLInputElement;
        if (searchInput) {
          if (searchQuery) {
            searchInput.value = searchQuery;
            const event = new Event("input", { bubbles: true });
            searchInput.dispatchEvent(event);
          }
          searchInput.focus();
        } else {
          requestAnimationFrame(() => {
            const retryInput = document.querySelector(
              ".ais-SearchBox-input"
            ) as HTMLInputElement;
            if (retryInput) {
              if (searchQuery) {
                retryInput.value = searchQuery;
                const event = new Event("input", { bubbles: true });
                retryInput.dispatchEvent(event);
              }
              retryInput.focus();
            }
          });
        }
      };

      requestAnimationFrame(focusInput);
    }
  }, [isOpen, searchQuery]);

  // Save search query when user types
  useEffect(() => {
    if (isOpen) {
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.classList.contains("ais-SearchBox-input")) {
          setSearchQuery(target.value);
        }
      };

      document.addEventListener("input", handleInput);
      return () => document.removeEventListener("input", handleInput);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} close={onClose} search={true}>
      <div className="border-ui-border-base mx-auto w-full max-w-2xl rounded-lg border bg-white shadow-xl">
        {/* Header */}
        <div className="border-ui-border-base border-b p-4">
          <h2 className="text-ui-fg-base text-lg font-medium">
            Search Products
          </h2>
        </div>

        {/* Search Content */}
        <div className="p-4">
          {/* Local UI identifier; Medusa selects the actual search index. */}
          <InstantSearch searchClient={searchClient} indexName="products">
            <div className="mb-4">
              <SearchBox
                className="w-full"
                classNames={{
                  form: "relative",
                  input:
                    "w-full px-4 py-3 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive focus:border-transparent text-ui-fg-base placeholder-ui-fg-muted",
                  reset:
                    "absolute right-8 top-1/2 transform -translate-y-1/2 p-1 text-ui-fg-muted hover:text-ui-fg-base",
                  root: "relative",
                  submit:
                    "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-ui-fg-muted hover:text-ui-fg-base",
                }}
                placeholder="Search for products..."
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Hits
                hitComponent={(props) => (
                  <Hit
                    hit={props.hit as unknown as SearchHit}
                    onClose={onClose}
                  />
                )}
                classNames={{
                  item: "",
                  list: "space-y-2",
                  root: "space-y-2",
                }}
              />
            </div>
          </InstantSearch>
        </div>
      </div>
    </Modal>
  );
}
