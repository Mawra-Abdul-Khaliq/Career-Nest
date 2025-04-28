import Link from "next/link"
import { Button } from "../components/ui/button"
import { MainNav } from "../components/main-nav"
import { Footer } from "../components/footer"
import { ArrowRight, Briefcase, Building, GraduationCap, Search } from "lucide-react"
import React from "react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 gradient-bg text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Launch Your Career with Confidence
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  CareerConnect helps fresh graduates find their dream jobs. Browse opportunities, apply with ease, and
                  track your applications all in one place.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href="/jobs">Find Jobs</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-lg overflow-hidden shadow-xl">
                  <img
                    src="/job_search img.jpg"
                    alt="Job seekers looking at opportunities"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Search Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find Your Perfect Job</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse thousands of job opportunities tailored for fresh graduates
                </p>
              </div>
              <div className="w-full max-w-3xl space-y-2">
                <form className="flex w-full max-w-3xl items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search jobs, companies, or keywords..."
                      className="w-full bg-background py-2 pl-10 pr-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" size="lg">
                    Search
                  </Button>
                </form>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/jobs?category=technology" className="text-sm text-muted-foreground hover:text-primary">
                    Technology
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/jobs?category=marketing" className="text-sm text-muted-foreground hover:text-primary">
                    Marketing
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/jobs?category=finance" className="text-sm text-muted-foreground hover:text-primary">
                    Finance
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/jobs?category=design" className="text-sm text-muted-foreground hover:text-primary">
                    Design
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/jobs?category=engineering" className="text-sm text-muted-foreground hover:text-primary">
                    Engineering
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Opportunities</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore top jobs from leading companies
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Job Card 1 */}
              <div className="group relative flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all job-card-hover">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">Tech Solutions Inc.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    We are looking for a skilled Frontend Developer to join our team.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                    Full-time
                  </span>
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                    New York, NY
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium">$70,000 - $90,000</p>
                  <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                    View Job <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Job Card 2 */}
              <div className="group relative flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all job-card-hover">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Backend Developer</h3>
                    <p className="text-sm text-muted-foreground">Tech Solutions Inc.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    We are looking for a skilled Backend Developer to join our team.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                    Full-time
                  </span>
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                    San Francisco, CA
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium">$80,000 - $100,000</p>
                  <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                    View Job <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Job Card 3 */}
              <div className="group relative flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all job-card-hover">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">UI/UX Designer</h3>
                    <p className="text-sm text-muted-foreground">Design Studio</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    We are looking for a creative UI/UX Designer to join our team.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-teal-100 text-teal-800 border-teal-200">
                    Remote
                  </span>
                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                    Anywhere
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium">$60,000 - $80,000</p>
                  <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                    View Job <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose CareerConnect</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We make job hunting easier for fresh graduates
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Job Matching</h3>
                <p className="text-muted-foreground">
                  Our intelligent algorithm matches your skills and preferences with the perfect job opportunities.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fresh Graduate Focused</h3>
                <p className="text-muted-foreground">
                  Specially curated opportunities for those just starting their professional journey.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Application Tracking</h3>
                <p className="text-muted-foreground">
                  Keep track of all your job applications in one place with real-time status updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Leading Companies</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of employers who find top talent through our platform
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="h-12 w-24 bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground font-medium">Company {i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Your Career Journey?</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create your account today and take the first step towards your dream job
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">Sign Up Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
