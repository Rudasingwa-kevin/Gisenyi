import Events from '../components/Events';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/site';

const EventsPage = () => (
  <div className="pt-16 md:pt-20">
    <SEO
      title={PAGE_SEO.events.title}
      description={PAGE_SEO.events.description}
      url={PAGE_SEO.events.url}
      image={PAGE_SEO.events.image}
      type="website"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'EventSeries',
        name: 'Events in Gisenyi',
        description: 'Upcoming events, festivals and happenings in Gisenyi, Rwanda',
        location: {
          '@type': 'Place',
          name: 'Gisenyi',
          address: { '@type': 'PostalAddress', addressLocality: 'Gisenyi', addressRegion: 'Rubavu', addressCountry: 'RW' },
        },
      }}
    />
    <Events />
  </div>
);

export default EventsPage;
