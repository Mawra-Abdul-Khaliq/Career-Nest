import { Skeleton } from "../../components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { MainNav } from "../../components/main-nav"
import { Footer } from "../../components/footer"

export default function ResourcesLoading() {
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
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Skeleton className="h-10 w-[400px] mb-8" />

            <div className="mb-10">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid gap-6 md:grid-cols-2">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-[200px] w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-9 w-28" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-[150px] w-full" />
                      <CardHeader>
                        <div className="flex gap-2 mb-2">
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardHeader>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-28" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>

            <div className="mt-16">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
