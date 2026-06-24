import History from '../components/History';
import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/site';

const HistoryPage = () => (
  <div className="pt-16 md:pt-20">
    <SEO
      title={PAGE_SEO.history.title}
      description={PAGE_SEO.history.description}
      url={PAGE_SEO.history.url}
      image={PAGE_SEO.history.image}
      type="article"
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'History of Gisenyi',
        description: 'Explore the rich history of Gisenyi — from volcanic genesis to the modern renaissance.',
        author: { '@type': 'Organization', name: 'Gisenyi Guide' },
        publisher: { '@type': 'Organization', name: 'Gisenyi Guide' },
      }}
    />
    <History />
  </div>
);

export default HistoryPage;
