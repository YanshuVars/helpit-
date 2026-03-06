"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/api/users";

/* ── Breadcrumb generation from pathname ── */
function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];

    let acc = "";
    for (const seg of segments) {
        acc += `/${seg}`;
        // Skip dynamic segments like [id]
        if (seg.startsWith("[")) continue;
        // Prettify labels
        const label = seg
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        crumbs.push({ label, href: acc });
    }

    return crumbs;
}

/* ── Get page title from pathname ── */
function getPageTitle(pathname: string): string {
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] || "Dashboard";
    if (last.startsWith("[")) {
        const prev = segments[segments.length - 2] || "Detail";
        return prev.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Props ── */
interface PageHeaderProps {
    onMenuClick: () => void;
    actionButton?: {
        label: string;
        icon?: string;
        onClick: () => void;
    };
}

export function PageHeader({ onMenuClick, actionButton }: PageHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const breadcrumbs = generateBreadcrumbs(pathname);
    const pageTitle = getPageTitle(pathname);

    // Derive role prefix from current path for role-aware navigation
    const rolePrefix = pathname.startsWith('/volunteer') ? '/volunteer'
        : pathname.startsWith('/donor') ? '/donor'
            : pathname.startsWith('/ngo') ? '/ngo'
                : pathname.startsWith('/admin') ? '/admin'
                    : '';

    const [searchFocused, setSearchFocused] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    /* Fetch current user's name and avatar */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) return;

                const { data: userData } = await supabase
                    .from('users')
                    .select('full_name, avatar_url')
                    .eq('id', session.user.id)
                    .single();

                if (userData) {
                    setUserName(userData.full_name || '');
                    setUserAvatar(userData.avatar_url || null);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    /* Close user menu on click outside */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="page-header">
            {/* Left side */}
            <div className="page-header-left">
                {/* Mobile hamburger */}
                <button className="page-header-menu-btn" onClick={onMenuClick} aria-label="Menu">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                {/* Breadcrumbs */}
                <nav className="page-header-breadcrumbs" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, i) => (
                        <span key={crumb.href}>
                            {i > 0 && <span className="breadcrumb-separator">/</span>}
                            {i === breadcrumbs.length - 1 ? (
                                <span className="breadcrumb-current">{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className="breadcrumb-link">
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>

                {/* Page title */}
                <h1 className="page-header-title">{pageTitle}</h1>
            </div>

            {/* Right side */}
            <div className="page-header-right">
                {/* Search */}
                <div className={`page-header-search ${searchFocused ? "focused" : ""}`}>
                    <span className="material-symbols-outlined page-header-search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="page-header-search-input"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                </div>

                {/* Notifications */}
                <Link href={`${rolePrefix}/notifications`} className="page-header-icon-btn" aria-label="Notifications">
                    <span className="material-symbols-outlined">notifications</span>
                    {/* Unread dot — toggle with data */}
                    <span className="notification-dot" />
                </Link>

                {/* Messages */}
                <Link href={`${rolePrefix}/messages`} className="page-header-icon-btn" aria-label="Messages">
                    <span className="material-symbols-outlined">chat_bubble</span>
                </Link>

                {/* User avatar */}
                <div className="page-header-user" ref={menuRef}>
                    <button
                        className="page-header-avatar-btn"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        aria-label="User menu"
                    >
                        <div className="page-header-avatar">
                            <span>{userName ? userName.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                        <div className="page-header-dropdown animate-dropdown-in">
                            <Link href={`${rolePrefix}/profile`} className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                <span className="material-symbols-outlined">person</span>
                                My Profile
                            </Link>
                            <Link href={`${rolePrefix}/settings`} className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                <span className="material-symbols-outlined">settings</span>
                                Settings
                            </Link>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item dropdown-item-danger" onClick={() => { setUserMenuOpen(false); handleLogout(); }}>
                                <span className="material-symbols-outlined">logout</span>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

                {/* Primary action button (optional) */}
                {actionButton && (
                    <button className="btn btn-primary" onClick={actionButton.onClick}>
                        {actionButton.icon && (
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                {actionButton.icon}
                            </span>
                        )}
                        {actionButton.label}
                    </button>
                )}
            </div>
        </header>
    );
}

export default PageHeader;
