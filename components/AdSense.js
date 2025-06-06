import { useEffect } from 'react';
import Script from 'next/script';
import { Box } from '@chakra-ui/react';

export default function AdSense({ adSlot, format = 'auto' }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err);
    }
  }, []);

  // Define o tamanho do anúncio baseado no formato
  const getAdStyle = () => {
    switch (format) {
      case 'banner':
        return { width: '100%', height: '90px' };
      case 'rectangle':
        return { width: '100%', height: '250px' };
      case 'square':
        return { width: '100%', height: '300px' };
      default:
        return { width: '100%', height: 'auto' };
    }
  };

  return (
    <Box 
      w="full" 
      p={2} 
      borderRadius="md" 
      bg="white"
      boxShadow="sm"
    >
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5165191224568168"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...getAdStyle()
        }}
        data-ad-client="ca-pub-5165191224568168"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </Box>
  );
} 