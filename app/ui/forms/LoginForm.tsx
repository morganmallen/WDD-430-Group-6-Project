"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.css";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted with:", { email: formData.email }); // Debug log

    if (validateForm()) {
      try {
        console.log("Sending login request..."); // Debug log
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Important for cookies
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log("Login API response:", data); // Debug log

        if (data.success) {
          console.log(
            "Login successful, updating context with name:",
            data.name
          ); // Debug log
          login(data.name); // This now just updates the state, no API call
          console.log("Login context updated, redirecting..."); // Debug log
          router.push("/");
          router.refresh(); // Force a refresh to update all components
        } else {
          console.log("Login failed:", data.message); // Debug log
          setServerError(data.message || "Login failed");
        }
      } catch (err) {
        console.error("Login error:", err); // Debug log
        setServerError("Login failed. Please try again.");
      }
    } else {
      console.log("Form validation failed:", errors); // Debug log
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sign in to your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <button type="submit" className="form-button">
          Sign in
        </button>
        {serverError && (
          <div className="error-message" style={{ marginTop: "1rem" }}>
            {serverError}
          </div>
        )}
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Do not have an account?{" "}
        <Link href="/register" className="register-link">
          Register
        </Link>
      </p>
    </div>
  );
}
