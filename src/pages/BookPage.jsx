import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Book, 
  Heart, 
  Share2, 
  MessageSquare, 
  BookOpen, 
  Check, 
  Star, 
  Send, 
  Clock, 
  Calendar, 
  Quote, 
  BookMarked 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NavBar from '../components/NavBar';

const BookStatusButton = ({ status, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
        isActive 
          ? 'bg-amber-800 text-amber-50 shadow-md transform scale-105' 
          : 'bg-amber-100 text-amber-900 hover:bg-amber-200 hover:shadow-md hover:scale-102'
      }`}
    >
      {status === 'reading' && <BookOpen size={20} />}
      {status === 'completed' && <Check size={20} />}
      {status === 'wantToRead' && <Clock size={20} />}
      <span className="font-medium">{status === 'wantToRead' ? 'Want to Read' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </button>
  );
  
  const StarRating = ({ rating, onRateBook }) => {
    const [hover, setHover] = useState(0);
  
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRateBook(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={`${
                star <= (hover || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-amber-200'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };
  

const BookPage = () => {
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [bookStatus, setBookStatus] = useState('');
  const [rating, setRating] = useState(0);
  const [discussion, setDiscussion] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestSent, setShowRequestSent] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Fetch book details using the Google Books API
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        setBookDetails(response.data.volumeInfo);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, []);

  const handleStatusChange = (status) => {
    setBookStatus(status);
    if (status === 'completed') {
      setReadingProgress(100);
    }
  };

  const handleDiscussionSubmit = (e) => {
    e.preventDefault();
    if (discussion.trim()) {
      setDiscussions([ 
        {
          id: Date.now(),
          text: discussion,
          timestamp: new Date(),
          user: 'You'
        },
        ...discussions
      ]);
      setDiscussion('');
    }
  };

  const handleRequestBook = () => {
    setShowRequestSent(true);
    setTimeout(() => setShowRequestSent(false), 3000);
    setRequestMessage('');
  };

  if (!bookDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-200"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Book Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book Cover */}
              <div className="relative group w-full md:w-48">
                <div className="w-full h-72 rounded-xl shadow-lg overflow-hidden transform transition-transform group-hover:scale-105">
                  <div
                    className="w-full h-full bg-gradient-to-br from-amber-800 to-amber-950"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={`https://books.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w400-h600&source=gbs_api` || '/placeholder.jpg'}
                      alt={bookDetails.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-amber-800 text-amber-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                    <BookMarked size={16} />
                    Preview
                  </button>
                </div>
              </div>

              {/* Book Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-serif text-amber-900 mb-2 font-medium">
                      {bookDetails.title}
                    </h1>
                    <p className="text-xl text-amber-800 mb-6">{bookDetails.authors?.join(', ')}</p>
                  </div>
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full hover:bg-amber-100 transition-colors"
                  >
                    <Heart 
                      size={24} 
                      className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-amber-800'} transition-colors`}
                    />
                  </button>
                </div>

                <div className="flex gap-4 mb-8">
                  <BookStatusButton
                    status="reading"
                    onClick={() => handleStatusChange('reading')}
                    isActive={bookStatus === 'reading'}
                  />
                  <BookStatusButton
                    status="completed"
                    onClick={() => handleStatusChange('completed')}
                    isActive={bookStatus === 'completed'}
                  />
                  <BookStatusButton
                    status="wantToRead"
                    onClick={() => handleStatusChange('wantToRead')}
                    isActive={bookStatus === 'wantToRead'}
                  />
                </div>

                {bookStatus === 'reading' && (
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <p className="text-amber-900 font-medium">Reading Progress</p>
                      <p className="text-amber-700">{readingProgress}% complete</p>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-amber-600 to-amber-700 h-3 rounded-full transition-all duration-500 shadow-inner"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={readingProgress}
                      onChange={(e) => setReadingProgress(parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                )}

                {(bookStatus === 'completed' || bookStatus === 'reading') && (
                  <div className="mb-8">
                    <p className="text-amber-900 font-medium mb-2">Your Rating</p>
                    <StarRating rating={rating} onRateBook={setRating} />
                  </div>
                )}

                <div className="flex gap-6">
                  <button className="flex items-center gap-2 text-amber-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-2 rounded-full transition-all">
                    <Share2 size={20} />
                    <span className="font-medium">Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-amber-800 hover:text-amber-900 hover:bg-amber-100 px-4 py-2 rounded-full transition-all">
                    <Quote size={20} />
                    <span className="font-medium">Add Quote</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-4">About the Book</h2>
                <p className="text-amber-800 leading-relaxed">{bookDetails.description}</p>
              </CardContent>
            </Card>

            {/* Discussion Section */}
            <Card className="bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-6">Let's talk about it</h2>
                <form onSubmit={handleDiscussionSubmit} className="mb-8">
                  <textarea
                    value={discussion}
                    onChange={(e) => setDiscussion(e.target.value)}
                    placeholder="Any Thoughts?"
                    className="w-full p-4 rounded-xl border-2 border-amber-200 bg-white/90 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 mb-3"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-900 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <MessageSquare size={20} />
                    <span className="font-medium">Post Discussion</span>
                  </button>
                </form>

                <div className="space-y-6">
                  {discussions.map((post) => (
                    <div key={post.id} className="border-b border-amber-200 pb-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-medium text-amber-900">{post.user}</span>
                        <span className="text-sm text-amber-700">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-amber-800 leading-relaxed">{post.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Request Book */}
          <div>
            <Card className="bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition-shadow sticky top-24">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-6">Request This Book (From me)</h2>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Add a message with your request..."
                  className="w-full p-4 rounded-xl border-2 border-amber-200 bg-white/90 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 mb-4"
                  rows={4}
                />
                <button
                  onClick={handleRequestBook}
                  className="w-full px-6 py-3 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-900 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Send size={20} />
                  <span className="font-medium">Send Request</span>
                </button>

                {showRequestSent && (
                  <Alert className="mt-4 bg-green-50 border-green-200 rounded-xl">
                    <AlertDescription className="text-green-800 py-2">
                      Request sent successfully! You'll be notified when the owner responds.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-amber-800 bg-amber-50 p-4 rounded-xl">
                    <Calendar size={20} />
                    <span>Usually responds soon enough</span>
                  </div>
                  <div className="flex items-center gap-3 text-amber-800 bg-amber-50 p-4 rounded-xl">
                    <Clock size={20} />
                    <span>Typical lending period: Special Discount Lifetime💸</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
