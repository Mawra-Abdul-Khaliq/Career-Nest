"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useToast } from "../../components/ui/use-toast"
import { useAuth } from "../../context/auth-context"
import { getUserApplications, withdrawApplication } from "../../lib/api-services"
import { formatDate, getApplicationStatusColor } from "../../lib/utils"
import { ArrowLeft, Briefcase, FileText, Loader2, X } from "lucide-react"

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
  updatedAt: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await getUserApplications()
      setApplications(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your applications. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (applicationId: string) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      try {
        setWithdrawingId(applicationId)
        await withdrawApplication(applicationId)
        setApplications(applications.filter((app) => app._id !== applicationId))
        toast({
          title: "Application Withdrawn",
          description: "Your application has been successfully withdrawn.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to withdraw application. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setWithdrawingId(null)
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
              <h1 className="text-3xl font-bold">My Applications</h1>
              <p className="text-muted-foreground">Track and manage your job applications</p>
            </div>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  You haven't applied to any jobs yet. Start exploring opportunities and submit your first application!
                </p>
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Applications</CardTitle>
                    <CardDescription>All jobs you've applied to</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{applications.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pending</CardTitle>
                    <CardDescription>Applications awaiting review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {applications.filter((app) => app.status === "pending").length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Shortlisted</CardTitle>
                    <CardDescription>Applications in consideration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {applications.filter((app) => app.status === "shortlisted").length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Application History</h2>
              <div className="space-y-4">
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
                            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getApplicationStatusColor(
                              application.status,
                            )}`}
                          >
                            {application.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Applied on {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${application.job._id}`}>View Job</Link>
                      </Button>
                      {application.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWithdraw(application._id)}
                          disabled={withdrawingId === application._id}
                        >
                          {withdrawingId === application._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" /> Withdraw
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
