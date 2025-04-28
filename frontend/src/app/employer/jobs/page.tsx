"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown"
import { useToast } from "../../../components/ui/use-toast"
import { api } from "../../../lib/api"
import { formatDate } from "../../../lib/utils"
import { ArrowLeft, Briefcase, Edit, Loader2, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"

type Job = {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  applicationDeadline: string
  createdAt: string
  status: string
  applicationCount: number
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, statusFilter])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get("/employer/jobs")
      setJobs(response.data.jobs || [])
      setFilteredJobs(response.data.jobs || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your job listings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = [...jobs]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    setFilteredJobs(filtered)
  }

  const deleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        setDeletingId(jobId)
        await api.delete(`/employer/jobs/${jobId}`)

        setJobs(jobs.filter((job) => job._id !== jobId))

        toast({
          title: "Job Deleted",
          description: "Your job listing has been successfully deleted.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDeletingId(null)
      }
    }
  }

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      await api.put(`/employer/jobs/${jobId}`, { status: newStatus })

      // Update local state
      setJobs(jobs.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job)))

      toast({
        title: "Status Updated",
        description: `Job status updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusCounts = () => {
    const counts = {
      all: jobs.length,
      active: 0,
      expired: 0,
      draft: 0,
      closed: 0,
    }

    jobs.forEach((job) => {
      if (counts[job.status as keyof typeof counts] !== undefined) {
        counts[job.status as keyof typeof counts]++
      }
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container px-4 py-8 md:py-12">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/employer/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manage Jobs</h1>
              <p className="text-muted-foreground">View and manage your job listings</p>
            </div>
            <Button asChild>
              <Link href="/employer/jobs/post">
                <Plus className="mr-2 h-4 w-4" /> Post a New Job
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className={statusFilter === "all" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.all}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("all")}>
                  View
                </Button>
              </CardContent>
            </Card>
            <Card className={statusFilter === "active" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.active}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("active")}>
                  View
                </Button>
              </CardContent>
            </Card>
            <Card className={statusFilter === "expired" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.expired}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("expired")}>
                  View
                </Button>
              </CardContent>
            </Card>
            <Card className={statusFilter === "closed" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.closed}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("closed")}>
                  View
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs by title, company or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {jobs.length === 0 ? "You haven't posted any jobs yet" : "No jobs match your current filters"}
              </p>
              {jobs.length === 0 ? (
                <Button asChild>
                  <Link href="/employer/jobs/post">Post Your First Job</Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company} • {job.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                          {job.jobType}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                            job.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : job.status === "expired"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : job.status === "closed"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {job?.status?.charAt(0).toUpperCase() + job?.status?.slice(1) || 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">Posted on {formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="bg-muted px-3 py-1 rounded-md text-center">
                      <span className="text-sm font-medium">{job.applicationCount || 0}</span>
                      <span className="text-xs text-muted-foreground block">Applications</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/jobs/${job._id}`}>View</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/jobs/${job._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {job.status !== "active" && (
                            <DropdownMenuItem onClick={() => updateJobStatus(job._id, "active")}>
                              Mark as Active
                            </DropdownMenuItem>
                          )}
                          {job.status !== "closed" && (
                            <DropdownMenuItem onClick={() => updateJobStatus(job._id, "closed")}>
                              Mark as Closed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => deleteJob(job._id)}
                            disabled={deletingId === job._id}
                          >
                            {deletingId === job._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Job
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
