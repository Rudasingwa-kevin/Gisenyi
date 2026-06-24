import Places from '../components/Places';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/site';

const StaysPage = (props) => (
  <div className="pt-16 md:pt-20">
    <SEO
      title={PAGE_SEO.stays.title}
      description={PAGE_SEO.stays.description}
      url={PAGE_SEO.stays.url}
      image={PAGE_SEO.stays.image}
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
