import "./page.css";
import CardsComponent from "@/components/Cards/Card";
import { BACKEND_URL } from "@/lib/constants";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;

  const response = await fetch(`${BACKEND_URL}/list/vocabulary-card/${id}`);
  const data = await response.json();

  const vocabulary = data.vocabulary.map((vocabulary: any) => ({
    id: vocabulary.id,
    front: vocabulary.name,
    back: vocabulary.translation + "(" + vocabulary.pronunciation + ")",
  }));

  return (
    vocabulary.length === 0 ? (
      <p>No vocabulary found</p>
    ) : (
      <CardsComponent list={vocabulary} id={id} />
    )
  );
}
