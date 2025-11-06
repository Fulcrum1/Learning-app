// import "./page.css";
// import CardsComponent from "@/components/Cards/Card";
// import { BACKEND_URL } from "@/lib/constants";
// import { CardParam } from "@/lib/type";
// import { getSession } from "@/lib/session";

// interface Card {
//   id: string;
//   front: string;
//   back: string;
// }

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function CardPage({ params }: PageProps) {
//   const { id } = await params;
//   const session = await getSession();

//   const getCardParam = async (): Promise<CardParam | null> => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/card/param-card`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       });
//       const data = await response.json();
//       return data.cardParam as CardParam; // Retourne directement cardParam
//     } catch (error) {
//       console.error("Error fetching card param:", error);
//       return null;
//     }
//   };

//   const getVocabularyCard = async () => {
//     try {
//       const response = await fetch(
//         `${BACKEND_URL}/card/vocabulary-card/${id}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session?.accessToken}`,
//           },
//         }
//       );
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Error fetching vocabulary card:", error);
//       return null;
//     }
//   };

//   try {
//     const vocabularyCard = await getVocabularyCard();
//     const cardParam = await getCardParam();

//     if (!vocabularyCard || !vocabularyCard.vocabulary) {
//       return <p>No vocabulary found</p>;
//     }

//     const vocabulary = vocabularyCard.vocabulary
//       .map(
//         (vocab: {
//           id: string;
//           name: string;
//           translation: string;
//           pronunciation: string;
//           review: boolean;
//         }) => {
//           if (!vocab.review) {
//             const base = vocab.name;
//             const translation = `${vocab.translation} (${vocab.pronunciation})`;
//             return {
//               id: vocab.id,
//               front: cardParam?.translationOnVerso ? translation : base,
//               back: cardParam?.translationOnVerso ? base : translation,
//             };
//           }
//           return null;
//         }
//       )
//       .filter(Boolean) // This removes all null values
//       .sort(() => (cardParam?.random ? Math.random() - 0.5 : 0));

//     console.log(vocabulary);
//     return (
//       <CardsComponent
//         list={vocabulary}
//         id={id}
//         cardParam={cardParam || { random: false, translationOnVerso: false }}
//       />
//     );
//   } catch (error) {
//     console.error("Error loading vocabulary:", error);
//     return <p>Error loading vocabulary. Please try again later.</p>;
//   }
// }
import "./page.css";
import CardsComponent from "@/components/Cards/Card";
import { BACKEND_URL } from "@/lib/constants";
import { CardParam } from "@/lib/type";
import { getSession } from "@/lib/session";

interface Card {
  id: string;
  front: string;
  back: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CardPage({ params }: PageProps) {
  const { id } = params;
  const session = await getSession();

  const getCardParam = async (): Promise<CardParam | null> => {
    try {
      const response = await fetch(`${BACKEND_URL}/card/param-card`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const data = await response.json();
      return data.cardParam as CardParam;
    } catch (error) {
      console.error("Error fetching card param:", error);
      return null;
    }
  };

  const getVocabularyCard = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/card/vocabulary-card/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching vocabulary card:", error);
      return null;
    }
  };

  try {
    const vocabularyCard = await getVocabularyCard();
    const cardParam = await getCardParam();

    if (!vocabularyCard || !vocabularyCard.vocabulary) {
      return <p>No vocabulary found</p>;
    }

    const vocabulary = vocabularyCard.vocabulary
      .map(
        (vocab: {
          id: string;
          name: string;
          translation: string;
          pronunciation: string;
          review: boolean;
        }) => {
          if (!vocab.review) {
            const base = vocab.name;
            const translation = `${vocab.translation} (${vocab.pronunciation})`;
            return {
              id: vocab.id,
              front: cardParam?.translationOnVerso ? translation : base,
              back: cardParam?.translationOnVerso ? base : translation,
            };
          }
          return null;
        }
      )
      .filter(Boolean)
      .sort(() => (cardParam?.random ? Math.random() - 0.5 : 0));

    // Vérification supplémentaire : si vocabulary est vide après filtrage
    if (vocabulary.length === 0) {
      return <p>Aucun vocabulaire à réviser pour cette carte.</p>;
    }

    return (
      <CardsComponent
        list={vocabulary}
        id={id}
        cardParam={cardParam || { random: false, translationOnVerso: false }}
      />
    );
  } catch (error) {
    console.error("Error loading vocabulary:", error);
    return <p>Error loading vocabulary. Please try again later.</p>;
  }
}
