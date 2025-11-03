"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { Settings } from "lucide-react";
import "./page.css";

export default function Cards() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Empêche le défilement de la page
        console.log("Space pressed");
        handleTurn();
      }
    };

    // Ajout de l'écouteur d'événement sur window
    window.addEventListener("keydown", handleKeyDown);

    // Nettoyage
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleTurn = () => {
    cardRef.current?.classList.toggle("flipped");
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-1/2 h-full flex items-center justify-center">
        <Card ref={cardRef} className="w-full h-full flip-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <p>Card Title</p>
              <Settings
                onClick={(e) => {
                  e.stopPropagation();
                  handleTurn();
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="flip-card-inner" onClick={handleTurn}>
            <div className="flex m-0 p-0 flip-card-front">Hello there</div>
            <div className="flex m-0 p-0 flip-card-back">Hello there</div>
          </CardContent>
          <CardFooter className="flex-col gap-2"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
