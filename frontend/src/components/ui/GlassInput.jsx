import React from "react";

export const GlassInput = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      rightElement,
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 pointer-events-none text-[var(--text-muted)] text-base">
              <Icon />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              glass-input
              w-full py-3 px-4 text-sm font-normal
              ${Icon ? "pl-10" : "pl-4"}
              ${rightElement ? "pr-11" : "pr-4"}
              ${error ? "!border-red-400 !focus:border-red-500 !focus:ring-red-400/20" : ""}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-[var(--text-muted)]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[var(--text-muted)] pl-1">{helperText}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

export default GlassInput;
