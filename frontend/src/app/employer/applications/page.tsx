"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { useToast } from "../../../components/ui/use-toast"
import { api } from "../../../lib/api"
import { formatDate, getApplicationStatusColor } from "../../../lib/utils"
import { ArrowLeft, FileText, Loader2, Search, User } from "lucide-react"

type Application = {
  _id: string
  job: {
    _id: string
    title: string
    company: string
  }
  user: {
    _id: string
    name: string
    email: string
  }
  status: string
  coverLetter: string
  resume: string
  createdAt: string
}

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await api.get("/employer/applications")
      setApplications(response.data)
      setFilteredApplications(response.data)
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
        (app) =>
          app.user.name.toLowerCase().includes(term) ||
          app.user.email.toLowerCase().includes(term) ||
          app.job.title.toLowerCase().includes(term),
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
            <Link href="/employer/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manage Applications</h1>
              <p className="text-muted-foreground">Review and respond to candidate applications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className={statusFilter === "all" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.all}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("all")}>
                  View
                </Button>
              </CardContent>
            </Card>
            <Card className={statusFilter === "pending" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.pending}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("pending")}>
                  View
                </Button>
              </CardContent>
            </Card>
            <Card className={statusFilter === "shortlisted" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Shortlisted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.shortlisted}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("shortlisted")}>
                  View
                </Button>
              </CardContent>
            </Card>
            <Card className={statusFilter === "accepted" ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Accepted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{statusCounts.accepted}</p>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setStatusFilter("accepted")}>
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
                placeholder="Search by candidate name, email or job title..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {applications.length === 0
                  ? "You haven't received any applications yet"
                  : "No applications match your current filters"}
              </p>
              {applications.length === 0 ? (
                <Button asChild>
                  <Link href="/employer/jobs/post">Post a Job</Link>
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
                          Applied for: <span className="font-medium">{application.job.title}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">on {formatDate(application.createdAt)}</span>
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
