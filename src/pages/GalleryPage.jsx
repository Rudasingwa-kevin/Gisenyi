import Gallery from '../components/Gallery';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/site';

const GalleryPage = ({ photos }) => (
  <div className="pt-16 md:pt-20">
    <SEO
      title={PAGE_SEO.gallery.title}
      description={PAGE_SEO.gallery.description}
      url={PAGE_SEO.gallery.url}
      image={PAGE_SEO.gallery.image}
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
