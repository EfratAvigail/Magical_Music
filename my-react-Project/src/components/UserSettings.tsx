"use client"

import type React from "react"

import { useState } from "react"
import { UserIcon, Save, Mail, Lock, UserCheck, Trash2 } from "lucide-react"
import type { User } from "../types"
import "../styles/usersettings.css"

interface UserSettingsProps {
  user: User | null
}

const UserSettings = ({ user }: UserSettingsProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to set a new password"
      }

      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters"
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSaving(true)
    setSaveSuccess(false)

    // In a real app, we would send the updated user data to an API
    // For demo purposes, we'll simulate the API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      // Clear success message after a delay
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, we would send a delete request to an API
      alert("Account deletion would be processed here.")
    }
  }

  return (
    <div className="user-settings-container">
      <div className="user-settings-header">
        <h2>Account Settings</h2>
        <p className="settings-description">Manage your account information and password</p>
      </div>

      <div className="user-settings-content">
        <div className="user-profile-section">
          <div className="user-avatar-large">
            <UserIcon size={40} />
          </div>
          <div className="user-role-badge">{user?.role || "User"}</div>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h3>
              <UserCheck size={18} />
              <span>Personal Information</span>
            </h3>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <UserIcon className="input-icon" size={18} />
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>

          <div className="settings-section">
            <h3>
              <Lock size={18} />
              <span>Change Password</span>
            </h3>

            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>

          <div className="settings-actions">
            {saveSuccess && <div className="save-success">Settings saved successfully!</div>}

            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="delete-account-button" onClick={handleDeleteAccount}>
            <Trash2 size={18} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserSettings
