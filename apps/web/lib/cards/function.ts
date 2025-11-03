"use client";

import { useState, useRef } from "react";

export const [isDragging, setIsDragging] = useState(false);
export const [startX, setStartX] = useState(0);
export const [currentX, setCurrentX] = useState(0);
export const [offsetX, setOffsetX] = useState(0);

export const handleTurn = (cardRef: React.RefObject<HTMLDivElement>) => {
  if (!isDragging) {
    cardRef.current?.classList.toggle("flipped");
  }
};

export const handleVocabularyKnow = (cardRef: React.RefObject<HTMLDivElement>) => {
  console.log("Vocabulary know");
  animateCardExit("right", cardRef);
};

export const handleVocabularyUnknown = (cardRef: React.RefObject<HTMLDivElement>) => {
  console.log("Vocabulary unknown");
  animateCardExit("left", cardRef);
};

export const animateCardExit = (direction: "left" | "right", cardRef: React.RefObject<HTMLDivElement>) => {
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

export const handleMouseDown = (e: React.MouseEvent, cardRef: React.RefObject<HTMLDivElement>) => {
  setIsDragging(true);
  setStartX(e.clientX);
  setCurrentX(e.clientX);
};

export const handleMouseMove = (e: React.MouseEvent, cardRef: React.RefObject<HTMLDivElement>) => {
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

export const handleMouseUp = (e: React.MouseEvent, cardRef: React.RefObject<HTMLDivElement>) => {
  if (!isDragging) return;

  setIsDragging(false);
  const diff = currentX - startX;
  const threshold = 150;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      handleVocabularyKnow(cardRef);
    } else {
      handleVocabularyUnknown(cardRef);
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

export const handleTouchStart = (e: React.TouchEvent, cardRef: React.RefObject<HTMLDivElement>) => {
  setIsDragging(true);
  setStartX(e.touches[0].clientX);
  setCurrentX(e.touches[0].clientX);
};

export const handleTouchMove = (e: React.TouchEvent, cardRef: React.RefObject<HTMLDivElement>) => {
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

export const handleTouchEnd = (e: React.TouchEvent, cardRef: React.RefObject<HTMLDivElement>) => {
  if (!isDragging) return;

  setIsDragging(false);
  const diff = currentX - startX;
  const threshold = 150;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      handleVocabularyKnow(cardRef);
    } else {
      handleVocabularyUnknown(cardRef);
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
