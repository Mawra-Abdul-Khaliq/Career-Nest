"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"
import { Button } from "../../components/ui/button"
import { useToast } from "../../components/ui/use-toast"
import { useAuth } from "../../context/auth-context"
import { getSavedJobs, unsaveJob } from "../../lib/api-services"
import { getJobTypeColor } from "../../lib/utils"
import { ArrowLeft, ArrowRight, Bookmark, Briefcase, Loader2, X } from "lucide-react"

type SavedJob = {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const data = await getSavedJobs()
      setSavedJobs(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your saved jobs. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (jobId: string) => {
    try {
      setRemovingId(jobId)
      await unsaveJob(jobId)
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
    } finally {
      setRemovingId(null)
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

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container px-4 py-8 md:py-12">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Saved Jobs</h1>
              <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
            </div>
            <Button asChild>
              <Link href="/jobs">Browse More Jobs</Link>
            </Button>
          </div>

          {savedJobs.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No saved jobs</h3>
              <p className="text-muted-foreground mb-4">You haven't saved any jobs yet</p>
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
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getJobTypeColor(
                            job.jobType,
                          )}`}
                        >
                          {job.jobType}
                        </span>
                        <span className="text-xs font-medium">{job.salary || "Salary not disclosed"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${job._id}`}>
                        View Job <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(job._id)}
                      disabled={removingId === job._id}
                    >
                      {removingId === job._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" /> Remove
                        </>
                      )}
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
