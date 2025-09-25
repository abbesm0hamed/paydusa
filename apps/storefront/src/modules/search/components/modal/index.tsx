"use client"

import React, { useEffect, useState, useRef } from "react"
import { Hits, InstantSearch, SearchBox, useSearchBox } from "react-instantsearch"
import { searchClient } from "../../../../lib/config"
import Modal from "../../../common/components/modal"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Hit = {
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

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const pathname = usePathname()
  const [previousPathname, setPreviousPathname] = useState(pathname)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (pathname !== previousPathname && isOpen) {
      onClose()
      setPreviousPathname(pathname)
    }
  }, [pathname, previousPathname, isOpen, onClose])

  // Auto-focus the search input when modal opens and restore previous value
  useEffect(() => {
    if (isOpen) {
      const focusInput = () => {
        const searchInput = document.querySelector('.ais-SearchBox-input') as HTMLInputElement
        if (searchInput) {
          if (searchQuery) {
            searchInput.value = searchQuery
            const event = new Event('input', { bubbles: true })
            searchInput.dispatchEvent(event)
          }
          searchInput.focus()
        } else {
          requestAnimationFrame(() => {
            const retryInput = document.querySelector('.ais-SearchBox-input') as HTMLInputElement
            if (retryInput) {
              if (searchQuery) {
                retryInput.value = searchQuery
                const event = new Event('input', { bubbles: true })
                retryInput.dispatchEvent(event)
              }
              retryInput.focus()
            }
          })
        }
      }
      
      requestAnimationFrame(focusInput)
    }
  }, [isOpen, searchQuery])

  // Save search query when user types
  useEffect(() => {
    if (isOpen) {
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement
        if (target.classList.contains('ais-SearchBox-input')) {
          setSearchQuery(target.value)
        }
      }

      document.addEventListener('input', handleInput)
      return () => document.removeEventListener('input', handleInput)
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} close={onClose} search={true}>
      <div className="bg-white rounded-lg shadow-xl border border-ui-border-base max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="border-b border-ui-border-base p-4">
          <h2 className="text-lg font-medium text-ui-fg-base">Search Products</h2>
        </div>
        
        {/* Search Content */}
        <div className="p-4">
          <InstantSearch 
            searchClient={searchClient} 
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME}
          >
            <div className="mb-4">
              <SearchBox 
                className="w-full"
                classNames={{
                  root: "relative",
                  form: "relative",
                  input: "w-full px-4 py-3 border border-ui-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive focus:border-transparent text-ui-fg-base placeholder-ui-fg-muted",
                  submit: "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-ui-fg-muted hover:text-ui-fg-base",
                  reset: "absolute right-8 top-1/2 transform -translate-y-1/2 p-1 text-ui-fg-muted hover:text-ui-fg-base"
                }}
                placeholder="Search for products..."
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <Hits 
                hitComponent={(props) => <Hit hit={props.hit as unknown as Hit} onClose={onClose} />}
                classNames={{
                  root: "space-y-2",
                  list: "space-y-2",
                  item: ""
                }}
              />
            </div>
          </InstantSearch>
        </div>
      </div>
    </Modal>
  )
}

const Hit = ({ hit, onClose }: { hit: Hit; onClose: () => void }) => {
  const hasValidThumbnail = hit.thumbnail && hit.thumbnail.trim() !== ""
  
  return (
    <div className="relative p-3 border border-ui-border-base rounded hover:bg-ui-bg-subtle">
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
          <div className="w-[60px] h-[60px] bg-ui-bg-subtle rounded flex items-center justify-center">
            <span className="text-ui-fg-muted text-xs">No Image</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-ui-fg-base truncate">
            {hit.title}
          </h3>
          <p className="text-xs text-ui-fg-muted mt-1 line-clamp-2">
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
  )
}
