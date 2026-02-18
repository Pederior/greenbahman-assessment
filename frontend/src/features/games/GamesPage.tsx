import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { gamesService } from '../../services/gamesService';
import {type Game } from '../../types/game';

export default function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const genres = searchParams.get('genres') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['games', page, search, genres],
    queryFn: () => gamesService.getAll({ page, search, genres }),
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    setSearchParams({ page: '1', search: searchValue, genres });
  };

  if (isLoading) return <div className="flex justify-center p-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-10">Error loading games</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">بازی‌ها</h1>
      
      {/* فیلتر جستجو */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="جستجوی بازی..."
          className="flex-1 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          جستجو
        </button>
      </form>

      {/* گرید بازی‌ها */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.results?.map((game: Game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/games/${game.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            <img
              src={game.background_image || 'https://via.placeholder.com/400x200?text=No+Image'}
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{game.name}</h3>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>⭐ {game.rating}</span>
                <span>{game.released?.split('-')[0]}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {game.genres?.slice(0, 2).map((g) => (
                  <span key={g.id} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* صفحه‌بندی ساده */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={Number(page) <= 1}
          onClick={() => setSearchParams({ page: String(Number(page) - 1), search, genres })}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="py-2">صفحه {page}</span>
        <button
          onClick={() => setSearchParams({ page: String(Number(page) + 1), search, genres })}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}