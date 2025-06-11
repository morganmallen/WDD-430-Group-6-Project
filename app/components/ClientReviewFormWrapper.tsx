"use client";
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link'; 

interface ClientReviewFormWrapperProps {
  productId: number;
}

export default function ClientReviewFormWrapper({ productId }: ClientReviewFormWrapperProps) {
  // Access both userName and isLoggedIn from AuthContext
  const { userName, isLoggedIn } = useAuth();

  // If the user is NOT logged in, display a prompt to log in instead of the form
  if (!isLoggedIn) {
    return (
      <div className="review-form"> 
        <p className="login-prompt-text"> 
          Please <Link href="/login" className="login-prompt-link">Login</Link> to leave a review. {/* New class for the link */}
        </p>
      </div>
    );
  }

  // If the user IS logged in, render the ReviewForm
  return <ReviewForm productId={productId} userFirstName={userName || ""} />;
}