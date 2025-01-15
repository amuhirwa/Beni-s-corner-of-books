import React, { useState, useEffect } from "react";
import {
  Book,
  Bookmark,
  User,
  Coffee,
  Search,
  Heart,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { bookService } from "../services/BookService";

const BookSpine = ({
  book,
  index,
  isFocused,
  onFocus,
  totalBooks,
  focusedIndex,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getOffset = () => {
    if (focusedIndex === -1 || index <= focusedIndex) return 0;
    return 100;
  };

  return (
    <button
      className={`relative group transition-all duration-500 ease-out origin-bottom transform
        ${isHovered && !isFocused ? "-translate-y-4" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onFocus(index)}
      style={{
        perspective: "1000px",
        transform: `translateX(${getOffset()}px)`,
        transition: "transform 0.5s ease-out",
      }}
    >
      {/* Tooltip */}
      {isHovered && !isFocused && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-amber-900 text-white rounded-lg p-3 shadow-xl animate-fade-in z-50">
          <div className="flex flex-col items-center gap-1">
            <h4 className="font-medium text-sm">{book.book.title}</h4>
            <p className="text-xs text-amber-200">{book.book.author}</p>
            {book.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">{book.rating}/5</span>
              </div>
            )}
          </div>
          {/* Tooltip arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="w-3 h-3 bg-amber-900 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Book spine */}
      <div
        className="relative h-48 w-12 rounded-sm transition-all duration-500 ease-out origin-right brightness-90 contrast-125"
        style={{
          backgroundColor: book.color || "#8B4513",
          transformStyle: "preserve-3d",
          transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${
            isFocused ? "-60deg" : "0deg"
          }) rotateZ(0deg)`,
        }}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-gradient-to-br from-white/20 to-transparent" />
        <div className="h-full w-full flex items-center justify-center p-2">
          <span
            className="text-sm font-medium transform rotate-180 text-white"
            style={{ writingMode: "vertical-rl" }}
          >
            {book.book.title}
          </span>
        </div>
      </div>

      {/* Book cover */}
      <div
        className={`absolute top-0 left-full h-48 w-32 transition-all duration-500 origin-left overflow-hidden brightness-90 contrast-125 
          ${
            isFocused ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(${
            isFocused ? "30deg" : "90deg"
          }) rotateZ(0deg)`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          <div className="absolute h-full w-2 left-0 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div
          className="h-full w-full relative"
          style={{ backgroundColor: book.color || "#8B4513" }}
        >
          <img
            onClick={() => {
              if (isFocused) {
                window.location.href = `/book/${book.book.google_books_id}`;
              }
            }}
            src={book.book.cover_image_url || "/api/placeholder/128/192"}
            alt={book.book.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </button>
  );
};

const Bookshelf = ({ books, category }) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  return (
    <div className="mb-12">
      <h3 className="text-xl font-serif text-amber-900 mb-4">{category}</h3>
      <div className="relative">
        <div className="bg-amber-800/95 p-6 rounded-t-lg shadow-inner">
          <div className="flex gap-3 items-end">
            {books.map((book, index) => (
              <BookSpine
                key={book.id}
                book={book}
                index={index}
                isFocused={focusedIndex === index}
                onFocus={(idx) =>
                  setFocusedIndex(idx === focusedIndex ? -1 : idx)
                }
                totalBooks={books.length}
                focusedIndex={focusedIndex}
              />
            ))}
          </div>
        </div>
        <div className="h-3 bg-amber-900 rounded-b-lg shadow-[inset_0_-8px_8px_-8px_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
};

const ReadingNook = () => {
  return (
    <div className="relative mb-12 bg-amber-900/10 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-transparent" />
      <div className="relative h-full flex items-center px-12 py-6">
        <div className="max-w-lg">
          <h2 className="text-4xl font-serif text-amber-900 mb-4">
            Happy Birthday Benita 🥳
          </h2>
          <p className="text-lg text-amber-800">
            I know how much you love books so I figured this might be a useful
            gift 😅.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => (window.location.href = "library")}
              className="px-6 py-2 bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-900 transition-colors"
            >
              Browse Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [books, setBooks] = useState({
    want_to_read: [],
    reading: [],
    completed: [],
  });
  const [currentQuote, setCurrentQuote] = useState("");

  const quotes = [
    '"A reader lives a thousand lives before he dies." - George R.R. Martin',
    '"Books are a uniquely portable magic." - Stephen King',
    '"May this new age of yours give you a better (happier) story than any of these books could come up with." - Muhirwa Alain Michael',
    '"The only thing you absolutely have to know is the location of the library." - Albert Einstein',
    // '"There is no friend as loyal as a book." - Ernest Hemingway',
    // '"So many books, so little time." - Frank Zappa',
    // '"I have always imagined that Paradise will be a kind of library." - Jorge Luis Borges',
    // '"A book is a dream that you hold in your hand." - Neil Gaiman',
    // '"Books are the mirrors of the soul." - Virginia Woolf',
    // '"There is no friend as loyal as a book." - Ernest Hemingway',
    // '"We lose ourselves in books, we find ourselves there too." - Anonymous',
    // '"A book is a gift you can open again and again." - Garrison Keillor',
    // '"Good friends, good books, and a sleepy conscience: this is the ideal life." - Mark Twain',
    // '"The world was hers for the reading." - Betty Smith',
    // '"A book must be the axe for the frozen sea inside us." - Franz Kafka',
    // '"The man who does not read has no advantage over the man who cannot read." - Mark Twain',
    // '"Books are the windows through which the soul looks out." - Henry Ward Beecher',
    // '"Reading is a discount ticket to everywhere." - Mary Schmich',
    // '"Books are a fine escape from reality, but the best ones make you return to it better than before." - Anonymous',
    // '"Reading is a passport to countless adventures." - Anonymous'
  ];
  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getMyBooks();
        // Organize books by status
        const organizedBooks = {
          want_to_read: response.filter(
            (book) => book.status === "want_to_read"
          ),
          reading: response.filter((book) => book.status === "reading"),
          completed: response.filter((book) => book.status === "completed"),
        };
        setBooks(organizedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const bookshelves = [
    {
      category: "Want to Read",
      books: books.want_to_read,
    },
    {
      category: "Currently Reading",
      books: books.reading,
    },
    {
      category: "Completed",
      books: books.completed,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/50">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <ReadingNook />

        <Card className="mb-12 bg-white/80 backdrop-blur border-amber-200/50 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent" />
          <CardContent className="p-8 relative">
            <p className="text-xl font-serif text-amber-900 italic text-center">
              {currentQuote}
            </p>
          </CardContent>
        </Card>

        {bookshelves.map((shelf) => (
          <Bookshelf
            key={shelf.category}
            category={shelf.category}
            books={shelf.books}
          />
        ))}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur border-amber-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="text-amber-700" size={24} />
                <h3 className="text-xl font-serif text-amber-900">
                  Reading Stats
                </h3>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-900 mb-2">
                  {books.completed.length}
                </p>
                <p className="text-amber-700">Books Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-amber-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Book className="text-amber-700" size={24} />
                <h3 className="text-xl font-serif text-amber-900">
                  Currently Reading
                </h3>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-900 mb-2">
                  {books.reading.length}
                </p>
                <p className="text-amber-700">Books in Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-amber-200/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bookmark className="text-amber-700" size={24} />
                <h3 className="text-xl font-serif text-amber-900">
                  Want to Read
                </h3>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-900 mb-2">
                  {books.want_to_read.length}
                </p>
                <p className="text-amber-700">Books in Wishlist</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
