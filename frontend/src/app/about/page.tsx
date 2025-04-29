"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission")

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "With over 15 years of experience in HR and recruitment, Sarah founded JobBoard to bridge the gap between talented professionals and great companies.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Michael brings 12 years of tech leadership experience, ensuring JobBoard uses cutting-edge technology to deliver the best experience for job seekers and employers.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Priya Patel",
      role: "Head of Operations",
      bio: "Priya oversees day-to-day operations, ensuring JobBoard runs smoothly and efficiently while continuously improving our processes.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "James Wilson",
      role: "Head of Customer Success",
      bio: "James and his team ensure both job seekers and employers get the most value from JobBoard through dedicated support and resources.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About JobBoard</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting talented professionals with great companies since 2020
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg mb-4">
            JobBoard was founded in 2020 with a simple mission: to make the job search process more efficient,
            transparent, and rewarding for both job seekers and employers.
          </p>
          <p className="text-lg mb-4">
            What started as a small platform with just a few hundred job listings has grown into one of the most trusted
            job boards in the industry, connecting thousands of professionals with their dream jobs every month.
          </p>
          <p className="text-lg">
            Today, we're proud to serve over 5,000 companies and more than 500,000 job seekers, with a dedicated team
            working tirelessly to improve our platform and services.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="JobBoard team" fill className="object-cover" />
        </div>
      </div>

      <Tabs defaultValue="mission" className="mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mission">Our Mission</TabsTrigger>
          <TabsTrigger value="values">Our Values</TabsTrigger>
          <TabsTrigger value="impact">Our Impact</TabsTrigger>
        </TabsList>
        <TabsContent value="mission" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At JobBoard, our mission is to transform how people find jobs and how companies find talent. We believe
                that the right job can change a person's life, and the right hire can transform a business.
              </p>
              <p>
                We're committed to creating a platform that makes the job search and hiring process more efficient,
                transparent, and equitable for everyone involved.
              </p>
              <p>
                By leveraging technology and human expertise, we aim to reduce the friction in the job market and help
                create more successful, fulfilling career matches.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="values" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>The principles that guide us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Transparency</h3>
                  <p>We believe in being open and honest with our users, partners, and each other.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Equity</h3>
                  <p>We're committed to creating fair opportunities for all job seekers and employers.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Innovation</h3>
                  <p>We continuously seek better ways to solve problems and improve our services.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold text-lg mb-2">User-Centricity</h3>
                  <p>We put our users' needs at the center of everything we do.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="impact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Impact</CardTitle>
              <CardDescription>The difference we're making</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4">
                  <p className="text-4xl font-bold mb-2">500K+</p>
                  <p className="text-muted-foreground">Job Seekers Helped</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold mb-2">5,000+</p>
                  <p className="text-muted-foreground">Companies Served</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold mb-2">200K+</p>
                  <p className="text-muted-foreground">Successful Placements</p>
                </div>
              </div>
              <p>
                Beyond the numbers, we're proud of the individual success stories we've been a part of. From helping
                recent graduates land their first job to assisting experienced professionals in making career
                transitions, each successful match represents a positive change in someone's life.
              </p>
              <p>
                For employers, we've helped startups build their founding teams, supported growing companies in scaling
                their workforce, and assisted established enterprises in finding specialized talent.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-[200px]">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mt-1">
                    {member.role}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Join Us on Our Mission</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Whether you're looking for your next career opportunity or seeking to build your team, we're here to help you
          succeed.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/jobs"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
          >
            Browse Jobs
          </a>
          <a
            href="/employer/jobs/post"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
          >
            Post a Job
          </a>
        </div>
      </div>
    </div>
  )
}
