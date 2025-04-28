"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MainNav } from "../../../../../components/main-nav"
import { Footer } from "../../../../../components/footer"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { useToast } from "../../../../../components/ui/use-toast"
import { api } from "../../../../../lib/api"
import { formatDate, getApplicationStatusColor } from "../../../../../lib/utils"
import { ArrowLeft, Loader2, Search, User } from "lucide-react"

type Application = {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  status: string
  createdAt: string
}

type Job = {
  _id: string
  title: string
  company: string
}

export default function JobApplicationsPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchJobApplications()
  }, [id])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchJobApplications = async () => {
    try {
      setLoading(true)
      const jobResponse = await api.get(`/employer/jobs/${id}`)
      setJob(jobResponse.data)

      const applicationsResponse = await api.get(`/employer/jobs/${id}/applications`)
      setApplications(applicationsResponse.data)
      setFilteredApplications(applicationsResponse.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (app) => app.user.name.toLowerCase().includes(term) || app.user.email.toLowerCase().includes(term),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingId(applicationId)
      await api.put(`/employer/applications/${applicationId}/status`, { status: newStatus })

      // Update local state
      setApplications(applications.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app)))

      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusCounts = () => {
    const counts = {
      all: applications.length,
      pending: 0,
      shortlisted: 0,
      accepted: 0,
      rejected: 0,
    }

    applications.forEach((app) => {
      if (counts[app.status as keyof typeof counts] !== undefined) {
        counts[app.status as keyof typeof counts]++
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
            <Link href={`/employer/jobs/${id}`} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Details
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Applications</h1>
              <p className="text-muted-foreground">
                {job ? `Manage applications for ${job.title}` : "Manage job applications"}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by candidate name or email..."
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
                <SelectItem value="all">All Statuses ({statusCounts.all})</SelectItem>
                <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                <SelectItem value="shortlisted">Shortlisted ({statusCounts.shortlisted})</SelectItem>
                <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {applications.length === 0
                  ? "You haven't received any applications for this job yet"
                  : "No applications match your current filters"}
              </p>
              {applications.length > 0 && (
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
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{application.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{application.user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Applied on {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <Select
                      value={application.status}
                      onValueChange={(value) => updateApplicationStatus(application._id, value)}
                      disabled={updatingId === application._id}
                    >
                      <SelectTrigger className={`w-[140px] ${getApplicationStatusColor(application.status)}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/applications/${application._id}`}>View Details</Link>
                    </Button>
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
