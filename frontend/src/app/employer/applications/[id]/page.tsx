"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { MainNav } from "../../../../components/main-nav"
import { Footer } from "../../../../components/footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { useToast } from "../../../../components/ui/use-toast"
import { api } from "../../../../lib/api"
import { formatDate, getApplicationStatusColor } from "../../../../lib/utils"
import { ArrowLeft, Briefcase, Download, ExternalLink, Loader2, Mail, MapPin, Phone, User } from "lucide-react"

type Application = {
  _id: string
  job: {
    _id: string
    title: string
    company: string
    location: string
    description: string
    requirements: string
  }
  user: {
    _id: string
    name: string
    email: string
    phone: string
    location: string
    skills: string
    experience: string
    education: string
    linkedin: string
    github: string
    website: string
  }
  status: string
  coverLetter: string
  resume: string
  createdAt: string
  updatedAt: string
}

export default function ApplicationDetailsPage() {
  const { id } = useParams()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchApplicationDetails()
  }, [id])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/employer/applications/${id}`)
      setApplication(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch application details. Please try again later.",
        variant: "destructive",
      })
      router.push("/employer/applications")
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (newStatus: string) => {
    if (!application) return

    try {
      setUpdating(true)
      await api.put(`/employer/applications/${id}/status`, { status: newStatus })

      setApplication({
        ...application,
        status: newStatus,
      })

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
      setUpdating(false)
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

  if (!application) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Application not found</h1>
            <p className="text-muted-foreground mb-4">
              The application you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/employer/applications">View All Applications</Link>
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
            <Link href="/employer/applications" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Application Details</h1>
              <p className="text-muted-foreground">
                Application for {application.job.title} by {application.user.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={application.status} onValueChange={updateApplicationStatus} disabled={updating}>
                <SelectTrigger className={`w-[180px] ${getApplicationStatusColor(application.status)}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" asChild>
                <a href={`mailto:${application.user.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="candidate" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="candidate">Candidate Profile</TabsTrigger>
                  <TabsTrigger value="application">Application Details</TabsTrigger>
                  <TabsTrigger value="job">Job Details</TabsTrigger>
                </TabsList>

                <TabsContent value="candidate" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Candidate Information</CardTitle>
                      <CardDescription>Personal and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{application.user.name}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${application.user.email}`} className="hover:underline">
                              {application.user.email}
                            </a>
                          </div>
                          {application.user.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{application.user.phone}</span>
                            </div>
                          )}
                          {application.user.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{application.user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {(application.user.linkedin || application.user.github || application.user.website) && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {application.user.linkedin && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={application.user.linkedin} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          {application.user.github && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={application.user.github} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          {application.user.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={application.user.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Website
                              </a>
                            </Button>
                          )}
                        </div>
                      )}

                      {application.user.skills && (
                        <div className="pt-4">
                          <h4 className="text-sm font-semibold mb-2">Skills</h4>
                          <p className="text-sm">{application.user.skills}</p>
                        </div>
                      )}

                      {application.user.experience && (
                        <div className="pt-4">
                          <h4 className="text-sm font-semibold mb-2">Experience</h4>
                          <p className="text-sm whitespace-pre-line">{application.user.experience}</p>
                        </div>
                      )}

                      {application.user.education && (
                        <div className="pt-4">
                          <h4 className="text-sm font-semibold mb-2">Education</h4>
                          <p className="text-sm whitespace-pre-line">{application.user.education}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="application" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cover Letter</CardTitle>
                      <CardDescription>Submitted on {formatDate(application.createdAt)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{application.coverLetter}</p>
                    </CardContent>
                  </Card>

                  {application.resume && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Resume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button asChild>
                          <a href={application.resume} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="job" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Information</CardTitle>
                      <CardDescription>Details about the job position</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {application.job.company} • {application.job.location}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-sm font-semibold mb-2">Job Description</h4>
                        <p className="text-sm whitespace-pre-line">{application.job.description}</p>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-sm font-semibold mb-2">Requirements</h4>
                        <p className="text-sm whitespace-pre-line">{application.job.requirements}</p>
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" asChild>
                          <Link href={`/employer/jobs/${application.job._id}`}>View Full Job Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-3 rounded-md ${getApplicationStatusColor(application.status)}`}>
                    <p className="font-semibold text-center">
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Change status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={application.status === "pending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateApplicationStatus("pending")}
                        disabled={application.status === "pending" || updating}
                      >
                        Pending
                      </Button>
                      <Button
                        variant={application.status === "shortlisted" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateApplicationStatus("shortlisted")}
                        disabled={application.status === "shortlisted" || updating}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant={application.status === "accepted" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateApplicationStatus("accepted")}
                        disabled={application.status === "accepted" || updating}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Accept
                      </Button>
                      <Button
                        variant={application.status === "rejected" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateApplicationStatus("rejected")}
                        disabled={application.status === "rejected" || updating}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Application Received</p>
                        <p className="text-xs text-muted-foreground">{formatDate(application.createdAt)}</p>
                      </div>
                    </div>
                    {application.status !== "pending" && (
                      <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">
                            Status Updated to {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(application.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <a href={`mailto:${application.user.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Candidate
                    </a>
                  </Button>
                  {application.resume && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={application.resume} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                  )}
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
