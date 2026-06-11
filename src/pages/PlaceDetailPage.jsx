import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Navigation, ExternalLink, Globe, Phone, Clock, Tag } from 'lucide-react';
import { CATEGORIES } from '../constants/data';

const catImages = {
  hotels: '1542314831-068cd1dbfeeb',
  dining: '1566073771259-6a8506099945',
  nightlife: '1470337458703-46a199543c0b',
  beach: '1507525428697-bcebc0197c25',
  wellness: '1544367567-0f2fcb009e0b',
  activities: '1506905925346-21bda4d32df4',
  shopping: '1441986300917-64674bd600d8',
  practical: '1497366811353-507074f9a6d2',
};

const galleryPhotos = {
  hotels: ['1542314831-068cd1dbfeeb', '1568082403150-5a1c6b0b6b0b', '1571896349842-3b0f6b7e5b6b', '1564501044768-365f9b3c7f6a', '1590490359680-5c7b7b8b9c0d'],
  dining: ['1566073771259-6a8506099945', '1414235077428-338939fa3b6c', '1555396273-4b0c7b9e8d6f', '1504674900247-0875b9c6b8a7', '1514932329294-7b5b6c3d8e9f'],
  nightlife: ['1470337458703-46a199543c0b', '1496337589254-7f6b5e4c3d2a', '1514525253161-1c0b6a9e8d7f', '1470229722913-7c0e2d3b4a5f', '1492681598847-3d8c6b5a4f3e'],
  beach: ['1507525428697-bcebc0197c25', '1500373990745-0b9f6e5d4c3b', '1519044800-0b5e9c7d8f6a', '1476514525535-07fb3b4a5c6d', '1534008897995-7f8e9d0c1b2a'],
  wellness: ['1544367567-0f2fcb009e0b', '1540575466988-6b5c8d9e0f1a', '1519823551271-4b7c8d9e0f2b', '1497366811353-507074f9a6d2', '1544367567-0f2fcb009e0b'],
  activities: ['1506905925346-21bda4d32df4', '1469854523086-cc02fe5d8800', '1501785888041-af3ef2b0e9c8', '1470071459604-7b8c9d0e1f2a', '1510312305650-4b6c7d8e9f0b'],
  shopping: ['1441986300917-64674bd600d8', '1472851290288-d8b7c9d0e1f2', '1555529771-3b4c5d6e7f8a', '1483985988355-d8e9f0a1b2c3', '1441986300917-64674bd600d8'],
  practical: ['1497366811353-507074f9a6d2', '1497366216548-4b5c6d7e8f9a', '1504384308090-c7d8e9f0a1b2', '1486312338219-1b2c3d4e5f6a', '1497366811353-507074f9a6d2'],
};

export default function PlaceDetailPage({ places }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const place = useMemo(() => places.find(p => p.id === id), [places, id]);
  const related = useMemo(() =>
    places.filter(p => p.catKey === place?.catKey && p.id !== id).slice(0, 4),
    [places, place, id]
  );

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="text-center">
          <h2 className="text-2xl font-sora font-bold text-white mb-2">Place not found</h2>
          <button onClick={() => navigate('/stays')} className="text-gold-500 hover:text-gold-400 text-sm font-inter">Back to stays</button>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[place.catKey] || CATEGORIES.all;
  const photoId = catImages[place.catKey] || '1542314831-068cd1dbfeeb';
  const heroImage = place.image || `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1920&h=1080`;
  const gallery = (place.gallery && place.gallery.length > 0)
    ? place.gallery.slice(0, 4)
    : (galleryPhotos[place.catKey] || galleryPhotos.hotels).slice(0, 4).map(id =>
        `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=60&w=400&h=400`
      );
  const stars = Math.round(place.rating || 4.5);
  const tags = place.tags || {};

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-dark text-white/80 hover:text-white transition-all text-sm font-inter"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-navy-900/90 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full glass-dark text-[9px] font-poppins font-bold text-gold-500 uppercase tracking-[0.15em]">
                  {cat.icon} {cat.label}
                </span>
                {place.rating && (
                  <span className="flex items-center gap-1 text-sm text-white/60 font-inter">
                    <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                    {place.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-sora font-extrabold text-white mb-2">{place.name}</h1>
              <p className="text-white/40 text-sm font-inter flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-950 rounded-xl font-sora font-bold text-sm hover:bg-gold-400 transition-all shrink-0"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-sm font-poppins font-bold text-gold-500 uppercase tracking-[0.2em] mb-3">About</h2>
                <p className="text-white/70 font-inter leading-relaxed">
                  {place.description || tags.description || `Discover ${place.name}, a premier ${cat.label.toLowerCase()} destination in Gisenyi, Rubavu District. Located along the stunning shores of Lake Kivu, this location offers an unforgettable experience for visitors.`}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-poppins font-bold text-gold-500 uppercase tracking-[0.2em] mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gallery.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group aspect-square rounded-xl overflow-hidden bg-navy-800"
                    >
                      <img
                        src={url}
                        alt={`${place.name} photo ${i + 1}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {tags.cuisine && (
                <div>
                  <h2 className="text-sm font-poppins font-bold text-gold-500 uppercase tracking-[0.2em] mb-3">Cuisine</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.cuisine.split(';').map(c => (
                      <span key={c} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/60 font-inter">{c.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {tags.phone && (
                  <a href={`tel:${tags.phone}`} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                    <span className="text-sm text-white/60 font-inter truncate">{tags.phone}</span>
                  </a>
                )}
                {tags.website && (
                  <a href={tags.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <Globe className="w-4 h-4 text-gold-500 shrink-0" />
                    <span className="text-sm text-white/60 font-inter truncate">Website</span>
                  </a>
                )}
                {tags['opening_hours'] && (
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Clock className="w-4 h-4 text-gold-500 shrink-0" />
                    <span className="text-sm text-white/60 font-inter truncate">{tags['opening_hours']}</span>
                  </div>
                )}
              </div>

              <a
                href={`https://www.google.com/maps?q=${place.lat},${place.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 font-inter transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> View on Google Maps
              </a>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <h3 className="text-xs font-poppins font-bold text-gold-500 uppercase tracking-[0.2em]">Details</h3>
                <div className="space-y-3">
                  {stars > 0 && (
                    <div>
                      <span className="text-[10px] text-white/30 font-inter block mb-1">Rating</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-gold-500 text-gold-500' : 'text-white/10'}`} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-white/30 font-inter block mb-1">Category</span>
                    <span className="text-sm text-white font-inter">{cat.icon} {cat.label}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/30 font-inter block mb-1">Location</span>
                    <span className="text-sm text-white/60 font-inter">Gisenyi, Rubavu District</span>
                  </div>
                  {tags['addr:street'] && (
                    <div>
                      <span className="text-[10px] text-white/30 font-inter block mb-1">Address</span>
                      <span className="text-sm text-white/60 font-inter">{tags['addr:street']}</span>
                    </div>
                  )}
                </div>
              </div>

              {related.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-poppins font-bold text-gold-500 uppercase tracking-[0.2em] mb-4">More {cat.label}</h3>
                  <div className="space-y-2">
                    {related.map(r => (
                      <Link
                        key={r.id}
                        to={`/stays/${r.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-gold-500 shrink-0" />
                        <span className="text-sm text-white/70 font-inter truncate">{r.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
