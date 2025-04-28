"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"
import { Briefcase, MapPin, Search, Building, Users } from 'lucide-react'
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import {
  Pagination
} from "../../components/ui/pagination"

interface Company {
  _id: string
  name: string
  logo?: string
  industry: string
  location: string
  description: string
  employeeCount: string
  website: string
  jobCount: number
}

export default function CompaniesPage() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const companiesPerPage = 9

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`)
        // const data = await response.json()
        
        // Mock data for demonstration
        const mockCompanies = [
          {
            _id: "1",
            name: "TechNova Solutions",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Technology",
            location: "San Francisco, CA",
            description: "Leading provider of innovative software solutions for businesses of all sizes.",
            employeeCount: "500-1000",
            website: "https://technova.example.com",
            jobCount: 12
          },
          {
            _id: "2",
            name: "GreenEarth Sustainability",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Environmental",
            location: "Portland, OR",
            description: "Dedicated to creating sustainable solutions for a greener planet.",
            employeeCount: "100-500",
            website: "https://greenearth.example.com",
            jobCount: 5
          },
          {
            _id: "3",
            name: "HealthPlus Medical",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Healthcare",
            location: "Boston, MA",
            description: "Innovative healthcare provider focused on patient-centered care.",
            employeeCount: "1000-5000",
            website: "https://healthplus.example.com",
            jobCount: 18
          },
          {
            _id: "4",
            name: "FinanceWise Consulting",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Finance",
            location: "New York, NY",
            description: "Expert financial consulting for individuals and businesses.",
            employeeCount: "100-500",
            website: "https://financewise.example.com",
            jobCount: 7
          },
          {
            _id: "5",
            name: "CreativeMinds Agency",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Marketing",
            location: "Los Angeles, CA",
            description: "Award-winning creative agency specializing in digital marketing.",
            employeeCount: "50-100",
            website: "https://creativeminds.example.com",
            jobCount: 4
          },
          {
            _id: "6",
            name: "BuildRight Construction",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Construction",
            location: "Chicago, IL",
            description: "Quality construction services for commercial and residential projects.",
            employeeCount: "500-1000",
            website: "https://buildright.example.com",
            jobCount: 9
          },
          {
            _id: "7",
            name: "EduLearn Academy",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Education",
            location: "Austin, TX",
            description: "Transforming education through innovative learning solutions.",
            employeeCount: "100-500",
            website: "https://edulearn.example.com",
            jobCount: 6
          },
          {
            _id: "8",
            name: "FoodDelight Catering",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Food & Beverage",
            location: "Miami, FL",
            description: "Gourmet catering services for all types of events.",
            employeeCount: "50-100",
            website: "https://fooddelight.example.com",
            jobCount: 3
          },
          {
            _id: "9",
            name: "TravelWise Adventures",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Travel",
            location: "Denver, CO",
            description: "Creating unforgettable travel experiences around the world.",
            employeeCount: "50-100",
            website: "https://travelwise.example.com",
            jobCount: 4
          },
          {
            _id: "10",
            name: "RetailPro Stores",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Retail",
            location: "Seattle, WA",
            description: "Innovative retail solutions for the modern consumer.",
            employeeCount: "1000-5000",
            website: "https://retailpro.example.com",
            jobCount: 15
          },
          {
            _id: "11",
            name: "LegalEagle Associates",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Legal",
            location: "Washington, DC",
            description: "Comprehensive legal services for businesses and individuals.",
            employeeCount: "100-500",
            website: "https://legaleagle.example.com",
            jobCount: 5
          },
          {
            _id: "12",
            name: "ManufacturePro Industries",
            logo: "/placeholder.svg?height=80&width=80",
            industry: "Manufacturing",
            location: "Detroit, MI",
            description: "Leading manufacturer of high-quality industrial products.",
            employeeCount: "1000-5000",
            website: "https://manufacturepro.example.com",
            jobCount: 11
          }
        ];
        
        setCompanies(mockCompanies);
        setFilteredCompanies(mockCompanies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search term, industry, and location
  useEffect(() => {
    const results = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           company.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = industry === "" || company.industry === industry;
      const matchesLocation = location === "" || company.location.includes(location);
      
      return matchesSearch && matchesIndustry && matchesLocation;
    });
    
    setFilteredCompanies(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, industry, location, companies]);

  // Get current companies for pagination
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  // Industries for filter
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Retail",
    "Manufacturing",
    "Construction",
    "Food & Beverage",
    "Travel",
    "Environmental",
    "Legal"
  ];

  // Locations for filter
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Seattle, WA",
    "Austin, TX",
    "Portland, OR",
    "Miami, FL",
    "Denver, CO",
    "Washington, DC",
    "Detroit, MI"
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Companies</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover top companies hiring fresh graduates and find your dream workplace
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies by name or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-5/6 mb-2" />
                      <Skeleton className="h-3 w-4/6" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No companies found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setIndustry("");
                  setLocation("");
                }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {currentCompanies.map((company) => (
                    <Card key={company._id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          {company.logo ? (
                            <img 
                              src={company.logo || "/placeholder.svg"} 
                              alt={`${company.name} logo`} 
                              className="h-16 w-16 object-contain rounded-md border p-1"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center rounded-md bg-muted">
                              <Building className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {company.location}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <Badge variant="outline" className="mb-2 mr-2">
                            {company.industry}
                          </Badge>
                          <Badge variant="outline" className="mb-2">
                            <Users className="h-3 w-3 mr-1" />
                            {company.employeeCount}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {company.description}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Badge variant="secondary">
                          <Briefcase className="h-3.5 w-3.5 mr-1" />
                          {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'}
                        </Badge>
                        <Button asChild>
                          <Link href={`/companies/${company._id}`}>View Company</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center mx-4">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
