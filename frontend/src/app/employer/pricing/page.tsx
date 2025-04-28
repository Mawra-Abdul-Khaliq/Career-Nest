"use client"

import { useState } from "react"
import Link from "next/link"
import { MainNav } from "../../../components/main-nav"
import { Footer } from "../../../components/footer"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Check } from "lucide-react"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const plans = {
    monthly: [
      {
        name: "Basic",
        description: "Essential features for small businesses",
        price: "$49",
        features: [
          "Post up to 3 jobs",
          "Basic company profile",
          "Email support",
          "30-day job listings",
          "Basic candidate management",
        ],
        notIncluded: ["Featured job listings", "Advanced analytics", "Dedicated account manager"],
        cta: "Get Started",
        popular: false,
      },
      {
        name: "Professional",
        description: "Perfect for growing companies",
        price: "$99",
        features: [
          "Post up to 10 jobs",
          "Enhanced company profile",
          "Featured job listings",
          "Priority email support",
          "60-day job listings",
          "Advanced candidate management",
          "Basic analytics",
        ],
        notIncluded: ["Dedicated account manager", "Custom branding"],
        cta: "Get Started",
        popular: true,
      },
      {
        name: "Enterprise",
        description: "For large organizations with high-volume hiring",
        price: "$249",
        features: [
          "Unlimited job postings",
          "Premium company profile",
          "Featured job listings",
          "Priority phone & email support",
          "90-day job listings",
          "Advanced candidate management",
          "Comprehensive analytics",
          "Dedicated account manager",
          "Custom branding",
        ],
        notIncluded: [],
        cta: "Contact Sales",
        popular: false,
      },
    ],
    annual: [
      {
        name: "Basic",
        description: "Essential features for small businesses",
        price: "$39",
        features: [
          "Post up to 3 jobs",
          "Basic company profile",
          "Email support",
          "30-day job listings",
          "Basic candidate management",
        ],
        notIncluded: ["Featured job listings", "Advanced analytics", "Dedicated account manager"],
        cta: "Get Started",
        popular: false,
      },
      {
        name: "Professional",
        description: "Perfect for growing companies",
        price: "$79",
        features: [
          "Post up to 10 jobs",
          "Enhanced company profile",
          "Featured job listings",
          "Priority email support",
          "60-day job listings",
          "Advanced candidate management",
          "Basic analytics",
        ],
        notIncluded: ["Dedicated account manager", "Custom branding"],
        cta: "Get Started",
        popular: true,
      },
      {
        name: "Enterprise",
        description: "For large organizations with high-volume hiring",
        price: "$199",
        features: [
          "Unlimited job postings",
          "Premium company profile",
          "Featured job listings",
          "Priority phone & email support",
          "90-day job listings",
          "Advanced candidate management",
          "Comprehensive analytics",
          "Dedicated account manager",
          "Custom branding",
        ],
        notIncluded: [],
        cta: "Contact Sales",
        popular: false,
      },
    ],
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

          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
            <p className="text-muted-foreground max-w-2xl">
              Choose the perfect plan for your hiring needs. All plans include access to our talent pool of qualified
              candidates.
            </p>

            <div className="mt-8">
              <Tabs
                defaultValue="monthly"
                value={billingCycle}
                onValueChange={(value) => setBillingCycle(value as "monthly" | "annual")}
                className="w-[300px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual (20% off)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans[billingCycle].map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col ${plan.popular ? "border-primary shadow-lg relative" : ""} h-full`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">
                      /{billingCycle === "monthly" ? "month" : "month, billed annually"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start text-muted-foreground">
                        <Check className="h-5 w-5 text-muted-foreground/30 shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                    variant={plan.popular ? "default" : "secondary"}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We offer custom solutions for large enterprises with specific requirements. Contact our sales team to
              discuss your needs.
            </p>
            <Button size="lg">Contact Sales</Button>
          </div>

          <div className="mt-16 bg-muted rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Can I change plans later?</h3>
                    <p className="text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                      billing cycle.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">How do featured job listings work?</h3>
                    <p className="text-muted-foreground">
                      Featured job listings appear at the top of search results and receive higher visibility, resulting
                      in more applications.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">What payment methods do you accept?</h3>
                    <p className="text-muted-foreground">
                      We accept all major credit cards, PayPal, and bank transfers for annual plans.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Is there a free trial?</h3>
                    <p className="text-muted-foreground">
                      Yes, we offer a 14-day free trial for all plans. No credit card required to start.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team is here to help you find the perfect plan for your business. Contact us for personalized
                  assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline">View Documentation</Button>
                  <Button>Contact Support</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
