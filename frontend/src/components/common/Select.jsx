import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export const Select = forwardRef(
  (
    {
      label,
      error,
      required = false,
      options = [],
      placeholder = "Pilih...",
      className = "",
      ...props
    },
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
        <div className="relative">
          <select
            ref={ref}
            className={`input-field appearance-none pr-10 ${error ? "input-error" : ""} ${className}`}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
