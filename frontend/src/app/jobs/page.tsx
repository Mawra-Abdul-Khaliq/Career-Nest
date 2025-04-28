"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { Slider } from "../../components/ui/slider"
import { ArrowRight, Building, Filter, Loader2, MapPin, Search, X } from "lucide-react"
import { api } from "../../lib/api"
import { formatDate, formatSalary, getJobTypeColor } from "../../lib/utils"
import { useToast } from "../../components/ui/use-toast"

type Job = {
  _id: string
  title: string
  company: string
  location: string
  description: string
  salary: string
  jobType: string
  techStack: string[]
  experience: string
  applicationDeadline: string
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get("/jobs")
      setJobs(response.data.jobs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    // This would typically call the API with search parameters
    toast({
      title: "Search",
      description: `Searching for "${searchTerm}" in ${location || "all locations"}`,
    })
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchTerm
      ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesLocation = location ? job.location.toLowerCase().includes(location.toLowerCase()) : true

    const matchesJobType = jobType ? job.jobType === jobType : true

    return matchesSearch && matchesLocation && matchesJobType
  })

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Search Header */}
        <section className="w-full py-12 md:py-16 lg:py-20 gradient-bg text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find Your Dream Job</h1>
                <p className="max-w-[700px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Browse thousands of job opportunities tailored for fresh graduates
                </p>
              </div>
              <div className="w-full max-w-3xl space-y-2">
                <form onSubmit={handleSearch} className="flex w-full max-w-3xl items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
                    <input
                      type="search"
                      placeholder="Search jobs, companies, or keywords..."
                      className="w-full bg-white py-2 pl-10 pr-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full bg-white py-2 pl-10 pr-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="bg-white text-primary hover:bg-white/90">
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Listing */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Mobile Toggle */}
              <div className="md:hidden w-full">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </span>
                  {showFilters ? <X className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>

              {/* Filters Sidebar */}
              <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-1/4 lg:w-1/5 space-y-6`}>
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Job Type</h3>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`job-type-${type}`}
                          checked={jobType === type}
                          onCheckedChange={() => setJobType(jobType === type ? "" : type)}
                        />
                        <Label htmlFor={`job-type-${type}`} className="cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Experience Level</h3>
                  <div className="space-y-2">
                    {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={`exp-${level}`} />
                        <Label htmlFor={`exp-${level}`} className="cursor-pointer">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Salary Range</h3>
                  <div className="space-y-6">
                    <Slider defaultValue={[0, 100]} max={100} step={1} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$0</span>
                      <span className="text-sm">$100k+</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setJobType("")
                    setLocation("")
                    setSearchTerm("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>

              {/* Jobs List */}
              <div className="w-full md:w-3/4 lg:w-4/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {loading ? "Loading jobs..." : `${filteredJobs.length} Jobs Found`}
                  </h2>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                      <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <Link href={`/jobs/${job._id}`} key={job._id}>
                        <div className="group relative flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all job-card-hover">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span
                              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getJobTypeColor(job.jobType)}`}
                            >
                              {job.jobType}
                            </span>
                            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                              {job.location}
                            </span>
                            {job.techStack &&
                              job.techStack.slice(0, 2).map((tech) => (
                                <span
                                  key={tech}
                                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm font-medium">{formatSalary(job.salary)}</p>
                            <p className="text-sm text-muted-foreground">Posted {formatDate(job.createdAt)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
