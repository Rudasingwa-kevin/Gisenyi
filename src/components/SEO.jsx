import { useEffect } from 'react';
import { SITE } from '../constants/site';

function setMeta(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('article:')) {
      el.setAttribute('property', property);
    } else {
      el.setAttribute('name', property);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export default function SEO({
  title,
  description,
  url,
  image,
  type = 'website',
  structuredData,
  noindex = false,
}) {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.name;
  const pageDesc = description || SITE.description;
  const pageUrl = url ? `${SITE.url}${url}` : SITE.url;
  const pageImage = image || SITE.ogImage;

  useEffect(() => {
    document.title = pageTitle;

    setMeta('description', pageDesc);
    setMeta('keywords', SITE.keywords.join(', '));

    setMeta('og:title', pageTitle);
    setMeta('og:description', pageDesc);
    setMeta('og:image', pageImage);
    setMeta('og:url', pageUrl);
    setMeta('og:type', type);
    setMeta('og:site_name', SITE.name);
    setMeta('og:locale', SITE.locale);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDesc);
    setMeta('twitter:image', pageImage);

    setCanonical(pageUrl);

    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    if (structuredData) {
      const existing = document.getElementById('seo-structured-data');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.id = 'seo-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
      return () => script.remove();
    }
  }, [pageTitle, pageDesc, pageUrl, pageImage, type, structuredData, noindex]);

  return null;
}
