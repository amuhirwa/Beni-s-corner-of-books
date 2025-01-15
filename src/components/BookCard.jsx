import React, { useState } from "react";
import { BookOpen, Heart, Clock, Star, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const BookCard = ({ book, tracking, view, onStatusChange, onRatingChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusClick = async (newStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRatingClick = async (rating) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onRatingChange(rating);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "reading":
        return <BookOpen size={20} className="text-amber-900" />;
      case "completed":
        return <Check size={20} className="text-amber-900" />;
      case "want_to_read":
      default:
        return <Clock size={20} className="text-amber-900" />;
    }
  };

  if (view === "grid") {
    return (
      <Card
        className="group bg-white/95 backdrop-blur hover:shadow-xl transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6">
          {/* Book Cover */}
          <div
            onClick={() =>
              (window.location.href = `/book/${book.google_books_id}`)
            }
            className="relative mb-6 cursor-pointer"
          >
            <div
              className="w-full h-72 rounded-xl shadow-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${
                  book.color || "#614051"
                }, ${book.secondaryColor || "#2a1c24"})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen size={48} className="text-white/80" />
              )}
            </div>
            {/* Quick Actions Overlay */}
            <div
              className={`absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center gap-4
                transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0"
                }`}
            >
              <button
                className={`p-3 rounded-full hover:scale-110 transition-all ${
                  tracking.status === "reading"
                    ? "bg-amber-400"
                    : "bg-white hover:bg-amber-50"
                }`}
                onClick={() => handleStatusClick("reading")}
                disabled={isUpdating}
              >
                <BookOpen size={20} className="text-amber-900" />
              </button>
              <button
                className={`p-3 rounded-full hover:scale-110 transition-all ${
                  tracking.status === "completed"
                    ? "bg-amber-400"
                    : "bg-white hover:bg-amber-50"
                }`}
                onClick={() => handleStatusClick("completed")}
                disabled={isUpdating}
              >
                <Check size={20} className="text-amber-900" />
              </button>
              <button
                className={`p-3 rounded-full hover:scale-110 transition-all ${
                  tracking.status === "want_to_read"
                    ? "bg-amber-400"
                    : "bg-white hover:bg-amber-50"
                }`}
                onClick={() => handleStatusClick("want_to_read")}
                disabled={isUpdating}
              >
                <Clock size={20} className="text-amber-900" />
              </button>
            </div>
          </div>

          <h3
            onClick={() =>
              (window.location.href = `/book/${book.google_books_id}`)
            }
            className="font-serif cursor-pointer text-xl text-amber-950 mb-2 line-clamp-2"
          >
            {book.title}
          </h3>
          <p className="text-amber-800 mb-3 font-medium">{book.author}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`cursor-pointer ${
                    i < (tracking.rating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-amber-200 hover:text-amber-300"
                  }`}
                  onClick={() => handleRatingClick(i + 1)}
                />
              ))}
            </div>
            <span className="text-sm text-amber-700">{book.genre}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div
          onClick={() =>
            (window.location.href = `/book/${book.google_books_id}`)
          }
          className="flex gap-6 cursor-pointer"
        >
          <div
            className="w-32 h-48 rounded-xl shadow-lg overflow-hidden flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${
                book.color || "#614051"
              }, ${book.secondaryColor || "#2a1c24"})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen size={32} className="text-white/80" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  onClick={() =>
                    (window.location.href = `/book/${book.google_books_id}`)
                  }
                  className="font-serif text-2xl text-amber-950 mb-2 cursor-pointer"
                >
                  {book.title}
                </h3>
                <p className="text-amber-800 mb-3 font-medium">{book.author}</p>
              </div>
              <span className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                {book.genre}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={`cursor-pointer ${
                    i < (tracking.rating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-amber-200 hover:text-amber-300"
                  }`}
                  onClick={() => handleRatingClick(i + 1)}
                />
              ))}
            </div>
            <p className="text-amber-700 mb-6 line-clamp-2">
              {book.description || "No description available."}
            </p>
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 text-sm flex items-center gap-2 font-medium rounded-lg transition-colors ${
                  tracking.status === "reading"
                    ? "bg-amber-900 text-amber-50"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
                onClick={() => handleStatusClick("reading")}
                disabled={isUpdating}
              >
                <BookOpen size={16} />
                <span>Reading</span>
              </button>
              <button
                className={`px-4 py-2 text-sm flex items-center gap-2 font-medium rounded-lg transition-colors ${
                  tracking.status === "completed"
                    ? "bg-amber-900 text-amber-50"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
                onClick={() => handleStatusClick("completed")}
                disabled={isUpdating}
              >
                <Check size={16} />
                <span>Completed</span>
              </button>
              <button
                className={`px-4 py-2 text-sm flex items-center gap-2 font-medium rounded-lg transition-colors ${
                  tracking.status === "want_to_read"
                    ? "bg-amber-900 text-amber-50"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
                onClick={() => handleStatusClick("want_to_read")}
                disabled={isUpdating}
              >
                <Clock size={16} />
                <span>Want to Read</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
