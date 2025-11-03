"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { Settings } from "lucide-react";
import "./page.css";

export default function Cards() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  
  const [vocabulary, setVocabulary] = useState([
    { id: 1, front: "Hello", back: "Bonjour" },
    { id: 2, front: "Goodbye", back: "Au revoir" },
    { id: 3, front: "Thank you", back: "Merci" },
    { id: 4, front: "Please", back: "S'il vous plaît" },
    { id: 5, front: "Sorry", back: "Désolé" },
  ]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleTurn();
      } else if (e.code === "ArrowRight") {
        handleVocabularyKnow();
      } else if (e.code === "ArrowLeft") {
        handleVocabularyUnknown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleTurn = () => {
    if (!isDragging) {
      cardRef.current?.classList.toggle("flipped");
    }
  };

  const handleVocabularyKnow = () => {
    console.log("Vocabulary know");
    animateCardExit("right");
  };

  const handleVocabularyUnknown = () => {
    console.log("Vocabulary unknown");
    animateCardExit("left");
  };

  const animateCardExit = (direction: "left" | "right") => {
    if (cardRef.current) {
      const distance =
        direction === "right" ? window.innerWidth : -window.innerWidth;
      cardRef.current.style.transition =
        "transform 0.5s ease-out, opacity 0.5s ease-out";
      cardRef.current.style.transform = `translateX(${distance}px) rotate(${direction === "right" ? 20 : -20}deg)`;
      cardRef.current.style.opacity = "0";

      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = "none";
          cardRef.current.style.transform = "translateX(0) rotate(0)";
          cardRef.current.style.opacity = "1";
          cardRef.current.classList.remove("flipped");
        }
      }, 500);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setCurrentX(e.clientX);
    const diff = e.clientX - startX;
    setOffsetX(diff);

    if (cardRef.current) {
      const rotation = diff / 20;
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
      cardRef.current.style.transition = "none";
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const diff = currentX - startX;
    const threshold = 150;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleVocabularyKnow();
      } else {
        handleVocabularyUnknown();
      }
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.5s ease-out";
        cardRef.current.style.transform = "translateX(0) rotate(0)";
      }
    }

    setOffsetX(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    setCurrentX(e.touches[0].clientX);
    const diff = e.touches[0].clientX - startX;
    setOffsetX(diff);

    if (cardRef.current) {
      const rotation = diff / 20;
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
      cardRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const diff = currentX - startX;
    const threshold = 150;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleVocabularyKnow();
      } else {
        handleVocabularyUnknown();
      }
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.5s ease-out";
        cardRef.current.style.transform = "translateX(0) rotate(0)";
      }
    }

    setOffsetX(0);
    setStartX(0);
    setCurrentX(0);
  };

  return (
    <div className="h-full flex items-center justify-center overflow-hidden">
      <div className="w-1/2 h-full flex items-center justify-center">
        <Card
          ref={cardRef}
          className="w-full h-full flip-card"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CardHeader>
            <div className="flex items-center justify-end gap-2">
              <Settings
                onClick={(e) => {
                  e.stopPropagation();
                  handleTurn();
                }}
              />
            </div>
          </CardHeader>
          <CardContent
            className="flip-card-inner"
            onClick={(e) => {
              if (Math.abs(offsetX) < 5) {
                handleTurn();
              }
            }}
          >
            <div className="flex m-0 p-0 flip-card-front" unselectable="on">{vocabulary[0].front}</div>
            <div className="flex m-0 p-0 flip-card-back" unselectable="on">{vocabulary[0].back}</div>
          </CardContent>
          <CardFooter className="flex-col gap-2"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
