"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  TrendingUp,
  Target,
  Clock,
  Star,
  CheckCircle2,
  Loader2,
  Play,
} from "lucide-react";
import { BACKEND_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import ShowWords from "@/components/Global/ShowVocabularyBlock";

interface Vocabulary {
  id: string;
  name: string;
  translation: string;
  pronunciation: string | null;
  type: string;
}

interface VocabularyItem {
  vocabulary: Vocabulary;
}

interface LastList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface DashboardData {
  countVocabulary: number;
  knowVocabulary: VocabularyItem[];
  learnVocabulary: VocabularyItem[];
  unknownVocabulary: VocabularyItem[];
  lastListLearned: LastList | null;
  lastListKnown: number;
  lastListLearning: number;
  lastListUnknown: number;
}

interface StatsProps {
  stats: {
    mastered: number;
    learning: number;
    toReview: number;
    totalWords: number;
  };
}

function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 order-2 lg:order-1">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Vocabulaire appris</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.mastered}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.totalWords > 0
                  ? Math.round((stats.mastered / stats.totalWords) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ShowWords type="mastered">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">En cours</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.learning}
              </p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                En apprentissage
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ShowWords type="learning">
                <BookOpen className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">À réviser</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.toReview}
              </p>
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />À apprendre
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <ShowWords type="toReview">
                <Clock className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.totalWords}
              </p>
              <p className="text-xs text-purple-600 mt-1 flex items-center">
                <Star className="h-3 w-3 mr-1" />
                mots au total
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <ShowWords type="all">
                <Target className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface LastListLearnedProps {
  stats: {
    mastered: number;
    learning: number;
    toReview: number;
  };
  data: DashboardData;
  router: any;
}

function LastListLearned({ stats, data, router }: LastListLearnedProps) {
  return (
    <div className="lg:col-span-3 order-1 lg:order-2">
      {data.lastListLearned ? (
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-500" />
              Dernière liste étudiée
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-blue-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {data.lastListLearned.name}
                  </h3>
                  {data.lastListLearned.description && (
                    <p className="text-blue-100 mb-4">
                      {data.lastListLearned.description}
                    </p>
                  )}
                  <p className="text-sm text-blue-100">
                    Dernière modification:{" "}
                    {new Date(
                      data.lastListLearned.updatedAt
                    ).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    router.push(`/cards/${data.lastListLearned?.id}`)
                  }
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Réviser
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Appris</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.lastListKnown}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">En cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.lastListLearning}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">À faire</p>
                <p className="text-2xl font-bold text-orange-600">
                  {data.lastListUnknown}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Aucune liste étudiée
            </h3>
            <p className="text-slate-500 mb-4">
              Commencez par créer ou réviser une liste
            </p>
            <Button
              onClick={() => router.push("/lists")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Voir mes listes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function VocabularyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const session = await getSession();
      const response = await fetch(`${BACKEND_URL}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Impossible de charger les données</p>
      </div>
    );
  }

  const stats = {
    totalWords: data.countVocabulary,
    mastered: data.knowVocabulary.length,
    learning: data.learnVocabulary.length,
    toReview: data.unknownVocabulary.length,
  };

  return (
    <div className="min-h-screen p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Tableau de bord
            </h1>
            <p className="text-slate-600 mt-1">
              Suivez votre progression en vocabulaire
            </p>
          </div>
        </div>
        <div className="md:hidden">
          <LastListLearned stats={stats} data={data} router={router} />
        </div>
        <Stats stats={stats} />
        <div className="hidden md:block">
          <LastListLearned stats={stats} data={data} router={router} />
        </div>
      </div>
    </div>
  );
}
