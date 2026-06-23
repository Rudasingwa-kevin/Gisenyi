import MapView from '../components/MapView';
import SEO from '../components/SEO';

const MapPage = (props) => (
  <div className="pt-16 md:pt-20">
    <SEO
      title="Interactive Map of Gisenyi"
      description="Explore Gisenyi with our interactive map. Navigate hotels, restaurants, attractions and more along the shores of Lake Kivu, Rwanda."
      url="/map"
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
