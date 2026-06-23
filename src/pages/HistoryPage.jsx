import History from '../components/History';
import SEO from '../components/SEO';

const HistoryPage = () => (
  <div className="pt-16 md:pt-20">
    <SEO
      title="History of Gisenyi"
      description="Explore the rich history of Gisenyi — from volcanic genesis to the modern renaissance. Discover the chronicles of Rwanda's most resilient city on Lake Kivu."
      url="/history"
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
