import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  BookOpen,
  Star,
  Heart,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { bookService } from "../services/BookService";
import BookCard from "../components/BookCard";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const SearchModal = ({ isOpen, onClose, onAddBook }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&key=${API_KEY}&maxResults=12`
      );
      const data = await response.json();
      const formattedResults =
        data.items?.map((book) => {
          const imageId =
            book.volumeInfo.imageLinks?.thumbnail.match(/id=([a-zA-Z0-9_-]+)/);
          return {
            id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors?.[0] || "Unknown Author",
            description:
              book.volumeInfo.description || "No description available",
            thumbnail:
              `https://books.google.com/books/publisher/content/images/frontcover/${imageId[1]}?fife=w400-h600&source=gbs_api` ||
              null,
            genre: book.volumeInfo.categories?.[0] || "Uncategorized",
            rating: Math.round(book.volumeInfo.averageRating || 0),
            color: "#614051",
            secondaryColor: "#2a1c24",
          };
        }) || [];
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchBooks();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-amber-900">Add New Book</h2>
            <button
              onClick={onClose}
              className="text-amber-900 hover:text-amber-700"
            >
              ×
            </button>
          </div>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800"
            />
            <input
              type="text"
              placeholder="Search for books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 outline-none"
            />
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-amber-900" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.map((book) => (
                <Card
                  key={book.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="aspect-[2/3] mb-4 bg-amber-100 rounded-lg overflow-hidden">
                      {book.thumbnail ? (
                        <img
                          onClick={() =>
                            (window.location.href = `/book/${book.id}`)
                          }
                          src={book.thumbnail}
                          alt={book.title}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={32} className="text-amber-900/50" />
                        </div>
                      )}
                    </div>
                    <h3
                      onClick={() =>
                        (window.location.href = `/book/${book.id}`)
                      }
                      className="font-serif text-lg text-amber-900 mb-1 line-clamp-2 cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-amber-700 text-sm mb-3">{book.author}</p>
                    <button
                      onClick={() => onAddBook(book)}
                      className="w-full px-4 py-2 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      <span>Add to Library</span>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LibraryPage = () => {
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [genres, setGenres] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load books from API instead of localStorage
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const books = await bookService.getMyBooks();
        setMyBooks(books);
        const uniqueGenres = [
          "All",
          ...new Set(books.map((book) => book.book.genre)),
        ];
        setGenres(uniqueGenres);
      } catch (err) {
        setError("Failed to load books");
        console.error("Error loading books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const statuses = ["All", "Reading", "Completed", "Want to Read"];
  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "rating", label: "Rating" },
  ];

  // Update handleAddBook to use API
  const handleAddBook = async (book) => {
    try {
      // First, add the book to the books collection if it doesn't exist
      const bookData = {
        title: book.title,
        author: book.author,
        description: book.description,
        cover_image_url: `https://books.google.com/books/publisher/content/images/frontcover/${book.id}?fife=w400-h600&source=gbs_api`,
        google_books_id: book.id,
        published_date: new Date().toISOString().split("T")[0], // You might want to get this from the Google Books API
      };

      const savedBook = await bookService.addBook(bookData);

      // Then create a tracking entry for this book
      await bookService.addToLibrary(savedBook.id);

      // Refresh the books list
      const updatedBooks = await bookService.getMyBooks();
      setMyBooks(updatedBooks);
      setIsSearchModalOpen(false);
    } catch (err) {
      setError("Failed to add book");
      console.error("Error adding book:", err);
    }
  };

  const genreOptions = [
    "All",
    "Fiction",
    "Science Fiction",
    "Mystery",
    "Non-Fiction",
  ];

  // Update book status
  const handleStatusChange = async (trackingId, status) => {
    try {
      console.log(trackingId);
      await bookService.updateBookStatus(trackingId, status);
      const updatedBooks = await bookService.getMyBooks();
      setMyBooks(updatedBooks);
    } catch (err) {
      setError("Failed to update book status");
      console.error("Error updating status:", err);
    }
  };

  // Update book rating
  const handleRatingChange = async (trackingId, rating) => {
    try {
      await bookService.rateBook(trackingId, rating);
      const updatedBooks = await bookService.getMyBooks();
      setMyBooks(updatedBooks);
    } catch (err) {
      setError("Failed to update rating");
      console.error("Error updating rating:", err);
    }
  };

  // Filter and sort books - updated to work with API response structure
  const filteredBooks = myBooks
    .filter((tracking) => {
      const book = tracking.book;
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "all" ||
        true;
      const matchesStatus =
        selectedStatus === "all" ||
        tracking.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesGenre && matchesStatus;
    })
    .sort((a, b) => {
      const bookA = a.book;
      const bookB = b.book;
      switch (sortBy) {
        case "title":
          return bookA.title.localeCompare(bookB.title);
        case "author":
          return bookA.author.localeCompare(bookB.author);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif text-amber-900 font-medium">
            My Library
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-4 py-2 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Book</span>
            </button>
            <button
              className={`p-3 rounded-lg transition-all duration-300 ${
                view === "grid"
                  ? "bg-amber-900 text-amber-50 shadow-lg"
                  : "bg-white text-amber-900 hover:bg-amber-100"
              }`}
              onClick={() => setView("grid")}
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-3 rounded-lg transition-all duration-300 ${
                view === "list"
                  ? "bg-amber-900 text-amber-50 shadow-lg"
                  : "bg-white text-amber-900 hover:bg-amber-100"
              }`}
              onClick={() => setView("list")}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-800"
                />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Genre Filter */}
              <div className="relative">
                <Filter
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-800"
                />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 outline-none appearance-none bg-white"
                >
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <BookOpen
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-800"
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 outline-none appearance-none bg-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-800"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 outline-none appearance-none bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-amber-900" size={32} />
          </div>
        ) : (
          <div
            className={`grid gap-8 ${
              view === "grid" ? "sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {filteredBooks.map((tracking) => (
              <BookCard
                key={tracking.id}
                book={tracking.book}
                tracking={tracking}
                view={view}
                onStatusChange={(status) =>
                  handleStatusChange(tracking.id, status)
                }
                onRatingChange={(rating) =>
                  handleRatingChange(tracking.id, rating)
                }
              />
            ))}
          </div>
        )}

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onAddBook={handleAddBook}
        />
      </main>
    </div>
  );
};

export default LibraryPage;
