"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { Settings, ChevronLeft, X } from "lucide-react";
import "./page.css";
import { type Card } from "@/lib/type";
import { Button } from "../ui/button";
import router from "next/router";
import Close from "./Close";
import { BACKEND_URL } from "@/lib/constants";
import Options from "./Options";

export default function CardsComponent({
  list,
  id,
}: {
  list: Card[];
  id: string;
}) {
  const [vocabulary, setVocabulary] = useState(list);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleTurn(true);
      } else if (e.code === "ArrowRight") {
        handleVocabularyKnow();
      } else if (e.code === "ArrowLeft") {
        handleVocabularyUnknown();
      }
    };

    if (!endOfList) {
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [currentIndex]);

  const handleContinue = async () => {
    const response = await fetch(
      `${BACKEND_URL}/list/vocabulary-card/${id}?reset=false`
    );
    const data = await response.json();
    setVocabulary(data.vocabulary);
  };

  const handleReset = async () => {
    const response = await fetch(
      `${BACKEND_URL}/list/vocabulary-card/${id}?reset=true`
    );
    const data = await response.json();
    setVocabulary(data.vocabulary);
  };

  const handleTurn = (clickOfKey: boolean = false) => {
    if (!isDragging && (isClicking || clickOfKey)) {
      cardRef.current?.classList.toggle("flipped");
    }
  };

  const incrementIndex = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= vocabulary.length) {
        setEndOfList(true);
        return 0;
      }
      return nextIndex;
    });
  };

  const handleVocabularyKnow = () => {
    animateCardExit("right", () => {
      incrementIndex();
    });
  };

  const handleVocabularyUnknown = () => {
    animateCardExit("left", () => {
      incrementIndex();
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      if (cardRef.current) {
        cardRef.current.classList.remove("flipped");
      }
    }
  };

  const animateCardExit = (
    direction: "left" | "right",
    onComplete?: () => void
  ) => {
    if (cardRef.current) {
      const distance =
        direction === "right" ? window.innerWidth : -window.innerWidth;
      cardRef.current.style.transition =
        "transform 0.5s ease-out, opacity 0.5s ease-out";
      cardRef.current.style.transform = `translateX(${distance}px) rotate(${direction === "right" ? 20 : -20}deg)`;
      cardRef.current.style.opacity = "0";
      cardRef.current.classList.remove("flipped");

      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = "none";
          cardRef.current.style.transform = "translateX(0) rotate(0)";
          cardRef.current.style.opacity = "1";
          if (onComplete) onComplete();
        }
      }, 500);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(false);
    setIsClicking(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX === 0) return;

    const diffX = e.clientX - startX;
    const absDiff = Math.abs(diffX);

    if (absDiff > 5 && !isDragging) {
      setIsDragging(true);
    }

    if (!isDragging) return;

    setCurrentX(e.clientX);
    setOffsetX(diffX);

    if (cardRef.current) {
      const rotation = diffX / 20;
      cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
      cardRef.current.style.transition = "none";
    }
  };

  const handleMouseUp = () => {
    const diff = currentX - startX;
    const threshold = 150;

    if (isDragging) {
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
    } else {
      handleTurn();
    }

    setIsClicking(false);
    setIsDragging(false);
    setOffsetX(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(false);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === 0) return;

    const diffX = e.touches[0].clientX - startX;
    const absDiff = Math.abs(diffX);

    if (absDiff > 5 && !isDragging) {
      setIsDragging(true);
    }

    if (!isDragging) return;

    setCurrentX(e.touches[0].clientX);
    setOffsetX(diffX);

    if (cardRef.current) {
      const rotation = diffX / 20;
      cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
      cardRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    const diff = currentX - startX;
    const threshold = 150;

    if (isDragging) {
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
    } else {
      handleTurn();
    }

    setIsDragging(false);
    setOffsetX(0);
    setStartX(0);
    setCurrentX(0);
  };

  return (
    <div className="h-full flex items-center justify-center overflow-hidden">
      <div className="w-1/2 h-full flex items-center justify-center relative">
        {!endOfList ? (
          <Card
            ref={cardRef}
            className="w-full h-full flip-card"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Close />
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} / {vocabulary.length}
                </span>
                <Options />
              </div>
            </CardHeader>
            <CardContent
              className="flip-card-inner"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex m-0 p-0 flip-card-front" unselectable="on">
                {vocabulary[currentIndex].front}
              </div>
              <div className="flex m-0 p-0 flip-card-back" unselectable="on">
                {vocabulary[currentIndex].back}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {currentIndex > 0 && (
                <button onClick={handlePrevious}>Retour</button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card ref={cardRef} className="w-full h-full ">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Close />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex m-0 p-0">Connu :</div>
                <div className="flex m-0 p-0">En cours d'apprentissage :</div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    handleContinue();
                  }}
                >
                  Continuer
                </Button>
                <Button
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
