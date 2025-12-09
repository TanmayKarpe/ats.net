import { useEffect } from 'react';

export function SmartsuppChat() {
  useEffect(() => {
    // Check if Smartsupp is already loaded to prevent duplicate initialization
    if (window.smartsupp && window.smartsupp._.length > 0) {
      return;
    }

    // Initialize _smartsupp object if it doesn't exist
    if (!window._smartsupp) {
      window._smartsupp = {};
    }

    // Set the API key
    window._smartsupp.key = '1b0ee5a5476e5d32eea15c889245d1a9538f335e';

    // Create and inject the Smartsupp loader script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src = 'https://www.smartsuppchat.com/loader.js?';

    // Handle errors gracefully (e.g., network issues, ad blocker)
    script.onerror = () => {
      console.warn('Smartsupp chat widget failed to load. This may be due to a network issue or ad blocker.');
    };

    // Insert script into the document
    const scriptTag = document.getElementsByTagName('script')[0];
    if (scriptTag && scriptTag.parentNode) {
      scriptTag.parentNode.insertBefore(script, scriptTag);
    } else {
      // Fallback: insert into document head
      document.head.appendChild(script);
    }

    // No cleanup needed - Smartsupp manages its own lifecycle
  }, []); // Empty dependency array: runs only once on mount

  // Component renders nothing - purely for side effects
  return null;
}

export default SmartsuppChat;
