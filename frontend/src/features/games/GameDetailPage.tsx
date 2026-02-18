import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gamesService } from '../../services/gamesService';
import type { Game } from '../../types/game';

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: game, isLoading, error } = useQuery<Game>({
    queryKey: ['game', id],
    queryFn: () => gamesService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center p-10">Loading...</div>;
  if (error || !game) return <div className="text-center p-10">Game not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← بازگشت
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={game.background_image || 'https://via.placeholder.com/800x400'}
          alt={game.name}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-700 leading-relaxed">{game.description_raw}</p>
            </div>
            <div className="space-y-2">
              <div><strong>Released:</strong> {game.released}</div>
              <div><strong>Rating:</strong> ⭐ {game.rating}</div>
              <div><strong>Genres:</strong> {game.genres?.map((g) => g.name).join(', ')}</div>
              <div><strong>Platforms:</strong> {game.platforms?.map((p) => p.platform.name).join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}