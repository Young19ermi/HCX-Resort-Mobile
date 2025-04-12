"use client"

import { Building, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"

export default function NavBar() {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-4 md:px-6 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        {isMobile ? (
          // Mobile layout
          <>
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Building className="h-5 w-5" />
              <span>HCX Resort</span>
            </div>
            <Button
              variant="outline"
              className="rounded-full bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              size="sm"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="text-sm">Room 304</span>
            </Button>
          </>
        ) : (
          // Desktop layout
          <>
            <div className="flex-1">{/* Empty space on the left */}</div>
            <div className="flex items-center justify-center flex-1">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Building className="h-5 w-5" />
                <span>HCX Resort</span>
              </div>
            </div>
            <div className="flex justify-end flex-1">
              <Button
                variant="outline"
                className="rounded-full bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Home className="h-4 w-4 mr-2" />
                Room 304
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
