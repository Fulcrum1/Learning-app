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
import ShowWords from "@/components/Global/ShowWordsBlock";
import { apiRequest } from "@/lib/api-request";
import { useLanguage } from "@/components/Global/LanguageProvider";

interface Words {
  id: string;
  name: string;
  translation: string;
  pronunciation: string | null;
  type: string;
}

interface WordItem {
  word: Words;
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
  totalWords: number;
  completed: WordItem[];
  mastered: WordItem[];
  learning: WordItem[];
  toReview: WordItem[];
  // lastListLearned: LastList | null;
  // lastListKnown: number;
  // lastListLearning: number;
  // lastListUnknown: number;
}

interface StatsProps {
  stats: {
    mastered: number;
    learning: number;
    toReview: number;
    totalWords: number;
  };
  words: DashboardData;
}

function Stats({ stats, words }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 order-2 lg:order-1">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Learned words
              </p>
              <p className="text-3xl font-bold">{stats.mastered}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.totalWords > 0
                  ? Math.round((stats.mastered / stats.totalWords) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="h-12 w-12 bg-green-500 dark:bg-green-600 rounded-xl flex items-center justify-center">
              <ShowWords type="mastered" >
                <CheckCircle2 className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Learning words</p>
              <p className="text-3xl font-bold">{stats.learning}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                In learning
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center">
              <ShowWords type="learning">
                <BookOpen className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">To review</p>
              <p className="text-3xl font-bold">{stats.toReview}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />To learn
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-500 dark:bg-orange-600 rounded-xl flex items-center justify-center">
              <ShowWords type="toReview">
                <Clock className="h-6 w-6 text-white" />
              </ShowWords>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold">{stats.totalWords}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center">
                <Star className="h-3 w-3 mr-1" />
                total words
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-500 dark:bg-purple-600 rounded-xl flex items-center justify-center">
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

// function LastListLearned({ stats, data, router }: LastListLearnedProps) {
//   return (
//     <div className="lg:col-span-3 order-1 lg:order-2">
//       {data.lastListLearned ? (
//         <Card className="shadow-lg">
//           <CardHeader className="border-b">
//             <CardTitle className="flex items-center gap-2">
//               <Play className="h-5 w-5 text-blue-500 dark:text-blue-400" />
//               Last list learned
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="bg-blue-500 dark:bg-blue-600 rounded-xl p-6 text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold mb-2">
//                     {data.lastListLearned.name}
//                   </h3>
//                   {data.lastListLearned.description && (
//                     <p className="text-blue-100 dark:text-blue-50 mb-4">
//                       {data.lastListLearned.description}
//                     </p>
//                   )}
//                   <p className="text-sm text-blue-100 dark:text-blue-50">
//                     Last update:{" "}
//                     {new Date(
//                       data.lastListLearned.updatedAt,
//                     ).toLocaleDateString("fr-FR")}
//                   </p>
//                 </div>
//                 <Button
//                   onClick={() =>
//                     router.push(`/cards/${data.lastListLearned?.id}`)
//                   }
//                   className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800 shadow-lg"
//                   size="lg"
//                 >
//                   <Play className="mr-2 h-5 w-5" />
//                   Review
//                 </Button>
//               </div>
//             </div>
//             <div className="grid grid-cols-3 gap-4 mt-6">
//               <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
//                 <p className="text-sm text-muted-foreground mb-1">Appris</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {data.lastListKnown}
//                 </p>
//               </div>
//               <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
//                 <p className="text-sm text-muted-foreground mb-1">En cours</p>
//                 <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                   {data.lastListLearning}
//                 </p>
//               </div>
//               <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
//                 <p className="text-sm text-muted-foreground mb-1">À faire</p>
//                 <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
//                   {data.lastListUnknown}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="shadow-lg">
//           <CardContent className="p-12 text-center">
//             <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">No studied list</h3>
//             <p className="text-muted-foreground mb-4">
//               Start by creating or reviewing a list
//             </p>
//             <Button
//               onClick={() => router.push("/lists")}
//               className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
//             >
//               See my lists
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

export default function VocabularyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    fetchDashboardData();
  }, [language]);

  const fetchDashboardData = async () => {
    try {
      console.log(language);
      const session = await getSession();
      const response = await apiRequest.get(`${BACKEND_URL}/api/dashboard?user=${session?.user.id}&language=${language}`);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          Failed to load the data
        </p>
      </div>
    );
  }

  const stats = {
    totalWords: data.totalWords,
    mastered: data.mastered.length,
    learning: data.learning.length,
    toReview: data.toReview.length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Suivez votre progression en vocabulaire
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="md:hidden">
            {/* <LastListLearned stats={stats} data={data} router={router} /> */}
          </div>
          <Stats stats={stats} words={data} />
          <div className="hidden md:block">
            {/* <LastListLearned stats={stats} data={data} router={router} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
