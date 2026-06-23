import Gallery from '../components/Gallery';
import SEO from '../components/SEO';

const GalleryPage = ({ photos }) => (
  <div className="pt-16 md:pt-20">
    <SEO
      title="Photo Gallery of Gisenyi"
      description="Browse stunning photos of Gisenyi — the Riviera of Central Africa. Beautiful images of Lake Kivu, volcanic landscapes and lakeside life."
      url="/gallery"
      type="website"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'Gisenyi Photo Gallery',
        description: 'Stunning photos of Gisenyi and Lake Kivu, Rwanda',
      }}
    />
    <Gallery photos={photos} />
  </div>
);

export default GalleryPage;
