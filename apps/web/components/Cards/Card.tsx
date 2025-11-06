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

  const handleUpdateProgress = async (
    vocabularyId: string,
    isKnown: boolean
  ) => {
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
    handleUpdateProgress(vocabulary[currentIndex]?.id, true);
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
    handleUpdateProgress(vocabulary[currentIndex]?.id, false);
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

  const handlePrevious = async () => {
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

  // return (
  //   <div className="h-full flex items-center justify-center overflow-hidden">
  //     <div className="w-1/2 h-full flex items-center justify-center relative">
  //       {!endOfList ? (
  //         <Card
  //           ref={cardRef}
  //           className="w-full h-full flip-card"
  //           style={{ cursor: isDragging ? "grabbing" : "grab" }}
  //         >
  //           <CardHeader>
  //             <div className="flex items-center justify-between gap-2">
  //               <Close />
  //               <span className="text-sm text-gray-500">
  //                 {currentIndex + 1} / {vocabulary.length}
  //               </span>
  //               <Options
  //                 cardParam={cardParam}
  //                 idList={id}
  //                 onUpdateParams={() => {}}
  //               />
  //             </div>
  //           </CardHeader>
  //           <CardContent
  //             className="flip-card-inner"
  //             onMouseDown={handleMouseDown}
  //             onMouseMove={handleMouseMove}
  //             onMouseUp={handleMouseUp}
  //             onMouseLeave={handleMouseUp}
  //             onTouchStart={handleTouchStart}
  //             onTouchMove={handleTouchMove}
  //             onTouchEnd={handleTouchEnd}
  //           >
  //             <div className="flex m-0 p-0 flip-card-front" unselectable="on">
  //               {vocabulary[currentIndex]?.front}
  //             </div>
  //             <div className="flex m-0 p-0 flip-card-back" unselectable="on">
  //               {vocabulary[currentIndex]?.back}
  //             </div>
  //           </CardContent>
  //           <CardFooter className="flex-col gap-2">
  //             {currentIndex > 0 && (
  //               <button onClick={handlePrevious}>Retour</button>
  //             )}
  //           </CardFooter>
  //         </Card>
  //       ) : (
  //         <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
  //           <h2 className="text-2xl font-bold mb-4">Félicitations !</h2>
  //           <p className="text-gray-600 mb-6">
  //             Vous avez terminé toutes les cartes de cette liste.
  //           </p>
  //           <div className="flex gap-4">
  //             <Button onClick={() => router.push(`/lists/${id}`)}>
  //               <ChevronLeft className="mr-2 h-4 w-4" /> Retour à la liste
  //             </Button>
  //             <Button
  //               variant="outline"
  //               onClick={() => window.location.reload()}
  //             >
  //               <X className="mr-2 h-4 w-4" /> Recommencer
  //             </Button>
  //           </div>
  //         </Card>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl h-full flex items-center justify-center relative">
        {!endOfList ? (
          <Card
            ref={cardRef}
            className="w-full max-h-[600px] flip-card shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-white to-slate-50">
              <div className="flex items-center justify-between gap-2">
                <Close />
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{
                        width: `${((currentIndex + 1) / vocabulary.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 min-w-[60px] text-right">
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
              className="flip-card-inner p-8 min-h-[300px]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex items-center justify-center m-0 p-8 flip-card-front text-3xl font-semibold text-slate-800"
                unselectable="on"
              >
                {vocabulary[currentIndex]?.front}
              </div>
              <div
                className="flex items-center justify-center m-0 p-8 flip-card-back text-2xl font-medium text-slate-700"
                unselectable="on"
              >
                {vocabulary[currentIndex]?.back}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
              {currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </button>
              )}
              <p className="text-xs text-slate-400 text-center">
                Glissez vers la gauche ou la droite
              </p>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-h-[600px] flex flex-col items-center justify-center p-12 text-center shadow-2xl border-0 bg-gradient-to-br from-white to-slate-50">
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
            </div>

            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Félicitations !
            </h2>
            <p className="text-slate-600 mb-8 text-lg max-w-md">
              Vous avez terminé toutes les cartes de cette liste. Excellent
              travail ! 🎉
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
              <Button
                onClick={() => router.push(`/lists/${id}`)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
              >
                <X className="mr-2 h-4 w-4" />
                Recommencer
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
