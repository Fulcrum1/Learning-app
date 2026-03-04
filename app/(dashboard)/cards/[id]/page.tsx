import "./page.css";
import CardsComponent from "@/components/Cards/Card";
import { BACKEND_URL } from "@/lib/constants";
import { CardParam, ListResponse, Words } from "@/lib/type";
import { getSession } from "@/lib/session";
import { apiRequest } from "@/lib/api-request";
import { BaseResponse, WordsCardResponse } from "@/lib/type";

interface PageProps {
  params: {
    id: string;
  };
}
interface CardPageProps {
  data: CardParam;
}

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;
  const key = await getSession();

  const getCardParam = async (): Promise<CardParam | null> => {
    try {
      const response = await apiRequest.get(
        `${BACKEND_URL}/api/card/param-card/${key?.user?.id}`
      ) as CardPageProps;
      const data = response.data;

      return data;
    } catch (error) {
      console.error("Error fetching card param:", error);
      return null;
    }
  };
  
  const getWordsCard = async () => {
    try {
      const response = await apiRequest.get(`${BACKEND_URL}/api/card/words-card/${id}`) as WordsCardResponse;
      const data = response;
      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Error fetching words card:", error);
      return null;
    }
  };

  // Fetch data directement dans le corps du composant
  try {
    const wordsCard = await getWordsCard();
    const cardParam = await getCardParam();

    if (!wordsCard || !wordsCard.words) {
      return <p>No words found</p>;
    }

    const words = wordsCard.words
      .map(
        (word: Words) => {
          if (!word.review) {
            const base = word.word.word;
            const translation = `${word.word.translation} ${word.word.pronunciation ? `(${word.word.pronunciation})` : ""}`;
            return {
              id: word.id,
              front: cardParam?.translationOnVerso ? translation : base,
              back: cardParam?.translationOnVerso ? base : translation,
            };
          }
          return null;
        }
      )
      .filter(Boolean)
      .sort(() => (cardParam?.random ? Math.random() - 0.5 : 0));

    if (words.length === 0) {
      return <p>No words to review for this card.</p>;
    }

    console.log("words", words);

    return (
      <CardsComponent
        list={words}
        id={id}
        cardParam={cardParam || { random: false, translationOnVerso: false }}
      />
    );
  } catch (error) {
    console.error("Error loading words:", error);
    return <p>Error loading words. Please try again later.</p>;
  }
}