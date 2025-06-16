"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import "./profile.css";

export default function ProfilePage() {
  const { isLoggedIn, userName, companyName, sellerImage } = useAuth();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordMessage(null);

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: "New passwords do not match", type: "error" });
      setIsSubmitting(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        text: "New password must be at least 6 characters",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({
          text: "Password updated successfully!",
          type: "success",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        setPasswordMessage({
          text: data.message || "Failed to update password",
          type: "error",
        });
      }
    } catch {
      setPasswordMessage({
        text: "An error occurred while updating password",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || !userName) {
    return null;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="profile-info">
            <div className="profile-image-container">
              <Image
                src={sellerImage || "/default-seller.png"}
                alt="Profile"
                width={150}
                height={150}
                style={{ objectFit: "cover" }}
                className="profile-image"
              />
            </div>
            <p>
              <strong>Name:</strong> {userName}
            </p>
            <p>
              <strong>Company:</strong> {companyName}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Settings</h2>
          <div className="profile-actions">
            <button
              onClick={() => router.push("/profile/edit")}
              className="profile-button"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="profile-button secondary"
            >
              {showPasswordForm ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="profile-input"
                />
              </div>
              {passwordMessage && (
                <div className={`message ${passwordMessage.type}`}>
                  {passwordMessage.text}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="profile-button"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
