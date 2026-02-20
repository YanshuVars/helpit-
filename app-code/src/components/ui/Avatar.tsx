import React from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: AvatarSize;
    online?: boolean;
    className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 64,
};

const fontSizeMap: Record<AvatarSize, number> = {
    sm: 10,
    md: 12,
    lg: 14,
    xl: 22,
};

/* Simple hash to pick a color from name */
function nameToColor(name: string): string {
    const colors = [
        "#6B3FA0", "#4F46E5", "#2563EB", "#0891B2",
        "#059669", "#D97706", "#DC2626", "#9333EA",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function Avatar({ src, name = "User", size = "md", online, className = "" }: AvatarProps) {
    const px = sizeMap[size];
    const fontSize = fontSizeMap[size];

    return (
        <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }} className={className}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={`avatar avatar-${size}`}
                    style={{ width: px, height: px }}
                />
            ) : (
                <div
                    className={`avatar avatar-${size} avatar-fallback`}
                    style={{
                        width: px,
                        height: px,
                        backgroundColor: nameToColor(name),
                        fontSize,
                        borderRadius: "50%",
                    }}
                >
                    {getInitials(name)}
                </div>
            )}
            {online && (
                <span
                    style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: size === "sm" ? 6 : 8,
                        height: size === "sm" ? 6 : 8,
                        borderRadius: "50%",
                        background: "var(--color-online)",
                        border: "2px solid var(--color-surface)",
                    }}
                />
            )}
        </div>
    );
}

export default Avatar;
