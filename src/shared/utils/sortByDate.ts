export type SortOption =
  | "newest"
  | "oldest";

interface HasCreatedAt {createdAt: string;}

export function sortByDate<T extends HasCreatedAt>(
  items: T[],
  sort: SortOption
): T[] {

  return [...items].sort(
    (a, b) => {

      const aDate = new Date(a.createdAt).getTime();

      const bDate = new Date(b.createdAt).getTime();

      return sort === "newest"
        ? bDate - aDate
        : aDate - bDate;
    }
  );
}