import { useEffect } from 'react';
import Script from 'next/script';
import { Box, Text, Center } from '@chakra-ui/react';

export default function AdSense({ adSlot }) {
  // Versão de demonstração
  return (
    <Box 
      w="full" 
      h="100px" 
      bg="gray.100" 
      borderRadius="md" 
      border="2px dashed" 
      borderColor="blue.300"
      position="relative"
    >
      <Center h="full">
        <Text color="blue.500" fontWeight="bold">
           Demo AdSense
        </Text>
      </Center>
      <Text 
        position="absolute" 
        bottom="2px" 
        right="2px" 
        fontSize="xs" 
        color="gray.500"
      >
        {adSlot}
      </Text>
    </Box>
  );

  // Versão real do AdSense (comentada para demonstração)
  /*
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Erro ao carregar anúncio:', err);
    }
  }, []);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3940256099942544"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
  */
} 