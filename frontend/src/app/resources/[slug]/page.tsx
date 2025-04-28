"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Skeleton } from "../../../components/ui/skeleton"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, FileText, Video, BookOpen, Download, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: string
  image: string
  author: string
  authorTitle?: string
  authorImage?: string
  date: string
  readTime?: string
  content: string
  slug: string
  relatedResources?: string[]
}

export default function ResourcePage() {
  const { slug } = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [relatedResources, setRelatedResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/${slug}`)
        // const data = await response.json()
        
        // Mock data for demonstration
        const mockResource = {
          id: "1",
          title: "How to Write a Resume That Gets Noticed",
          description: "Learn the key elements of a standout resume that will catch recruiters' attention and help you land interviews.",
          category: "Resume",
          type: "guide",
          image: "/placeholder.svg?height=400&width=800",
          author: "Career Connect Team",
          authorTitle: "Resume Experts",
          authorImage: "/placeholder.svg?height=80&width=80",
          date: "2023-04-10",
          readTime: "8 min read",
          content: `
# How to Write a Resume That Gets Noticed

In today's competitive job market, your resume is often your first impression on potential employers. A well-crafted resume can open doors to interviews and opportunities, while a poorly written one might get lost in the pile. This guide will walk you through creating a resume that stands out and showcases your skills effectively.

## Understanding the Purpose of Your Resume

Your resume serves as a marketing document that highlights your skills, experiences, and achievements. Its primary goal is to secure you an interview, not necessarily the job itself. With recruiters spending an average of just 6-7 seconds scanning each resume, you need to make every word count.

## Essential Elements of an Effective Resume

### 1. Contact Information and Professional Profile

Place your contact information prominently at the top of your resume, including:
- Full name
- Phone number
- Professional email address
- LinkedIn profile (if applicable)
- Portfolio or personal website (if relevant)

Follow this with a concise professional summary or objective statement that highlights your key qualifications and career goals. This section should be tailored to each job application.

### 2. Work Experience

List your work experience in reverse chronological order, focusing on:
- Company name and location
- Your job title
- Employment dates
- Key responsibilities and achievements

When describing your achievements:
- Use action verbs (implemented, created, managed)
- Include quantifiable results when possible (increased sales by 20%, reduced costs by $10,000)
- Focus on accomplishments rather than just duties

### 3. Education and Certifications

Include your educational background with:
- Degree and major
- Institution name and location
- Graduation date (or expected graduation)
- Relevant coursework, honors, or academic achievements

Also list any professional certifications, licenses, or additional training that's relevant to your target position.

### 4. Skills Section

Create a dedicated skills section that includes:
- Technical skills (software proficiency, programming languages)
- Soft skills (communication, leadership, problem-solving)
- Language proficiencies

Ensure that the skills you highlight align with those mentioned in the job description.

## Formatting and Design Tips

### Keep it Concise
- For recent graduates or those with less than 10 years of experience, limit your resume to one page
- Use bullet points rather than paragraphs for better readability
- Eliminate unnecessary words and focus on impactful statements

### Choose a Clean, Professional Design
- Select a professional font (Arial, Calibri, or Georgia)
- Use consistent formatting for headings and text
- Incorporate white space to improve readability
- Consider using subtle color accents, but keep the overall design professional

### Optimize for Applicant Tracking Systems (ATS)
- Use standard section headings (Experience, Education, Skills)
- Incorporate keywords from the job description
- Avoid using tables, headers/footers, or text boxes that ATS might not process correctly
- Save your resume as a PDF unless otherwise specified

## Tailoring Your Resume for Each Application

One of the most effective strategies for resume success is customization. For each job application:

1. Analyze the job description for key requirements and skills
2. Prioritize experiences and achievements that match these requirements
3. Adjust your professional summary to highlight relevant qualifications
4. Customize your skills section to emphasize relevant abilities

## Common Resume Mistakes to Avoid

- Typos and grammatical errors
- Including personal information (age, marital status, photo)
- Using an unprofessional email address
- Including references or writing "references available upon request"
- Using generic descriptions that don't highlight your unique value

## Final Review Checklist

Before submitting your resume, ask yourself:
- Does it clearly communicate my qualifications for this specific role?
- Have I included quantifiable achievements where possible?
- Is the formatting consistent and professional?
- Have I proofread for errors?
- Would a hiring manager understand my value proposition within 6-7 seconds?

Remember, your resume is a living document that should evolve as you gain new experiences and skills. Regularly update it and seek feedback from mentors or career advisors to ensure it remains effective in helping you achieve your career goals.
          `,
          slug: "how-to-write-resume-gets-noticed",
          relatedResources: ["2", "5", "10"]
        };
        
        const mockRelatedResources = [
          {
            id: "2",
            title: "Mastering the Job Interview: Questions and Answers",
            description: "Prepare for your next interview with our comprehensive guide to common questions and effective answers.",
            category: "Interview",
            type: "article",
            image: "/placeholder.svg?height=200&width=400",
            author: "Sarah Johnson",
            date: "2023-03-25",
            readTime: "12 min read",
            slug: "mastering-job-interview-questions-answers",
            content: ""
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
            content: ""
          },
          {
            id: "10",
            title: "Professional Email Templates for Job Seekers",
            description: "Collection of email templates for various job search scenarios, from follow-ups to thank you notes.",
            category: "Communication",
            type: "template",
            image: "/placeholder.svg?height=200&width=400",
            author: "Career Connect Team",
            date: "2023-03-05",
            slug: "professional-email-templates-job-seekers",
            content: ""
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setResource(mockResource);
          setRelatedResources(mockRelatedResources);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching resource data:", error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchResourceData();
    }
  }, [slug]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get icon for resource type
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Convert markdown-like content to JSX
  const renderContent = (content: string) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const result: JSX.Element[] = [];
    
    let inList = false;
    let listItems: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        result.push(<h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        result.push(<h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        result.push(<h3 key={index} className="text-xl font-semibold mt-5 mb-2">{line.substring(4)}</h3>);
      } 
      // List items
      else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(
          <li key={`list-${index}`} className="flex items-start mb-2">
            <div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>{line.substring(2)}</span>
          </li>
        );
      } 
      // Empty line ends a list
      else if (line.trim() === '' && inList) {
        result.push(<ul key={`ul-${index}`} className="my-4 space-y-1">{listItems}</ul>);
        inList = false;
      } 
      // Regular paragraph
      else if (line.trim() !== '') {
        result.push(<p key={index} className="my-4 text-muted-foreground">{line}</p>);
      }
    });
    
    // If we're still in a list at the end
    if (inList) {
      result.push(<ul key="ul-final" className="my-4 space-y-1">{listItems}</ul>);
    }
    
    return result;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <div className="container py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            
            <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
              <div>
                <Skeleton className="h-[300px] w-full mb-6" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <div className="flex gap-2 mb-6">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                
                <div className="flex items-center justify-between mb-8 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {Array(10).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              
              <div>
                <Card className="mb-6 sticky top-20">
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    ))}
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

  if (!resource) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <div className="container py-16 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Resource Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The resource you're looking for could not be found. It may have been removed or the URL might be incorrect.
            </p>
            <Button asChild>
              <Link href="/resources">Back to Resources</Link>
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
        <div className="container py-8">
          <Link href="/resources" className="inline-flex items-center text-sm font-medium mb-8 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
          
          <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
            <div>
              {resource.image && (
                <div className="mb-6">
                  <img 
                    src={resource.image || "/placeholder.svg"}
                    alt={resource.title}
                    className="rounded-md w-full h-auto object-cover aspect-video"
                  />
                </div>
              )}

              <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>

              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">{resource.category}</Badge>
                <Badge variant="outline">
                  {getResourceTypeIcon(resource.type)}
                  {resource.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <div className="flex items-center gap-3">
                  {resource.authorImage && (
                    <img
                      src={resource.authorImage || "/placeholder.svg"}
                      alt={resource.author}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{resource.author}</div>
                    <div className="text-sm text-muted-foreground">{resource.authorTitle}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {renderContent(resource.content)}
              </div>
            </div>

            <div>
              <Card className="mb-6 sticky top-20">
                <CardHeader>
                  <CardTitle>Related Resources</CardTitle>
                  <CardDescription>Explore similar content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedResources.map((relatedResource) => (
                    <Link href={`/resources/${relatedResource.slug}`} key={relatedResource.id}>
                      <div className="flex gap-3 hover:bg-secondary p-2 rounded-md transition-colors duration-200">
                        <img
                          src={relatedResource.image || "/placeholder.svg"}
                          alt={relatedResource.title}
                          className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="space-y-2">
                          <div className="font-semibold line-clamp-1">{relatedResource.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{relatedResource.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
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
