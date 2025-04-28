"use client"

import { useState } from "react"
import Link from "next/link"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Search,
  BookOpen,
  FileText,
  Video,
  Briefcase,
  GraduationCap,
  Users,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: "article" | "video" | "guide" | "template"
  image: string
  author: string
  date: string
  readTime?: string
  featured?: boolean
  slug: string
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const resources: Resource[] = [
    {
      id: "1",
      title: "How to Write a Resume That Gets Noticed",
      description:
        "Learn the key elements of a standout resume that will catch recruiters' attention and help you land interviews.",
      category: "Resume",
      type: "guide",
      image: "/placeholder.svg?height=200&width=400",
      author: "Career Connect Team",
      date: "2023-04-10",
      readTime: "8 min read",
      featured: true,
      slug: "how-to-write-resume-gets-noticed",
    },
    {
      id: "2",
      title: "Mastering the Job Interview: Questions and Answers",
      description:
        "Prepare for your next interview with our comprehensive guide to common questions and effective answers.",
      category: "Interview",
      type: "article",
      image: "/placeholder.svg?height=200&width=400",
      author: "Sarah Johnson",
      date: "2023-03-25",
      readTime: "12 min read",
      featured: true,
      slug: "mastering-job-interview-questions-answers",
    },
    {
      id: "3",
      title: "Networking for Fresh Graduates: Building Professional Connections",
      description: "Discover strategies for building a professional network when you're just starting your career.",
      category: "Networking",
      type: "guide",
      image: "/placeholder.svg?height=200&width=400",
      author: "Michael Chen",
      date: "2023-04-05",
      readTime: "10 min read",
      slug: "networking-fresh-graduates-building-connections",
    },
    {
      id: "4",
      title: "LinkedIn Profile Optimization for Job Seekers",
      description:
        "Learn how to create a LinkedIn profile that attracts recruiters and showcases your skills effectively.",
      category: "Social Media",
      type: "article",
      image: "/placeholder.svg?height=200&width=400",
      author: "Alex Rivera",
      date: "2023-03-15",
      readTime: "7 min read",
      slug: "linkedin-profile-optimization-job-seekers",
    },
    {
      id: "5",
      title: "Cover Letter Template for Fresh Graduates",
      description: "Download our customizable cover letter template designed specifically for recent graduates.",
      category: "Resume",
      type: "template",
      image: "/placeholder.svg?height=200&width=400",
      author: "Career Connect Team",
      date: "2023-02-28",
      slug: "cover-letter-template-fresh-graduates",
    },
    {
      id: "6",
      title: "How to Negotiate Your First Salary",
      description: "Tips and strategies for negotiating your salary as a fresh graduate entering the job market.",
      category: "Career Development",
      type: "video",
      image: "/placeholder.svg?height=200&width=400",
      author: "Dr. Emily Wong",
      date: "2023-03-20",
      readTime: "15 min video",
      slug: "how-to-negotiate-first-salary",
    },
    {
      id: "7",
      title: "Top Skills Employers Look for in 2023",
      description: "Discover the most in-demand skills that can make your resume stand out to potential employers.",
      category: "Career Development",
      type: "article",
      image: "/placeholder.svg?height=200&width=400",
      author: "James Peterson",
      date: "2023-04-15",
      readTime: "9 min read",
      slug: "top-skills-employers-look-for-2023",
    },
    {
      id: "8",
      title: "Overcoming Imposter Syndrome in Your First Job",
      description: "Practical advice for dealing with feelings of inadequacy and self-doubt in your early career.",
      category: "Mental Health",
      type: "guide",
      image: "/placeholder.svg?height=200&width=400",
      author: "Dr. Lisa Thompson",
      date: "2023-03-10",
      readTime: "11 min read",
      slug: "overcoming-imposter-syndrome-first-job",
    },
    {
      id: "9",
      title: "Remote Work Tips for New Professionals",
      description:
        "Learn how to stay productive, communicate effectively, and maintain work-life balance in a remote setting.",
      category: "Work Life",
      type: "article",
      image: "/placeholder.svg?height=200&width=400",
      author: "Thomas Wright",
      date: "2023-04-02",
      readTime: "8 min read",
      slug: "remote-work-tips-new-professionals",
    },
    {
      id: "10",
      title: "Professional Email Templates for Job Seekers",
      description:
        "Collection of email templates for various job search scenarios, from follow-ups to thank you notes.",
      category: "Communication",
      type: "template",
      image: "/placeholder.svg?height=200&width=400",
      author: "Career Connect Team",
      date: "2023-03-05",
      slug: "professional-email-templates-job-seekers",
    },
    {
      id: "11",
      title: "Understanding Employee Benefits: A Guide for New Graduates",
      description: "Learn about different types of benefits packages and what to look for when evaluating job offers.",
      category: "Career Development",
      type: "guide",
      image: "/placeholder.svg?height=200&width=400",
      author: "Financial Wellness Team",
      date: "2023-02-20",
      readTime: "10 min read",
      slug: "understanding-employee-benefits-guide",
    },
    {
      id: "12",
      title: "Building Your Personal Brand Online",
      description:
        "Strategies for creating a consistent professional presence across digital platforms to attract opportunities.",
      category: "Social Media",
      type: "video",
      image: "/placeholder.svg?height=200&width=400",
      author: "Marketing Experts Panel",
      date: "2023-03-30",
      readTime: "20 min video",
      slug: "building-personal-brand-online",
    },
  ]

  // Filter resources based on search term
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get featured resources
  const featuredResources = resources.filter((resource) => resource.featured)

  // Group resources by category
  const categories = Array.from(new Set(resources.map((resource) => resource.category)))

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get icon for resource type
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "guide":
        return <BookOpen className="h-4 w-4" />
      case "template":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Career Resources</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Helpful guides, articles, and tools to help you navigate your career journey
              </p>
            </div>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="resume">Resume & Cover Letter</TabsTrigger>
                <TabsTrigger value="interview">Interview Prep</TabsTrigger>
                <TabsTrigger value="career">Career Development</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {searchTerm && (
                  <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Search Results</h2>
                    <p className="text-muted-foreground">
                      Found {filteredResources.length} resources matching "{searchTerm}"
                    </p>
                  </div>
                )}

                {!searchTerm && featuredResources.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Featured Resources</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {featuredResources.map((resource) => (
                        <Card key={resource.id} className="overflow-hidden">
                          <div className="aspect-video relative">
                            <img
                              src={resource.image || "/placeholder.svg"}
                              alt={resource.title}
                              className="object-cover w-full h-full"
                            />
                            <Badge className="absolute top-4 left-4">{resource.category}</Badge>
                          </div>
                          <CardHeader>
                            <CardTitle>{resource.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <span className="flex items-center">
                                {getResourceTypeIcon(resource.type)}
                                <span className="ml-1 capitalize">{resource.type}</span>
                              </span>
                              {resource.readTime && (
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {resource.readTime}
                                </span>
                              )}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground line-clamp-2">{resource.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              <Calendar className="inline h-3.5 w-3.5 mr-1" />
                              {formatDate(resource.date)}
                            </div>
                            <Button asChild>
                              <Link href={`/resources/${resource.slug}`}>Read More</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-semibold mb-6">{searchTerm ? "All Results" : "All Resources"}</h2>

                  {filteredResources.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-muted/50">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No resources found</h3>
                      <p className="text-muted-foreground mb-4">We couldn't find any resources matching your search.</p>
                      <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {(searchTerm ? filteredResources : resources).map((resource) => (
                        <Card key={resource.id} className="flex flex-col">
                          <div className="aspect-[2/1] relative">
                            <img
                              src={resource.image || "/placeholder.svg"}
                              alt={resource.title}
                              className="object-cover w-full h-full"
                            />
                            <Badge className="absolute top-3 left-3">{resource.category}</Badge>
                          </div>
                          <CardHeader className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="flex items-center">
                                {getResourceTypeIcon(resource.type)}
                                <span className="ml-1 capitalize">{resource.type}</span>
                              </Badge>
                              {resource.readTime && (
                                <Badge variant="outline" className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {resource.readTime}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-xs text-muted-foreground">{formatDate(resource.date)}</div>
                            <Button variant="ghost" size="sm" className="flex items-center" asChild>
                              <Link href={`/resources/${resource.slug}`}>
                                Read More
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resume">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-6">Resume & Cover Letter Resources</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources
                      .filter((resource) => resource.category === "Resume")
                      .map((resource) => (
                        <Card key={resource.id} className="flex flex-col">
                          <div className="aspect-[2/1] relative">
                            <img
                              src={resource.image || "/placeholder.svg"}
                              alt={resource.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardHeader className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="flex items-center">
                                {getResourceTypeIcon(resource.type)}
                                <span className="ml-1 capitalize">{resource.type}</span>
                              </Badge>
                              {resource.readTime && (
                                <Badge variant="outline" className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {resource.readTime}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-xs text-muted-foreground">{formatDate(resource.date)}</div>
                            <Button variant="ghost" size="sm" className="flex items-center" asChild>
                              <Link href={`/resources/${resource.slug}`}>
                                Read More
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="interview">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-6">Interview Preparation Resources</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources
                      .filter((resource) => resource.category === "Interview")
                      .map((resource) => (
                        <Card key={resource.id} className="flex flex-col">
                          <div className="aspect-[2/1] relative">
                            <img
                              src={resource.image || "/placeholder.svg"}
                              alt={resource.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardHeader className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="flex items-center">
                                {getResourceTypeIcon(resource.type)}
                                <span className="ml-1 capitalize">{resource.type}</span>
                              </Badge>
                              {resource.readTime && (
                                <Badge variant="outline" className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {resource.readTime}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-xs text-muted-foreground">{formatDate(resource.date)}</div>
                            <Button variant="ghost" size="sm" className="flex items-center" asChild>
                              <Link href={`/resources/${resource.slug}`}>
                                Read More
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="career">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-6">Career Development Resources</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources
                      .filter((resource) => resource.category === "Career Development")
                      .map((resource) => (
                        <Card key={resource.id} className="flex flex-col">
                          <div className="aspect-[2/1] relative">
                            <img
                              src={resource.image || "/placeholder.svg"}
                              alt={resource.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardHeader className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="flex items-center">
                                {getResourceTypeIcon(resource.type)}
                                <span className="ml-1 capitalize">{resource.type}</span>
                              </Badge>
                              {resource.readTime && (
                                <Badge variant="outline" className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {resource.readTime}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-xs text-muted-foreground">{formatDate(resource.date)}</div>
                            <Button variant="ghost" size="sm" className="flex items-center" asChild>
                              <Link href={`/resources/${resource.slug}`}>
                                Read More
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">Resource Categories</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Card className="bg-muted/50 hover:bg-muted transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Resume Writing</CardTitle>
                      <CardDescription>Create a standout resume</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/resources?category=resume">
                        View Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-muted/50 hover:bg-muted transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Interview Prep</CardTitle>
                      <CardDescription>Ace your job interviews</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/resources?category=interview">
                        View Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-muted/50 hover:bg-muted transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Career Growth</CardTitle>
                      <CardDescription>Advance your career</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/resources?category=career">
                        View Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-muted/50 hover:bg-muted transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Job Search</CardTitle>
                      <CardDescription>Find your dream job</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href="/resources?category=job-search">
                        View Resources
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
