import React, { useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [showGameOptions, setShowGameOptions] = useState(false);

  return (
    <ChakraProvider>
      <Navbar 
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedDifficulties={selectedDifficulties}
        setSelectedDifficulties={setSelectedDifficulties}
      />
      <Component 
        {...pageProps} 
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedDifficulties={selectedDifficulties}
        setSelectedDifficulties={setSelectedDifficulties}
        showGameOptions={showGameOptions}
        setShowGameOptions={setShowGameOptions}
      />
    </ChakraProvider>
  );
}
