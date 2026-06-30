import * as React from "react"
import { Check, ChevronsUpDown, X, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          className="flex w-full items-center justify-between gap-2 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer h-auto min-h-11 py-2 px-3 border-2 border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-foreground"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((value) => (
                <Badge
                  variant="secondary"
                  key={value}
                  className="mr-1 mb-1 bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(value)
                  }}
                >
                  {options.find((o) => o.value === value)?.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(value)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUnselect(value)
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1 bg-card rounded-b-md">
          {filteredOptions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No options found
            </div>
          )}
          {filteredOptions.map((option) => {
            const isSelected = selected.includes(option.value)
            return (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  isSelected ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-accent hover:text-accent-foreground text-foreground"
                )}
                onClick={() => {
                  if (isSelected) {
                    onChange(selected.filter((s) => s !== option.value))
                  } else {
                    onChange([...selected, option.value])
                  }
                  setSearch("")
                }}
              >
                <div className={cn(
                  "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary",
                  isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                )}>
                  {isSelected && <Check className="h-3 w-3" />}
                </div>
                <span className="truncate">{option.label}</span>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
