import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);

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
      />
    </ChakraProvider>
  );
}
