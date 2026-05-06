import { forwardRef } from "react";

export const Input = forwardRef(
  (
    { label, error, required = false, className = "", type = "text", ...props },
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
        <input
          ref={ref}
          type={type}
          className={`input-field ${error ? "input-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
