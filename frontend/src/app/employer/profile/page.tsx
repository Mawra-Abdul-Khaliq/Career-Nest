"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useToast } from "../../../components/ui/use-toast"
import { useAuth } from "../../../context/auth-context"
import { api } from "../../../lib/api"
import { ArrowLeft, Building, Loader2, Save, Upload } from "lucide-react"
import Link from "next/link"

type CompanyProfile = {
  name: string
  website: string
  industry: string
  size: string
  founded: string
  description: string
  mission: string
  logo: string
  coverImage: string
  location: string
  address: string
  phone: string
  email: string
  socialMedia: {
    linkedin: string
    twitter: string
    facebook: string
    instagram: string
  }
}

export default function EmployerProfilePage() {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: "",
    website: "",
    industry: "",
    size: "",
    founded: "",
    description: "",
    mission: "",
    logo: "",
    coverImage: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    socialMedia: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchCompanyProfile()
  }, [user, router])

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get("/employer/profile")

      if (response.data) {
        // Create a new object without spreading to avoid TypeScript issues
        const data = response.data

        // Update company profile with explicit property assignments
        setCompanyProfile({
          name: data.name || "",
          website: data.website || "",
          industry: data.industry || "",
          size: data.size || "",
          founded: data.founded || "",
          description: data.description || "",
          mission: data.mission || "",
          logo: data.logo || "",
          coverImage: data.coverImage || "",
          location: data.location || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          socialMedia: {
            linkedin: data.socialMedia?.linkedin || "",
            twitter: data.socialMedia?.twitter || "",
            facebook: data.socialMedia?.facebook || "",
            instagram: data.socialMedia?.instagram || "",
          },
        })
      }
    } catch (error) {
      // If profile doesn't exist yet, that's okay - we'll create it on save
      console.log("Company profile not found or error fetching:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCompanyProfile((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}), // safely spread
          [child]: value,
        },
      }));
    } else {
      setCompanyProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await api.put("/employer/profile", companyProfile)

      toast({
        title: "Profile Updated",
        description: "Your company profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update company profile. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
            <Link href="/employer/dashboard" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Company Profile</h1>
              <p className="text-muted-foreground">Manage your company information and branding</p>
            </div>
          </div>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Company Details</TabsTrigger>
              <TabsTrigger value="contact">Contact & Social</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your company's basic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={companyProfile.name}
                          onChange={handleChange}
                          placeholder="Acme Inc."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={companyProfile.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          name="industry"
                          value={companyProfile.industry}
                          onChange={handleChange}
                          placeholder="Technology, Healthcare, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Company Size</Label>
                        <Input
                          id="size"
                          name="size"
                          value={companyProfile.size}
                          onChange={handleChange}
                          placeholder="1-10, 11-50, 51-200, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founded">Founded Year</Label>
                        <Input
                          id="founded"
                          name="founded"
                          value={companyProfile.founded}
                          onChange={handleChange}
                          placeholder="2010"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={companyProfile.location}
                        onChange={handleChange}
                        placeholder="New York, NY"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                    <CardDescription>Tell candidates about your company</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={companyProfile.description}
                        onChange={handleChange}
                        placeholder="Tell us about your company, its history, and what you do..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission">Mission Statement</Label>
                      <Textarea
                        id="mission"
                        name="mission"
                        value={companyProfile.mission}
                        onChange={handleChange}
                        placeholder="Your company's mission, vision, and values..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How candidates can reach your company</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={companyProfile.email}
                          onChange={handleChange}
                          placeholder="careers@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={companyProfile.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={companyProfile.address}
                        onChange={handleChange}
                        placeholder="123 Main St, Suite 100, New York, NY 10001"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>Connect your company's social profiles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="socialMedia.linkedin">LinkedIn</Label>
                        <Input
                          id="socialMedia.linkedin"
                          name="socialMedia.linkedin"
                          value={companyProfile.socialMedia.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/company/example"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialMedia.twitter">Twitter</Label>
                        <Input
                          id="socialMedia.twitter"
                          name="socialMedia.twitter"
                          value={companyProfile.socialMedia.twitter}
                          onChange={handleChange}
                          placeholder="https://twitter.com/example"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="socialMedia.facebook">Facebook</Label>
                        <Input
                          id="socialMedia.facebook"
                          name="socialMedia.facebook"
                          value={companyProfile.socialMedia.facebook}
                          onChange={handleChange}
                          placeholder="https://facebook.com/example"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialMedia.instagram">Instagram</Label>
                        <Input
                          id="socialMedia.instagram"
                          name="socialMedia.instagram"
                          value={companyProfile.socialMedia.instagram}
                          onChange={handleChange}
                          placeholder="https://instagram.com/example"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branding" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Branding</CardTitle>
                    <CardDescription>Upload your company logo and cover image</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Company Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-24 w-24 rounded-md border flex items-center justify-center bg-muted">
                          {companyProfile.logo ? (
                            <img
                              src={companyProfile.logo || "/placeholder.svg"}
                              alt="Company logo"
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <Building className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <Button type="button" variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 400x400px. Max file size: 2MB. Formats: JPG, PNG.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label>Cover Image</Label>
                      <div className="flex flex-col gap-4">
                        <div className="h-40 w-full rounded-md border flex items-center justify-center bg-muted">
                          {companyProfile.coverImage ? (
                            <img
                              src={companyProfile.coverImage || "/placeholder.svg"}
                              alt="Company cover"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <Button type="button" variant="outline" className="w-fit">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Cover Image
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1200x400px. Max file size: 5MB. Formats: JPG, PNG.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
