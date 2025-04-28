import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatSalary(salary: string) {
  return salary || "Not disclosed"
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getApplicationStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "shortlisted":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getJobTypeColor(jobType: string) {
  switch (jobType.toLowerCase()) {
    case "full-time":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "part-time":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "contract":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "internship":
      return "bg-green-100 text-green-800 border-green-200"
    case "remote":
      return "bg-teal-100 text-teal-800 border-teal-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
