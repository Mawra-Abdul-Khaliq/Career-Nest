"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Badge } from "../../../components/ui/badge"
import { Skeleton } from "../../../components/ui/skeleton"
import { Building, MapPin, Globe, Users, Briefcase, Clock, Calendar, DollarSign, GraduationCap, Share2, BookmarkPlus, ArrowLeft } from 'lucide-react'

interface Company {
    _id: string | string[];
  name: string
  logo?: string
  industry: string
  location: string
  description: string
  about: string
  culture: string
  benefits: string[]
  employeeCount: string
  website: string
  founded: string
  socialMedia: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
}

interface Job {
  _id: string
  title: string
  company: string
  companyId: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  postedDate: string
  deadline: string
  experience: string
}

export default function CompanyPage() {
  const { id } = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // In a real app, these would be API calls
        // const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}`)
        // const companyData = await companyResponse.json()
        // const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}/jobs`)
        // const jobsData = await jobsResponse.json()
        
        // Mock data for demonstration
        const mockCompany = {
          _id: id,
          name: "TechNova Solutions",
          logo: "/placeholder.svg?height=120&width=120",
          industry: "Technology",
          location: "San Francisco, CA",
          description: "Leading provider of innovative software solutions for businesses of all sizes.",
          about: "TechNova Solutions was founded in 2010 with a mission to transform how businesses leverage technology. We specialize in cloud computing, artificial intelligence, and enterprise software solutions that help our clients stay ahead in today's digital landscape. With a team of over 500 talented professionals, we've helped hundreds of companies across various industries optimize their operations and drive growth through technology.",
          culture: "At TechNova, we believe in fostering a culture of innovation, collaboration, and continuous learning. Our diverse team brings together different perspectives and expertise, creating an environment where creativity thrives. We value work-life balance and provide our employees with the flexibility and resources they need to succeed both professionally and personally.",
          benefits: [
            "Competitive salary and equity packages",
            "Comprehensive health, dental, and vision insurance",
            "Flexible work arrangements including remote options",
            "Professional development and learning stipends",
            "Generous paid time off and parental leave",
            "401(k) matching program",
            "Wellness programs and gym membership reimbursements",
            "Regular team building events and activities"
          ],
          employeeCount: "500-1000",
          website: "https://technova.example.com",
          founded: "2010",
          socialMedia: {
            linkedin: "https://linkedin.com/company/technova",
            twitter: "https://twitter.com/technova",
            facebook: "https://facebook.com/technova"
          }
        };
        
        const mockJobs = [
          {
            _id: "j1",
            title: "Junior Software Developer",
            company: "TechNova Solutions",
            companyId: id as string,
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$70,000 - $90,000",
            description: "We're looking for a talented Junior Software Developer to join our growing team...",
            requirements: [
              "Bachelor's degree in Computer Science or related field",
              "Knowledge of JavaScript, HTML, and CSS",
              "Familiarity with React or similar frameworks",
              "Strong problem-solving skills",
              "Excellent communication and teamwork abilities"
            ],
            postedDate: "2023-04-15",
            deadline: "2023-05-15",
            experience: "0-2 years"
          },
          {
            _id: "j2",
            title: "UX/UI Designer",
            company: "TechNova Solutions",
            companyId: id as string,
            location: "San Francisco, CA (Remote)",
            type: "Full-time",
            salary: "$80,000 - $100,000",
            description: "Join our design team to create beautiful, intuitive user experiences...",
            requirements: [
              "Bachelor's degree in Design, HCI, or related field",
              "Portfolio demonstrating UX/UI design skills",
              "Experience with Figma, Sketch, or similar tools",
              "Understanding of user-centered design principles",
              "Excellent visual design skills"
            ],
            postedDate: "2023-04-10",
            deadline: "2023-05-10",
            experience: "1-3 years"
          },
          {
            _id: "j3",
            title: "Data Analyst Intern",
            company: "TechNova Solutions",
            companyId: id as string,
            location: "San Francisco, CA",
            type: "Internship",
            salary: "$25 - $30 per hour",
            description: "Exciting opportunity for students to gain hands-on experience in data analysis...",
            requirements: [
              "Currently pursuing a degree in Statistics, Mathematics, Computer Science, or related field",
              "Knowledge of SQL and data visualization tools",
              "Familiarity with Python or R",
              "Strong analytical and problem-solving skills",
              "Excellent attention to detail"
            ],
            postedDate: "2023-04-20",
            deadline: "2023-05-20",
            experience: "Student/Internship"
          }
        ];
        
        setCompany(mockCompany);
        setJobs(mockJobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <div className="container py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div>
                <div className="flex items-center gap-6 mb-6">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
                
                <Skeleton className="h-10 w-full mb-6" />
                
                <div className="space-y-4 mb-8">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                <div className="space-y-6">
                  {Array(3).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-9 w-full mb-4" />
                    <Skeleton className="h-9 w-full" />
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

  if (!company) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <div className="container py-16 text-center">
            <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Company Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The company you're looking for could not be found. It may have been removed or the URL might be incorrect.
            </p>
            <Button asChild>
              <Link href="/companies">Back to Companies</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container py-8">
          <Link href="/companies" className="inline-flex items-center text-sm font-medium mb-8 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
          
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                {company.logo ? (
                  <img 
                    src={company.logo || "/placeholder.svg"} 
                    alt={`${company.name} logo`} 
                    className="h-24 w-24 object-contain rounded-md border p-2"
                  />
                ) : (
                  <div className="h-24 w-24 flex items-center justify-center rounded-md bg-muted">
                    <Building className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">{company.name}</h1>
                  <p className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{company.industry}</Badge>
                    <Badge variant="outline">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {company.employeeCount}
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Founded {company.founded}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="about" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="jobs">Open Positions ({jobs.length})</TabsTrigger>
                  <TabsTrigger value="culture">Culture & Benefits</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-4 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">About {company.name}</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{company.about}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="outline" className="flex items-center" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                    {company.socialMedia.linkedin && (
                      <Button variant="outline" className="flex items-center" asChild>
                        <a href={company.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="jobs" className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Open Positions at {company.name}</h2>
                  {jobs.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg bg-muted/50">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No open positions</h3>
                      <p className="text-muted-foreground">
                        There are currently no job openings at this company.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <Card key={job._id}>
                          <CardHeader>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription className="flex flex-wrap gap-2">
                              <span className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-1" />
                                {job.type}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-3.5 w-3.5 mr-1" />
                                {job.salary}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {job.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary">
                                <GraduationCap className="h-3.5 w-3.5 mr-1" />
                                {job.experience}
                              </Badge>
                              <Badge variant="secondary">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Posted {formatDate(job.postedDate)}
                              </Badge>
                            </div>
                            <Button asChild>
                              <Link href={`/jobs/${job._id}`}>View Job</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="culture" className="mt-4 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Company Culture</h2>
                    <p className="text-muted-foreground">{company.culture}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Benefits & Perks</h2>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {company.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{company.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Size</span>
                    <span className="font-medium">{company.employeeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-medium">{company.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{company.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Open Positions</span>
                    <span className="font-medium">{jobs.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full flex items-center" asChild>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save Company
                  </Button>
                  <Button variant="outline" className="w-full flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
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
