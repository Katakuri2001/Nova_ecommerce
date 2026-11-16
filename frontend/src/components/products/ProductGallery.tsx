import React from 'react';
export default function ProductGallery({ images, productName }: { images: { image_url: string; thumbnail_url: string | null }[]; productName: string }) {
  const [selected, setSelected] = React.useState(0);
  
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-2xl overflow-hidden bg-surface-900">
        <img src={images[selected]?.image_url || 'https://picsum.photos/800/800'} alt={productName} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button key={i} onClick={() => setSelected(i)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === selected ? 'border-nova-500' : 'border-transparent hover:border-surface-600'}`}>
              <img src={img.thumbnail_url || img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
