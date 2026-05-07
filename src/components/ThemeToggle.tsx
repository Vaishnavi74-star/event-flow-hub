import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-secondary/30" disabled>
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-9 h-9 rounded-full bg-secondary/30 hover:bg-secondary/50 glow-border-hover transition-premium"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'} text-yellow-500`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'} text-neon-purple`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
