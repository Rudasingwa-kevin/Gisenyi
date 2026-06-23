import Places from '../components/Places';
import SEO from '../components/SEO';

const StaysPage = (props) => (
  <div className="pt-16 md:pt-20">
    <SEO
      title="Stays & Places in Gisenyi"
      description="Discover the best hotels, resorts, restaurants and places to stay in Gisenyi, Rwanda. Browse curated destinations on the shores of Lake Kivu."
      url="/stays"
      type="website"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Stays & Places in Gisenyi',
        description: 'Hotels, resorts, restaurants and places to stay in Gisenyi, Rwanda',
        numberOfItems: 50,
        itemListElement: [],
      }}
    />
    <Places {...props} />
  </div>
);

export default StaysPage;
