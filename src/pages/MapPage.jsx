import MapView from '../components/MapView';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/site';

const MapPage = (props) => (
  <div className="pt-16 md:pt-20">
    <SEO
      title={PAGE_SEO.map.title}
      description={PAGE_SEO.map.description}
      url={PAGE_SEO.map.url}
      image={PAGE_SEO.map.image}
      type="website"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Gisenyi Interactive Map',
        description: 'Interactive map of Gisenyi showing hotels, restaurants and attractions',
        applicationCategory: 'TravelApplication',
        url: 'https://gisenyi.top/map',
      }}
    />
    <MapView {...props} />
  </div>
);

export default MapPage;
