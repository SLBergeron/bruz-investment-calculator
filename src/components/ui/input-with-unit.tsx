import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Label } from "./label"

export interface InputWithUnitProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  unit?: string
  error?: string
  helperText?: string
}

const InputWithUnit = React.forwardRef<HTMLInputElement, InputWithUnitProps>(
  ({ className, label, unit, error, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className={cn("text-sm font-medium", error && "text-destructive")}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            className={cn(
              unit && "pr-12",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          {unit && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-muted-foreground font-medium">
                {unit}
              </span>
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
InputWithUnit.displayName = "InputWithUnit"

export { InputWithUnit }