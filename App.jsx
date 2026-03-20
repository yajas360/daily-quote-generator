import { useEffect, useState } from "react";
import "./App.css";
import QuoteCard from "./components/QuoteCard";
import Buttons from "./components/Buttons";
import LikedList from "./components/LikedList";

export default function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const [likedQuotes, setLikedQuotes] = useState(() => {
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      const data = await res.json();

      setQuote(data.quote);
      setAuthor(data.author);
    } catch {
      setQuote("Failed to load quote 😢");
      setAuthor("");
    }
    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  const handleLike = () => {
    const newQuote = { quote, author };

    const exists = likedQuotes.find(
      (q) => q.quote === quote && q.author === author
    );

    if (exists) {
      setLikedQuotes(
        likedQuotes.filter(
          (q) => !(q.quote === quote && q.author === author)
        )
      );
    } else {
      setLikedQuotes([...likedQuotes, newQuote]);
    }
  };

  const removeLiked = (qToRemove) => {
    setLikedQuotes(
      likedQuotes.filter(
        (q) =>
          !(q.quote === qToRemove.quote && q.author === qToRemove.author)
      )
    );
  };

  const isLiked = likedQuotes.some(
    (q) => q.quote === quote && q.author === author
  );

  return (
    <div className="container">
      <h1>🌟 Daily Motivation</h1>

      <QuoteCard quote={quote} author={author} loading={loading} />

      <Buttons
        fetchQuote={fetchQuote}
        handleLike={handleLike}
        isLiked={isLiked}
        hasQuote={quote}
        loading={loading}
      />

      <h3>❤️ Liked Quotes: {likedQuotes.length}</h3>

      <LikedList likedQuotes={likedQuotes} removeLiked={removeLiked} />
    </div>
  );
}