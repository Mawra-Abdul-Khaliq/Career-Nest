"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { toast } from "../../components/ui/use-toast"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters."
      valid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
      valid = false
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject."
      valid = false
    }

    if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters."
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Form submitted:", formData)

      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">For general inquiries:</p>
            <a href="mailto:info@jobboard.com" className="text-primary hover:underline">
              info@jobboard.com
            </a>
            <p className="text-muted-foreground mt-4 mb-2">For support:</p>
            <a href="mailto:support@jobboard.com" className="text-primary hover:underline">
              support@jobboard.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Call Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Main Office:</p>
            <a href="tel:+11234567890" className="text-primary hover:underline">
              +1 (123) 456-7890
            </a>
            <p className="text-muted-foreground mt-4 mb-2">Support Hotline:</p>
            <a href="tel:+18001234567" className="text-primary hover:underline">
              +1 (800) 123-4567
            </a>
            <p className="text-sm text-muted-foreground mt-4">Available Monday-Friday, 9am-5pm EST</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Visit Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Headquarters:</p>
            <address className="not-italic">
              123 Career Street
              <br />
              Suite 500
              <br />
              San Francisco, CA 94105
              <br />
              United States
            </address>
            <p className="text-sm text-muted-foreground mt-4">By appointment only</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                placeholder="Your email address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Select onValueChange={handleSelectChange} value={formData.subject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-sm font-medium text-destructive">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                className="min-h-[150px]"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <p className="text-sm font-medium text-destructive">{errors.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">How quickly can I expect a response?</h3>
              <p className="text-muted-foreground">
                We aim to respond to all inquiries within 24-48 business hours. For urgent matters, please call our
                support hotline.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                I'm having technical issues with the site. What should I do?
              </h3>
              <p className="text-muted-foreground">
                For technical support, please email support@jobboard.com with details about the issue you're
                experiencing, including screenshots if possible.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How do I become a featured employer?</h3>
              <p className="text-muted-foreground">
                To learn about our featured employer opportunities, please contact our sales team at sales@jobboard.com
                or select "Partnership Opportunity" in the contact form.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Do you offer bulk pricing for multiple job postings?</h3>
              <p className="text-muted-foreground">
                Yes, we offer special packages for employers looking to post multiple jobs. Please visit our
                <a href="/employer/pricing" className="text-primary hover:underline">
                  {" "}
                  pricing page
                </a>{" "}
                or contact us for more information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How can I report inappropriate content or users?</h3>
              <p className="text-muted-foreground">
                If you encounter any inappropriate content or users, please use the "Report" feature on the specific
                listing or profile, or email us at moderation@jobboard.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
