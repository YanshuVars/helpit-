import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    icon,
    helperText,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={inputId} className="field-label">
                    {label}
                </label>
            )}
            <div style={{ position: "relative" }}>
                {icon && (
                    <span
                        className="material-symbols-outlined"
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: 16,
                            color: "var(--color-text-muted)",
                            pointerEvents: "none",
                        }}
                    >
                        {icon}
                    </span>
                )}
                <input
                    id={inputId}
                    className={`field-input ${error ? "error" : ""}`}
                    style={icon ? { paddingLeft: 36 } : undefined}
                    {...props}
                />
            </div>
            {error && <p className="field-error">{error}</p>}
            {helperText && !error && (
                <p className="caption" style={{ marginTop: 4 }}>{helperText}</p>
            )}
        </div>
    );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Textarea({
    label,
    error,
    helperText,
    className = "",
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={textareaId} className="field-label">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`field-input field-textarea ${error ? "error" : ""}`}
                {...props}
            />
            {error && <p className="field-error">{error}</p>}
            {helperText && !error && (
                <p className="caption" style={{ marginTop: 4 }}>{helperText}</p>
            )}
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export function Select({
    label,
    error,
    options,
    placeholder,
    className = "",
    id,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={selectId} className="field-label">
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`field-input ${error ? "error" : ""}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="field-error">{error}</p>}
        </div>
    );
}

export default Input;
