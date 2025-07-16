interface MediaViewerFilmstripProps {
  images: string[];
  currentIndex: number;
  onImageSelect: (index: number) => void;
}

export function MediaViewerFilmstrip({
  images,
  currentIndex,
  onImageSelect,
}: MediaViewerFilmstripProps) {
  if (images.length <= 1) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <div className="flex gap-2 justify-center overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
              index === currentIndex ? 'border-white' : 'border-transparent hover:border-white/50'
            }`}
          >
            <img
              src={image || '/placeholder.svg'}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
