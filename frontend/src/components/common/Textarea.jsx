import { forwardRef } from "react";

export const Textarea = forwardRef(
  (
    { label, error, required = false, rows = 4, className = "", ...props },
    ref,
  ) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="label">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`input-field resize-none ${error ? "input-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
