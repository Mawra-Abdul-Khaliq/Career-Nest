"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { useAuth } from "../context/auth-context"
import { Menu, X, User, LogOut, Briefcase, BookmarkCheck, FileText, Settings, LayoutDashboard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown"
import { ModeToggle } from "../components/mode-toggle"
import React from "react"

export function MainNav() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/jobs",
      label: "Find Jobs",
      active: pathname === "/jobs" || pathname.startsWith("/jobs/"),
    },
    {
      href: "/companies",
      label: "Companies",
      active: pathname === "/companies" || pathname.startsWith("/companies/"),
    },
    {
      href: "/resources",
      label: "Resources",
      active: pathname === "/resources" || pathname.startsWith("/resources/"),
    },
  ]

  const userRoutes =
    user?.role === "employer"
      ? [
          {
            href: "/employer/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
          },
          {
            href: "/employer/jobs",
            label: "Manage Jobs",
            icon: <Briefcase className="mr-2 h-4 w-4" />,
          },
          {
            href: "/employer/applications",
            label: "Applications",
            icon: <FileText className="mr-2 h-4 w-4" />,
          },
        ]
      : user?.role === "admin"
        ? [
            {
              href: "/admin/dashboard",
              label: "Dashboard",
              icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            },
            {
              href: "/admin/jobs",
              label: "Manage Jobs",
              icon: <Briefcase className="mr-2 h-4 w-4" />,
            },
            {
              href: "/admin/users",
              label: "Manage Users",
              icon: <User className="mr-2 h-4 w-4" />,
            },
          ]
        : [
            {
              href: "/dashboard",
              label: "Dashboard",
              icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            },
            {
              href: "/applications",
              label: "My Applications",
              icon: <FileText className="mr-2 h-4 w-4" />,
            },
            {
              href: "/saved-jobs",
              label: "Saved Jobs",
              icon: <BookmarkCheck className="mr-2 h-4 w-4" />,
            },
          ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-xl">CareerConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userRoutes.map((route) => (
                  <DropdownMenuItem key={route.href} asChild>
                    <Link href={route.href} className="flex cursor-pointer items-center">
                      {route.icon}
                      {route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
          <Button variant="ghost" className="md:hidden" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <nav className="grid gap-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-2 py-1.5 text-sm rounded-md",
                    route.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
            {!user && (
              <div className="grid gap-2 pt-2 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
