import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { gamesService } from "../../services/gamesService";
import { type Game, type Genre } from "../../types/game";
import { AdvancedSelect } from "../ui-kit/AdvancedSelect";
import {type SelectOption } from "../../types/select";
import { useMemo } from "react";
import { GamesSkeleton } from '../../components/ui/LoadingSkeleton';

export default function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const genres = searchParams.get("genres") || "";

  const selectedGenreIds = useMemo(() => {
    return genres ? genres.split(",").map(Number) : [];
  }, [genres]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["games", page, search, genres],
    queryFn: () => gamesService.getAll({ page, search, genres }),
  });
  
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => gamesService.getGenres(),
    staleTime: 1000 * 60 * 60, 
  });

  const genreOptions: SelectOption[] = useMemo(() => {
    return genresData?.map((g: Genre) => ({
      id: g.id,
      label: g.name,
      group: "ژانر",
    })) || [];
  }, [genresData]);

  const selectedGenres = useMemo(() => {
    if (selectedGenreIds.length === 0) return [];
    return genreOptions.filter((opt) =>
      selectedGenreIds.includes(Number(opt.id))
    );
  }, [genreOptions, selectedGenreIds]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;
    setSearchParams({ page: "1", search: searchValue, genres });
  };

  const handleGenreChange = (selected: SelectOption[]) => {
    const ids = selected.map((s) => s.id).join(",");
    setSearchParams({ page: "1", search, genres: ids });
  };

  if (isLoading) return <GamesSkeleton />;
  
  if (error)
    return (
      <div className="text-red-500 text-center p-10">
        Error loading games: {(error as Error).message}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">فروشگاه بازی</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="جستجوی بازی..."
            className="flex-1 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            جستجو
          </button>
        </form>

        <div className="w-full md:w-64">
          <AdvancedSelect
            label="فیلتر ژانر"
            options={genreOptions}
            value={selectedGenres}
            onChange={handleGenreChange}
            placeholder="انتخاب ژانر..."
            maxVisibleItems={5}
          />
        </div>
      </div>

      <div className="mb-4 text-gray-600">
        {data?.count || 0} بازی یافت شد
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.results?.map((game: Game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/games/${game.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            <img
              src={
                game.background_image ||
                "https://via.placeholder.com/400x200?text=No+Image"
              }
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{game.name}</h3>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>⭐ {game.rating}</span>
                <span>{game.released?.split("-")[0]}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {game.genres?.slice(0, 2).map((g) => (
                  <span
                    key={g.id}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.results?.length > 0 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={Number(page) <= 1}
            onClick={() =>
              setSearchParams({ page: String(Number(page) - 1), search, genres })
            }
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            قبلی
          </button>
          <span className="py-2">صفحه {page}</span>
          <button
            onClick={() =>
              setSearchParams({ page: String(Number(page) + 1), search, genres })
            }
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}