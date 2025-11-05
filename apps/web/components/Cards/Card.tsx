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
import { type CardParam } from "@/lib/type";
import { Button } from "../ui/button";
import router from "next/router";
import Close from "./Close";
import { BACKEND_URL } from "@/lib/constants";
import Options from "./Options";
import { getSession } from "@/lib/session";

export default function CardsComponent({
  list,
  id,
  cardParam,
}: {
  list: {
    id: string;
    front: string;
    back: string;
  }[];
  id: string;
  cardParam: CardParam;
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

  useEffect(() => {
    if (endOfList) {
      handleReset();
    }
  }, [endOfList]);

  const handleReset = async () => {
    const session = await getSession();
    await fetch(`${BACKEND_URL}/card/reset-card`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        listId: id,
      }),
    });
  };

  const handleTurn = (isKeyboard = false) => {
    if (cardRef.current) {
      if (!cardRef.current.classList.contains("flipped")) {
        cardRef.current.classList.add("flipped");
      } else {
        cardRef.current.classList.remove("flipped");
      }
      // Ne pas empêcher le comportement par défaut pour les événements clavier
      if (!isKeyboard) {
        const event = window.event as Event;
        if (event) {
          event.preventDefault();
        }
      }
    }
  };

  const handleUpdateProgress = async (vocabularyId: string, isKnown: boolean) => {
    const session = await getSession();
    await fetch(`${BACKEND_URL}/card/progress-card`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        listId: id,
        vocabularyId,
        isKnown,
      }),
    });
  };

  const handleVocabularyKnow = () => {
    handleUpdateProgress(vocabulary[currentIndex]?.id, true)
    animateCardOut("right", () => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex >= vocabulary.length) {
          setEndOfList(true);
          return prevIndex;
        }
        return newIndex;
      });
    });
  };

  const handleVocabularyUnknown = () => {
    handleUpdateProgress(vocabulary[currentIndex]?.id, false)
    animateCardOut("left", () => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex >= vocabulary.length) {
          setEndOfList(true);
          return prevIndex;
        }
        return newIndex;
      });
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

  const animateCardOut = (
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
      const element = cardRef.current as HTMLElement;
      element.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
      element.style.transition = "none";
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
      } else if (cardRef.current) {
        const element = cardRef.current as HTMLElement;
        element.style.transition = "transform 0.5s ease-out";
        element.style.transform = "translateX(0) rotate(0)";
      }
    } else if (isClicking) {
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
      const element = cardRef.current as HTMLElement;
      element.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
      element.style.transition = "none";
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
      } else if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.5s ease-out";
        cardRef.current.style.transform = "translateX(0) rotate(0)";
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
                <Options cardParam={cardParam} idList={id} onUpdateParams={() => {}} />
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
                {vocabulary[currentIndex]?.front}
              </div>
              <div className="flex m-0 p-0 flip-card-back" unselectable="on">
                {vocabulary[currentIndex]?.back}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {currentIndex > 0 && (
                <button onClick={handlePrevious}>Retour</button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Félicitations !</h2>
            <p className="text-gray-600 mb-6">
              Vous avez terminé toutes les cartes de cette liste.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => router.push(`/lists/${id}`)}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Retour à la liste
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <X className="mr-2 h-4 w-4" /> Recommencer
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
