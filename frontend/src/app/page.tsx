import { BookView } from "../components/BookView";
import { fetchEvents, fetchMapComposition } from "../services/books";

export default async function Home() {
  const [events, composition] = await Promise.allSettled([fetchEvents(), fetchMapComposition()]);

  return (
    <BookView
      events={events.status === "fulfilled" ? events.value : []}
      composition={composition.status === "fulfilled" ? composition.value : null}
    />
  );
}
