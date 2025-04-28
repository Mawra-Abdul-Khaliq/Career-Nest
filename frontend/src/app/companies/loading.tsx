import { Skeleton } from "../../components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"

export default function CompaniesLoading() {
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(9).fill(0).map((_, i) => (
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
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-5/6 mb-2" />
                    <Skeleton className="h-3 w-4/6" />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-9 w-28" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
