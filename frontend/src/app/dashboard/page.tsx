"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArrowRight, Briefcase, FileText, Loader2, User } from "lucide-react"
import { api } from "../../lib/api"
import { useToast } from "../../components/ui/use-toast"
import { useAuth } from "../../context/auth-context"
import { formatDate, getApplicationStatusColor, getJobTypeColor } from "../../lib/utils"
import React from "react"

type Application = {
  _id: string
  job: {
    _id: string
    title: string
    company: string
    location: string
  }
  status: string
  createdAt: string
}

type SavedJob = {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loadingApplications, setLoadingApplications] = useState(true)
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchApplications()
      fetchSavedJobs()
    }
  }, [user])

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true)
      const response = await api.get("/applications/me")
      setApplications(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your applications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingApplications(false)
    }
  }

  const fetchSavedJobs = async () => {
    try {
      setLoadingSavedJobs(true)
      const response = await api.get("/users/jobs/saved")
      setSavedJobs(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your saved jobs. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingSavedJobs(false)
    }
  }

  const removeSavedJob = async (jobId: string) => {
    try {
      await api.delete(`/users/jobs/${jobId}/save`)
      setSavedJobs(savedJobs.filter((job) => job._id !== jobId))
      toast({
        title: "Job removed",
        description: "Job removed from saved jobs",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove job from saved jobs",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Button asChild>
              <Link href="/jobs">Find Jobs</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingApplications ? <Loader2 className="h-4 w-4 animate-spin" /> : applications.length}
                </div>
                <p className="text-xs text-muted-foreground">Jobs you've applied to</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingSavedJobs ? <Loader2 className="h-4 w-4 animate-spin" /> : savedJobs.length}
                </div>
                <p className="text-xs text-muted-foreground">Jobs you've bookmarked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">70%</div>
                <p className="text-xs text-muted-foreground">Complete your profile to improve chances</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="applications">Recent Applications</TabsTrigger>
              <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="space-y-4">
              {loadingApplications ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">Start applying to jobs to see your applications here</p>
                  <Button asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {application.job.company} • {application.job.location}
                          </p>
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
                        <Link href={`/applications/${application._id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {applications.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/applications">View All Applications</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {loadingSavedJobs ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No saved jobs</h3>
                  <p className="text-muted-foreground mb-4">Save jobs you're interested in to view them later</p>
                  <Button asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg"
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
                            <span
                              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getJobTypeColor(job.jobType)}`}
                            >
                              {job.jobType}
                            </span>
                            <span className="text-xs font-medium">{job.salary || "Salary not disclosed"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${job._id}`}>View Job</Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeSavedJob(job._id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {savedJobs.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/saved-jobs">View All Saved Jobs</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-bold mb-6">Recommended Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group relative flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all job-card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Recommended Job {i}</h3>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      This job matches your profile and skills.
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
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
