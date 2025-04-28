"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { MainNav } from "../../../../components/main-nav"
import { Footer } from "../../../../components/footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { useToast } from "../../../../components/ui/use-toast"
import { api } from "../../../../lib/api"
import { formatDate } from "../../../../lib/utils"
import { ArrowLeft, Briefcase, Calendar, Clock, Edit, ExternalLink, Loader2, MapPin, Trash2, User } from "lucide-react"

type Job = {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  description: string
  requirements: string
  experience: string
  applicationDeadline: string
  techStack: string[]
  createdAt: string
  status: string
  applicationCount: number
  applications: Array<{
    _id: string
    user: {
      _id: string
      name: string
      email: string
    }
    status: string
    createdAt: string
  }>
}

export default function JobDetailsPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/employer/jobs/${id}`)
      setJob(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job details. Please try again later.",
        variant: "destructive",
      })
      router.push("/employer/jobs")
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (newStatus: string) => {
    if (!job) return

    try {
      setUpdating(true)
      await api.put(`/employer/jobs/${id}`, { status: newStatus })

      setJob({
        ...job,
        status: newStatus,
      })

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
    } finally {
      setUpdating(false)
    }
  }

  const deleteJob = async () => {
    if (!job) return

    if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        setDeleting(true)
        await api.delete(`/employer/jobs/${id}`)

        toast({
          title: "Job Deleted",
          description: "Your job listing has been successfully deleted.",
        })

        router.push("/employer/jobs")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive",
        })
        setDeleting(false)
      }
    }
  }

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

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Job not found</h1>
            <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/employer/jobs">View All Jobs</Link>
            </Button>
          </div>
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
            <Link href="/employer/jobs" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-muted-foreground">
                  {job.company} • {job.location}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={job.status} onValueChange={updateJobStatus} disabled={updating}>
                <SelectTrigger
                  className={`w-[140px] ${
                    job.status === "active"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : job.status === "expired"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : job.status === "closed"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <Link href={`/employer/jobs/${job._id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" onClick={deleteJob} disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                  <TabsTrigger value="applications">Applications ({job.applicationCount || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{job.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{job.requirements}</p>
                    </CardContent>
                  </Card>

                  {job.techStack && job.techStack.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills & Technologies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {job.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                  {job.applications && job.applications.length > 0 ? (
                    <div className="space-y-4">
                      {job.applications.map((application) => (
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
                                <span
                                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
                                    application.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : application.status === "shortlisted"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : application.status === "accepted"
                                          ? "bg-green-100 text-green-800 border-green-200"
                                          : "bg-red-100 text-red-800 border-red-200"
                                  }`}
                                >
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
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
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                        <p className="text-muted-foreground mb-4 text-center max-w-md">
                          You haven't received any applications for this job yet.
                        </p>
                        <Button variant="outline" asChild>
                          <Link href={`/jobs/${job._id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Public Job Listing
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Job Type</p>
                      <p className="text-sm text-muted-foreground">{job.jobType}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Posted Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {job.applicationDeadline ? formatDate(job.applicationDeadline) : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{job.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">{job.salary || "Not disclosed"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold">{job.applicationCount || 0}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/jobs/${job._id}/applications`}>View All</Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-3 rounded-md text-center">
                      <p className="text-sm font-medium">Pending</p>
                      <p className="text-lg font-bold">
                        {job.applications?.filter((app) => app.status === "pending").length || 0}
                      </p>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-center">
                      <p className="text-sm font-medium">Shortlisted</p>
                      <p className="text-lg font-bold">
                        {job.applications?.filter((app) => app.status === "shortlisted").length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/jobs/${job._id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Public Listing
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/employer/jobs/${job._id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Job
                    </Link>
                  </Button>
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
