"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowRight, Briefcase, FileText, Loader2, Plus, User, Users } from "lucide-react"
import { api } from "../../../lib/api"
import { useToast } from "../../../components/ui/use-toast"
import { useAuth } from "../../../context/auth-context"
import { formatDate, getApplicationStatusColor } from "../../../lib/utils"

type Job = {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  applicationCount: number
  createdAt: string
  status: string
}

type Application = {
  _id: string
  job: {
    _id: string
    title: string
  }
  user: {
    _id: string
    name: string
    email: string
  }
  status: string
  createdAt: string
}

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingApplications, setLoadingApplications] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchJobs()
      fetchApplications()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true)
      const response = await api.get("/employer/jobs")
      setJobs(response.data.jobs || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your job listings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingJobs(false)
    }
  }

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true)
      const response = await api.get("/employer/applications")
      setApplications(response.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingApplications(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Employer Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Button asChild>
              <Link href="/employer/jobs/post">
                <Plus className="mr-2 h-4 w-4" /> Post a New Job
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingJobs ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    jobs.filter((job) => job.status === "active").length
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Jobs you've posted that are currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingApplications ? <Loader2 className="h-4 w-4 animate-spin" /> : applications.length}
                </div>
                <p className="text-xs text-muted-foreground">Applications received for your job postings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingApplications ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    new Set(applications.map((app) => app.user._id)).size
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Unique candidates who applied to your jobs</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="jobs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
              <TabsTrigger value="applications">Recent Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4">
              {loadingJobs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No jobs posted yet</h3>
                  <p className="text-muted-foreground mb-4">Start posting jobs to find the perfect candidates</p>
                  <Button asChild>
                    <Link href="/employer/jobs/post">Post Your First Job</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((job) => (
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
                            <span className="text-xs text-muted-foreground">Posted on {formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <div className="bg-muted px-3 py-1 rounded-md text-center">
                          <span className="text-sm font-medium">{job.applicationCount || 0}</span>
                          <span className="text-xs text-muted-foreground block">Applications</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/employer/jobs/${job._id}`}>Manage</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {jobs.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/employer/jobs">View All Job Listings</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {loadingApplications ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">Once candidates apply to your jobs, they'll appear here</p>
                  <Button asChild>
                    <Link href="/employer/jobs">View Your Job Listings</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {applications.slice(0, 5).map((application) => (
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
                          <p className="text-sm text-muted-foreground">Applied for: {application.job.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getApplicationStatusColor(application.status)}`}
                            >
                              {application.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Applied on {formatDate(application.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/applications/${application._id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {applications.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/employer/applications">View All Applications</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 mb-2">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Post a New Job</h3>
                    <p className="text-sm text-muted-foreground">Create a new job listing to find candidates</p>
                    <Button variant="ghost" size="sm" className="mt-2 group-hover:text-primary" asChild>
                      <Link href="/employer/jobs/post">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 mb-2">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Review Applications</h3>
                    <p className="text-sm text-muted-foreground">Check and respond to candidate applications</p>
                    <Button variant="ghost" size="sm" className="mt-2 group-hover:text-primary" asChild>
                      <Link href="/employer/applications">
                        View Applications <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 mb-2">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Company Profile</h3>
                    <p className="text-sm text-muted-foreground">Update your company information and branding</p>
                    <Button variant="ghost" size="sm" className="mt-2 group-hover:text-primary" asChild>
                      <Link href="/employer/profile">
                        Edit Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
