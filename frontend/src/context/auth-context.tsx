"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "../components/ui/use-toast"
import { api } from "../lib/api"
import * as React from "react"

type User = {
  _id: string
  name: string
  email: string
  role: "user" | "employer" | "admin"
  profilePicture?: string
  token: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Verify token is still valid
        const verifyToken = async () => {
          try {
            await api.get("/auth/profile", {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
              },
            })
          } catch (error) {
            // Token is invalid, log out
            localStorage.removeItem("user")
            setUser(null)
          }
        }

        verifyToken()
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await api.post("/auth/login", { email, password })
      const userData = response.data

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      })

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/admin/dashboard")
      } else if (userData.role === "employer") {
        router.push("/employer/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      setLoading(true)
      const response = await api.post("/auth/register", { name, email, password, role })
      const userData = response.data

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: "Registration successful",
        description: `Welcome to CareerConnect, ${userData.name}!`,
      })

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/admin/dashboard")
      } else if (userData.role === "employer") {
        router.push("/employer/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Could not create account",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
