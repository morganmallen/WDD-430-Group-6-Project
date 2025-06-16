"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import "../profile.css";

export default function EditProfilePage() {
  const { isLoggedIn, userName, companyName } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: userName || "",
    company: companyName || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        // Redirect back to profile after 2 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setMessage({
          text: data.message || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while updating profile",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-section">
            <h2>Update Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="profile-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company Name:</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="profile-input"
              />
            </div>
          </div>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <div className="profile-actions">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="profile-button secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="profile-button"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
