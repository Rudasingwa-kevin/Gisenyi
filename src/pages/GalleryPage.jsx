import Gallery from '../components/Gallery';

const GalleryPage = ({ photos }) => (
  <div className="pt-16 md:pt-20">
    <Gallery photos={photos} />
  </div>
);

export default GalleryPage;
