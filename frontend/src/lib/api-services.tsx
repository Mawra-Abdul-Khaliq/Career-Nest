import { api } from "./api"

// User Profile
export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await api.put("/auth/profile", profileData)
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// User Applications
export const getUserApplications = async () => {
  try {
    const response = await api.get("/applications/me")
    return response.data
  } catch (error) {
    console.error("Error fetching user applications:", error)
    throw error
  }
}

export const withdrawApplication = async (applicationId: string) => {
  try {
    const response = await api.delete(`/applications/${applicationId}`)
    return response.data
  } catch (error) {
    console.error("Error withdrawing application:", error)
    throw error
  }
}

// Saved Jobs
export const getSavedJobs = async () => {
  try {
    const response = await api.get("/users/jobs/saved")
    return response.data
  } catch (error) {
    console.error("Error fetching saved jobs:", error)
    throw error
  }
}

export const saveJob = async (jobId: string) => {
  try {
    const response = await api.post(`/users/jobs/${jobId}/save`)
    return response.data
  } catch (error) {
    console.error("Error saving job:", error)
    throw error
  }
}

export const unsaveJob = async (jobId: string) => {
  try {
    const response = await api.delete(`/users/jobs/${jobId}/save`)
    return response.data
  } catch (error) {
    console.error("Error removing saved job:", error)
    throw error
  }
}
