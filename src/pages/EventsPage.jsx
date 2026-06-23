import Events from '../components/Events';
import SEO from '../components/SEO';

const EventsPage = () => (
  <div className="pt-16 md:pt-20">
    <SEO
      title="Events in Gisenyi"
      description="Discover upcoming events, festivals and happenings in Gisenyi, Rwanda. Stay updated on the latest activities along Lake Kivu."
      url="/events"
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
