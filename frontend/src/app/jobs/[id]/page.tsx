"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Bookmark, BookmarkCheck, Building, Calendar, Clock, Loader2, MapPin, Share2 } from "lucide-react"
import { api } from "../../../lib/api"
import { formatDate, formatSalary } from "../../../lib/utils"
import { useToast } from "../../../components/ui/use-toast"
import { useAuth } from "../../../context/auth-context"
import Link from "next/link"
import React from "react"

type Job = {
  _id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string
  salary: string
  jobType: string
  techStack: string[]
  experience: string
  applicationDeadline: string
  createdAt: string
  postedBy: {
    name: string
    _id: string
  }
}

export default function JobDetailsPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [savingJob, setSavingJob] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      fetchJob()
      checkIfJobIsSaved()
    }
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/jobs/${id}`)
      setJob(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job details. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkIfJobIsSaved = async () => {
    if (!user) return

    try {
      const response = await api.get("/users/jobs/saved")
      const savedJobs = response.data
      setIsSaved(savedJobs.some((job: any) => job._id === id))
    } catch (error) {
      console.error("Error checking saved job status:", error)
    }
  }

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for this job",
        variant: "destructive",
      })
      return
    }

    setApplying(true)
    try {
      await api.post(`/applications/${id}`, {
        coverLetter: "I am interested in this position and would like to apply.",
      })

      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted!",
      })
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.response?.data?.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  const toggleSaveJob = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save this job",
        variant: "destructive",
      })
      return
    }

    setSavingJob(true)
    try {
      if (isSaved) {
        await api.delete(`/users/jobs/${id}/save`)
        setIsSaved(false)
        toast({
          title: "Job removed",
          description: "Job removed from saved jobs",
        })
      } else {
        await api.post(`/users/jobs/${id}/save`)
        setIsSaved(true)
        toast({
          title: "Job saved",
          description: "Job added to your saved jobs",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update saved jobs",
        variant: "destructive",
      })
    } finally {
      setSavingJob(false)
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
              <Link href="/jobs">Browse Jobs</Link>
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
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/jobs" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                  <p className="text-muted-foreground">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleApply} disabled={applying}>
                  {applying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
                <Button variant="outline" onClick={toggleSaveJob} disabled={savingJob}>
                  {savingJob ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSaved ? (
                    <>
                      <BookmarkCheck className="mr-2 h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="description">
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h2 className="text-xl font-semibold">Job Description</h2>
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="requirements" className="space-y-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h2 className="text-xl font-semibold">Requirements</h2>
                    <p className="whitespace-pre-line">{job.requirements}</p>
                  </div>
                </TabsContent>
                <TabsContent value="company" className="space-y-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <h2 className="text-xl font-semibold">About {job.company}</h2>
                    <p>Company information not available.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Job Overview</h3>
                  <div className="space-y-3">
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
                      <Building className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">{job.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Salary</p>
                        <p className="text-sm text-muted-foreground">{formatSalary(job.salary)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.techStack &&
                      job.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
                        >
                          {tech}
                        </span>
                      ))}
                    {(!job.techStack || job.techStack.length === 0) && (
                      <p className="text-sm text-muted-foreground">No specific technologies listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="group relative flex flex-col rounded-lg border bg-background p-6 shadow-sm transition-all job-card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Similar Job {i}</h3>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                      Full-time
                    </span>
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                      New York, NY
                    </span>
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
