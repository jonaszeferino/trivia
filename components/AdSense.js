import { useEffect } from 'react';
import Script from 'next/script';
import { Box } from '@chakra-ui/react';

export default function AdSense({ adSlot, format = 'auto' }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err);
    }
  }, []);

  // Define o tamanho do anúncio baseado no formato
  const getAdStyle = () => {
    switch (format) {
      case 'banner':
        return { width: '100%', height: '90px', position: 'relative', zIndex: 1 };
      case 'rectangle':
        return { width: '100%', height: '250px', position: 'relative', zIndex: 1 };
      case 'square':
        return { width: '100%', height: '300px', position: 'relative', zIndex: 1 };
      default:
        return { width: '100%', height: 'auto', position: 'relative', zIndex: 1 };
    }
  };

  return (
    <Box 
      w="full" 
      p={2} 
      borderRadius="md" 
      bg="white"
      boxShadow="sm"
      position="relative"
      zIndex={1}
    >
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5165191224568168"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Erro ao carregar script do AdSense:', e);
        }}
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