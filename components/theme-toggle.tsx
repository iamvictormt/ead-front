'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { CustomButton } from '@/components/ui/custom-button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <CustomButton variant="ghost" size="sm" className="w-9 h-9 p-0">
        <Sun className="h-4 w-4" />
      </CustomButton>
    )
  }

  return (
    <CustomButton
      variant="ghost"
      size="sm"
      className="w-9 h-9 p-0 hover:bg-[#85E8EA]/10 "
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-gray-600" />
      ) : (
        <Sun className="h-4 w-4 text-gray-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </CustomButton>
  )
}