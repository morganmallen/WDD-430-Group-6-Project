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

    if (validateForm()) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          console.log('LoginForm - API success, calling login with name:', data.name); // Debug
          login(data.name); // Update AuthContext with user name
          // Redirect to homepage with message and user name
          router.push(`/?message=Your sign in was successful&user=${encodeURIComponent(data.name)}`);
        } else {
          console.log('LoginForm - API failed:', data.message); // Debug
          setServerError(data.message || "Login failed");
        }
      } catch (err) {
        console.error('LoginForm - Error during login:', err); // Debug
        setServerError("Login failed. Please try again.");
      }
    } else {
      console.log('LoginForm - Validation failed:', errors); // Debug
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
        Do not have an account? <Link href="/register" className="register-link">Register</Link>
      </p>
    </div>
  );
}