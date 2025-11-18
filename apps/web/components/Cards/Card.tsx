"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Settings, ChevronLeft, X } from "lucide-react";
import "./page.css";
import { type CardParam } from "@/lib/type";
import { Button } from "../ui/button";
import router from "next/router";
import Close from "./Close";
import {
  BACKEND_URL,
  SWIPE_THRESHOLD_TIME,
  SWIPE_THRESHOLD_DISTANCE,
} from "@/lib/constants";
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
  const [isClicking, setIsClicking] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeThresholdTime = SWIPE_THRESHOLD_TIME;

  const currentCard = useMemo(
    () => vocabulary[currentIndex],
    [vocabulary, currentIndex]
  );
  const progress = useMemo(
    () => ((currentIndex + 1) / vocabulary.length) * 100,
    [currentIndex, vocabulary.length]
  );

  const handleTurn = useCallback((isKeyboard = false) => {
    if (cardRef.current) {
      cardRef.current.classList.toggle("flipped");
      if (!isKeyboard) {
        const event = window.event as Event;
        event?.preventDefault();
      }
    }
  }, []);

  const animateCardOut = useCallback(
    (direction: "left" | "right", onComplete?: () => void) => {
      if (cardRef.current) {
        const distance =
          direction === "right" ? window.innerWidth : -window.innerWidth;
        cardRef.current.style.transition = `transform ${swipeThresholdTime}s ease-out, opacity ${swipeThresholdTime}s ease-out`;
        cardRef.current.style.transform = `translateX(${distance}px) rotate(${direction === "right" ? 20 : -20}deg)`;
        cardRef.current.style.opacity = "0";
        cardRef.current.classList.remove("flipped");
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = "none";
            cardRef.current.style.transform = "translateX(0) rotate(0)";
            cardRef.current.style.opacity = "1";
            onComplete?.();
          }
        }, 500);
      }
    },
    [swipeThresholdTime]
  );

  const handleUpdateProgress = useCallback(
    async (vocabularyId: string, isKnown: boolean) => {
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
    },
    [id]
  );

  const handleVocabularyKnow = useCallback(() => {
    if (!currentCard?.id) return;
    handleUpdateProgress(currentCard.id, true);
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
  }, [currentCard, handleUpdateProgress, animateCardOut, vocabulary.length]);

  const handleVocabularyUnknown = useCallback(() => {
    if (!currentCard?.id) return;
    handleUpdateProgress(currentCard.id, false);
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
  }, [currentCard, handleUpdateProgress, animateCardOut, vocabulary.length]);

  const handlePrevious = useCallback(async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (cardRef.current) {
        cardRef.current.classList.remove("flipped");
      }
      const session = await getSession();
      await fetch(`${BACKEND_URL}/card/rollback-progress-card`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          listId: id,
          vocabularyId: vocabulary[newIndex]?.id,
        }),
      });
    }
  }, [currentIndex, id, vocabulary]);

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
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [endOfList, handleTurn, handleVocabularyKnow, handleVocabularyUnknown]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(false);
    setIsClicking(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (startX === 0) return;
      const diffX = e.clientX - startX;
      const absDiff = Math.abs(diffX);
      if (absDiff > 5 && !isDragging) {
        setIsDragging(true);
      }
      if (!isDragging && absDiff <= 5) return;
      setCurrentX(e.clientX);
      if (cardRef.current) {
        const rotation = diffX / 20;
        cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
        cardRef.current.style.transition = "none";
      }
    },
    [startX, isDragging]
  );

  const handleMouseUp = useCallback(() => {
    const diff = currentX - startX;
    if (isDragging) {
      if (Math.abs(diff) > SWIPE_THRESHOLD_DISTANCE) {
        if (diff > 0) {
          handleVocabularyKnow();
        } else {
          handleVocabularyUnknown();
        }
      } else if (cardRef.current) {
        cardRef.current.style.transition = `transform ${swipeThresholdTime}s ease-out`;
        cardRef.current.style.transform = "translateX(0) rotate(0)";
      }
    } else if (isClicking) {
      handleTurn();
    }
    setIsClicking(false);
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  }, [
    currentX,
    startX,
    isDragging,
    isClicking,
    handleVocabularyKnow,
    handleVocabularyUnknown,
    handleTurn,
    swipeThresholdTime,
  ]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    setIsDragging(false);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startX === 0 || !e.touches[0]) return;
      const diffX = e.touches[0].clientX - startX;
      const absDiff = Math.abs(diffX);
      if (absDiff > 5 && !isDragging) {
        setIsDragging(true);
      }
      if (!isDragging && absDiff <= 5) return;
      setCurrentX(e.touches[0].clientX);
      if (cardRef.current) {
        const rotation = diffX / 20;
        cardRef.current.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;
        cardRef.current.style.transition = "none";
      }
    },
    [startX, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    const diff = currentX - startX;
    if (isDragging) {
      if (Math.abs(diff) > SWIPE_THRESHOLD_DISTANCE) {
        if (diff > 0) {
          handleVocabularyKnow();
        } else {
          handleVocabularyUnknown();
        }
      } else if (cardRef.current) {
        cardRef.current.style.transition = `transform ${swipeThresholdTime}s ease-out`;
        cardRef.current.style.transform = "translateX(0) rotate(0)";
      }
    } else {
      handleTurn();
    }
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  }, [
    currentX,
    startX,
    isDragging,
    handleVocabularyKnow,
    handleVocabularyUnknown,
    handleTurn,
    swipeThresholdTime,
  ]);

  return (
    <div className="h-full flex items-center justify-center overflow-hidden p-2 sm:p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl h-full flex items-center justify-center relative">
        {!endOfList ? (
          <Card
            ref={cardRef}
            className="w-full h-[85vh] max-h-[800px] flip-card hover:shadow-2xl transition-all duration-300 border-2 border-slate-200/60 backdrop-blur-sm"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <CardHeader className="border-b-2 py-4">
              <div className="flex items-center justify-between gap-3">
                <Close />
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 min-w-[70px] text-right tabular-nums">
                    {currentIndex + 1} / {vocabulary.length}
                  </span>
                </div>
                <Options
                  cardParam={cardParam}
                  idList={id}
                  onUpdateParams={() => {}}
                />
              </div>
            </CardHeader>
            <CardContent
              className="flip-card-inner p-8 sm:p-12 h-[calc(100%-140px)]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex items-center justify-center h-full flip-card-front text-xl sm:text-4xl md:text-5xl font-bold p-8 rounded-xl"
                unselectable="on"
              >
                {currentCard?.front}
              </div>
              <div
                className="flex items-center justify-center h-full flip-card-back text-xl sm:text-3xl md:text-4xl font-semibold p-8 rounded-xl"
                unselectable="on"
              >
                {currentCard?.back}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 border-t-2 border-slate-200 pt-4">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-h-[700px] flex flex-col items-center justify-center p-12 text-center shadow-2xl border-2 border-slate-200/60 bg-gray-50 dark:bg-gray-900 backdrop-blur-sm">
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse" />
            </div>
            <h2 className="text-5xl font-extrabold mb-4">Félicitations !</h2>
            <p className="text-slate-600 mb-10 text-xl max-w-lg leading-relaxed">
              Vous avez terminé toutes les cartes de cette liste. Excellent
              travail ! 🎉
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button
                onClick={() => router.push(`/lists/${id}`)}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-semibold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Retour à la liste
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg"
              >
                <X className="mr-2 h-5 w-5" />
                Recommencer
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
