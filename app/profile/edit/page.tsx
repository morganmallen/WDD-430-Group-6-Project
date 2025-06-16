"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import "../profile.css";

export default function EditProfilePage() {
  const {
    isLoggedIn,
    userName,
    companyName,
    sellerImage,
    updateUserName,
    updateSellerImage,
  } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: userName || "",
    company: companyName || "",
    seller_image: sellerImage || "",
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
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          seller_image: formData.seller_image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        // Update the auth context with new values
        if (updateUserName) {
          updateUserName(formData.name);
        }
        if (updateSellerImage) {
          updateSellerImage(formData.seller_image);
        }
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
    } catch {
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
            <div className="form-group">
              <label htmlFor="seller_image">Profile Image URL:</label>
              <input
                type="url"
                id="seller_image"
                name="seller_image"
                value={formData.seller_image}
                onChange={handleChange}
                className="profile-input"
                placeholder="Enter image URL (https://...)"
              />
              <small className="form-help-text">
                Enter a URL for your profile image. The image should be square
                and at least 150x150 pixels.
              </small>
              {formData.seller_image && (
                <div className="image-preview-container">
                  <p>Image Preview:</p>
                  <div className="image-preview">
                    <Image
                      src={formData.seller_image}
                      alt="Profile Preview"
                      width={150}
                      height={150}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
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
