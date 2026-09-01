import React, { useState } from 'react';
import { 
  Camera, Maximize2, X, MapPin, Sparkles, Image as ImageIcon, ExternalLink, ChevronRight, ChevronLeft
} from 'lucide-react';
import { DestinationPhoto, getPhotosForDestination, PHARAONIC_HERITAGE_GALLERY } from '../data/destinationPhotos';
import { WingedSunSymbol } from './PharaonicDecorations';

interface DestinationPhotoGalleryProps {
  destination: string;
  durationDays?: number;
}

export const DestinationPhotoGallery: React.FC<DestinationPhotoGalleryProps> = ({
  destination,
  durationDays = 5,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<DestinationPhoto | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPharaonicMode, setIsPharaonicMode] = useState<boolean>(
    destination.includes('مصر') || destination.includes('القاهرة') || destination.includes('الأقصر') || destination.includes('أسوان') || destination.includes('الجيزة')
  );

  const destinationPhotos = getPhotosForDestination(destination);
  const displayedPhotos = isPharaonicMode ? PHARAONIC_HERITAGE_GALLERY : destinationPhotos;

  const filteredPhotos = activeCategory === 'all'
    ? displayedPhotos
    : displayedPhotos.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#060a12] border border-[#d4af37]/35 rounded-3xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.7)] space-y-5 overflow-hidden relative">
      
      {/* Background Decorative Hieroglyphic Watermark */}
      <div className="absolute top-3 left-4 text-xs opacity-5 text-[#d4af37] font-serif select-none pointer-events-none">
        𓂀 𓆣 𓋹 𓊪 𓎛 𓏏 𓉴 𓍹 𓍺
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8a6d1c] p-0.5 shadow-md shadow-[#d4af37]/25 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#0a1221] rounded-[14px] flex items-center justify-center text-[#d4af37]">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>معرض الصور الملكي والاستكشاف البصري</span>
                <span className="text-sm">📸</span>
              </h3>
            </div>
            <p className="text-xs text-[#9eb3cf]">
              لقطات حية عالية الدقة لوجهة <span className="text-[#d4af37] font-bold">{destination}</span> وكنوز التراث الفرعوني
            </p>
          </div>
        </div>

        {/* Gallery Collection Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#070d17] p-1 rounded-xl border border-[#d4af37]/30">
          <button
            type="button"
            onClick={() => setIsPharaonicMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isPharaonicMode
                ? 'bg-[#d4af37] text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            صور {destination.split('،')[0]}
          </button>
          <button
            type="button"
            onClick={() => setIsPharaonicMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isPharaonicMode
                ? 'bg-[#d4af37] text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>𓂀 كنوز الفراعنة</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: 'all', label: 'جميع اللقطات', icon: Sparkles },
          { id: 'heritage', label: 'معالم أثرية وتاريخية', icon: Camera },
          { id: 'culture', label: 'ثقافة وحياة أصيلة', icon: ImageIcon },
          { id: 'nature', label: 'طبيعة ونيل', icon: MapPin },
        ].map((cat) => {
          const isSelected = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5d061] font-bold shadow-sm'
                  : 'bg-[#0b1220] border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3 h-3 text-[#d4af37]" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#0c1424] cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all hover:scale-[1.02] aspect-[16/10]"
          >
            <img
              src={photo.url}
              alt={photo.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-right">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#d4af37]/90 text-black font-extrabold shadow-sm">
                  {photo.category === 'heritage' ? 'معلم فرعوني / تاريخي 🏛️' : photo.category === 'nature' ? 'طبيعة ونيل ⛵' : 'تراث وثقافة 💎'}
                </span>
                <div className="w-6 h-6 rounded-full bg-black/60 text-[#d4af37] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#f5d061] transition-colors">
                {photo.title}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-neutral-300 mt-0.5">
                <MapPin className="w-3 h-3 text-[#d4af37]" />
                <span className="line-clamp-1">{photo.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#090e1a] border border-[#d4af37]/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-[#d4af37]/30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Info Bar */}
            <div className="p-4 sm:p-6 bg-[#0a1222] border-t border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d061] border border-[#d4af37]/40 font-bold">
                    𓂀 لقطة استكشافية ملكية
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    {selectedPhoto.location}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {selectedPhoto.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPhoto.title + ' ' + selectedPhoto.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#d4af37]/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في خرائط Google</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
