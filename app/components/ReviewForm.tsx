"use client"; 

import { useState, FormEvent } from "react";

interface ReviewFormProps {
  productId: number;
  userFirstName: string;
}

export default function ReviewForm({ productId, userFirstName }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0); // State for the selected rating
  const [hoverRating, setHoverRating] = useState<number>(0); // State for hover effect
  const [comment, setComment] = useState<string>(""); // State for the comment
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // Function to handle star click
  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  // Function to handle star hover (visual feedback)
  const handleStarHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  // Function to reset hover state when mouse leaves stars
  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };

  // Function to handle comment changes
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    setIsSubmitting(true);
    setSubmitMessage(null);
    setIsError(false);

    // Basic client-side validation
    if (rating === 0 || comment.trim() === "") {
      setSubmitMessage("Please provide a rating and a comment.");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reviews', { // API route for reviews
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userFirstName,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage("Review submitted successfully!");
        setIsError(false);
        // Optionally clear form fields after successful submission
        setRating(0);
        setComment("");
        setHoverRating(0);
        
      } else {
        setSubmitMessage(data.message || "Failed to submit review.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitMessage("An unexpected error occurred.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="rating">Rating:</label>
        <div className="stars" onMouseLeave={handleStarMouseLeave}>
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="comment">Your Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your review here..."
          rows={4}
          required
        ></textarea>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>

      {submitMessage && (
        <p className={`submit-message ${isError ? 'error' : 'success'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  );
}