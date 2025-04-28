import Link from "next/link"
import { Briefcase } from "lucide-react"
import React from "react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CareerConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground">Connecting fresh graduates with their dream careers.</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">For Job Seekers</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-muted-foreground hover:text-foreground">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-foreground">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="text-muted-foreground hover:text-foreground">
                  Saved Jobs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">For Employers</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/employer/jobs/post" className="text-muted-foreground hover:text-foreground">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="text-muted-foreground hover:text-foreground">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/employer/applications" className="text-muted-foreground hover:text-foreground">
                  Manage Applications
                </Link>
              </li>
              <li>
                <Link href="/employer/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
