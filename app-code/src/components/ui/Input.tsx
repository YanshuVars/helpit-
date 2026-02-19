"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, leftIcon, rightIcon, fullWidth = true, ...props }, ref) => {
        return (
            <div className={`${fullWidth ? "w-full" : ""} flex flex-col gap-1.5`}>
                {label && (
                    <label className="text-sm font-medium text-gray-700 ml-1">
                        {label}
                    </label>
                )}

                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={`
                            h-11 w-full rounded-xl border bg-white/50 backdrop-blur-sm px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]
                            disabled:cursor-not-allowed disabled:opacity-50
                            ${leftIcon ? "pl-10" : ""}
                            ${rightIcon ? "pr-10" : ""}
                            ${error
                                ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                                : "border-gray-200 hover:border-gray-300"
                            }
                            ${className}
                        `}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-red-500 ml-1 animate-slideDown">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
