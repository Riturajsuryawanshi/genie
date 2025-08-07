import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO = ({ 
  title = "CallGenie - AI-Powered Voice Assistant",
  description = "Get your AI phone assistant in 60 seconds. CallGenie provides intelligent voice conversations, 24/7 availability, and natural language processing. Try free for 7 days.",
  keywords = "AI voice assistant, phone automation, voice AI, call handling, business phone system",
  image = "https://callgenie.ai/logo.png",
  url = "https://callgenie.ai",
  type = "website"
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) || 
                   document.querySelector(`meta[property="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', url);
    updateMeta('og:type', type);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:url', url);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    }
  }, [title, description, keywords, image, url, type]);

  return null;
};