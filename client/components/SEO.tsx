import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
}

/**
 * SEO Component: Updates document head elements for Single Page Application navigation.
 */
const SEO: React.FC<SEOProps> = ({ title, description, canonical }) => {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | SkillSwap`;
    document.title = fullTitle;

    // Update Meta Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }
    }

    // Update Canonical URL
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (linkCanonical) {
        linkCanonical.setAttribute('href', canonical);
      } else {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        linkCanonical.setAttribute('href', canonical);
        document.head.appendChild(linkCanonical);
      }
    }
  }, [title, description, canonical]);

  return null; // This component doesn't render any UI
};

export default SEO;