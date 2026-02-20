"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/api/users";
import { AnimatePresence, motion } from "framer-motion";

/* ── Nav item types ── */
interface NavItem {
    icon: string;
    label: string;
    href: string;
    badge?: number;
}

interface NavGroup {
    label?: string;
    items: NavItem[];
}

/* ── Role-specific navigation definitions ── */
const ngoNav: NavGroup[] = [
    {
        items: [
            { icon: "dashboard", label: "Dashboard", href: "/ngo" },
            { icon: "assignment", label: "Requests", href: "/ngo/requests" },
            { icon: "group", label: "Volunteers", href: "/ngo/volunteers" },
            { icon: "event", label: "Events", href: "/ngo/events" },
            { icon: "volunteer_activism", label: "Donations", href: "/ngo/donations" },
            { icon: "edit_note", label: "Posts", href: "/ngo/posts" },
            { icon: "inventory_2", label: "Resources", href: "/ngo/resources" },
        ],
    },
    {
        label: "SETTINGS",
        items: [
            { icon: "settings", label: "Organization Settings", href: "/ngo/settings" },
            { icon: "people", label: "Members", href: "/ngo/settings/members" },
            { icon: "monitoring", label: "Audit Log", href: "/ngo/settings/audit" },
        ],
    },
];

const donorNav: NavGroup[] = [
    {
        items: [
            { icon: "dashboard", label: "Dashboard", href: "/donor" },
            { icon: "search", label: "Discover NGOs", href: "/donor/discover" },
            { icon: "credit_card", label: "Make a Donation", href: "/donor/donate" },
            { icon: "history", label: "Donation History", href: "/donor/history" },
            { icon: "receipt_long", label: "Receipts", href: "/donor/receipts" },
        ],
    },
];

const volunteerNav: NavGroup[] = [
    {
        items: [
            { icon: "dashboard", label: "Dashboard", href: "/volunteer" },
            { icon: "assignment_turned_in", label: "My Assignments", href: "/volunteer/assignments" },
            { icon: "explore", label: "Opportunities", href: "/volunteer/opportunities" },
            { icon: "map", label: "Map View", href: "/volunteer/opportunities/map" },
            { icon: "person", label: "My Profile", href: "/volunteer/profile" },
        ],
    },
];

const adminNav: NavGroup[] = [
    {
        items: [
            { icon: "dashboard", label: "Dashboard", href: "/admin" },
            { icon: "group", label: "Users", href: "/admin/users" },
            { icon: "corporate_fare", label: "NGOs", href: "/admin/ngos" },
            { icon: "flag", label: "Reports", href: "/admin/reports" },
            { icon: "receipt_long", label: "Audit Logs", href: "/admin/audit-logs" },
        ],
    },
];

const roleNavMap: Record<string, NavGroup[]> = {
    ngo: ngoNav,
    donor: donorNav,
    volunteer: volunteerNav,
    admin: adminNav,
};

/* ── Detect role from pathname ── */
function detectRole(pathname: string): string {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/ngo")) return "ngo";
    if (pathname.startsWith("/donor")) return "donor";
    if (pathname.startsWith("/volunteer")) return "volunteer";
    return "ngo"; // default
}

/* ── Sidebar Props ── */
interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const role = detectRole(pathname);
    const navGroups = roleNavMap[role] || ngoNav;

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/auth/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    /* Close mobile drawer on route change */
    useEffect(() => {
        onMobileClose();
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    function isActive(href: string): boolean {
        if (href === `/${role}`) return pathname === href;
        return pathname === href || pathname.startsWith(href + "/");
    }

    /* ── Sidebar content (shared between desktop & mobile) ── */
    const sidebarContent = (
        <div className="sidebar-inner">
            {/* Brand / Org */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">H</div>
                {!collapsed && (
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-name">Helpit</span>
                        <span className="material-symbols-outlined sidebar-brand-chevron">expand_more</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navGroups.map((group, gi) => (
                    <div key={gi} className="sidebar-group">
                        {group.label && !collapsed && (
                            <div className="sidebar-group-label">{group.label}</div>
                        )}
                        {group.items.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <span
                                        className="material-symbols-outlined sidebar-nav-icon"
                                        style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                                    >
                                        {item.icon}
                                    </span>
                                    {!collapsed && (
                                        <>
                                            <span className="sidebar-nav-label">{item.label}</span>
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <span className="sidebar-badge">{item.badge}</span>
                                            )}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User profile at bottom */}
            <div className="sidebar-user">
                <div className="sidebar-user-avatar">
                    <span className="sidebar-user-initial">U</span>
                    <span className="sidebar-online-dot" />
                </div>
                {!collapsed && (
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">User</span>
                        <span className="sidebar-user-role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                    </div>
                )}
            </div>

            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="sidebar-nav-item"
                title={collapsed ? "Log out" : undefined}
                style={{
                    width: '100%', border: 'none', cursor: 'pointer',
                    color: 'var(--color-danger, #E53935)',
                    background: 'transparent',
                    marginTop: 4, marginBottom: 8,
                }}
            >
                <span className="material-symbols-outlined sidebar-nav-icon" style={{ color: 'var(--color-danger, #E53935)' }}>logout</span>
                {!collapsed && <span className="sidebar-nav-label" style={{ color: 'var(--color-danger, #E53935)' }}>Log Out</span>}
            </button>
        </div>
    );

    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <aside
                className={`sidebar-desktop ${collapsed ? "collapsed" : ""}`}
            >
                {sidebarContent}

                {/* Collapse toggle */}
                <button
                    className="sidebar-collapse-toggle"
                    onClick={onToggle}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                        {collapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>
            </aside>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className="sidebar-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={onMobileClose}
                        />
                        <motion.aside
                            className="sidebar-mobile"
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ duration: 0.28, ease: "easeInOut" }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default Sidebar;
