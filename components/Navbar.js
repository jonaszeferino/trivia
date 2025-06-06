import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  useColorModeValue,
  Text,
  ChakraProvider,
  VStack,
  SimpleGrid,
  Checkbox,
  SlideFade,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ 
  selectedCategories, 
  setSelectedCategories, 
  selectedDifficulties, 
  setSelectedDifficulties 
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showOptions, setShowOptions] = useState(false);
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" }
  ];

  const categoryOptions = [
    { name: "arts_and_literature", displayName: "Arts & Literature" },
    { name: "film_and_tv", displayName: "Cinema & TV" },
    { name: "food_and_drink", displayName: "Food & Drink" },
    { name: "general_knowledge", displayName: "General Knowledge" },
    { name: "geography", displayName: "Geography" },
    { name: "history", displayName: "History" },
    { name: "music", displayName: "Music" },
    { name: "science", displayName: "Science" },
    { name: "society_and_culture", displayName: "Society & Culture" },
    { name: "sport_and_leisure", displayName: "Sport & Leisure" },
  ];

  const difficultyOptions = [
    { name: "easy", displayName: "Easy" },
    { name: "medium", displayName: "Medium" },
    { name: "hard", displayName: "Hard" },
  ];

  const NavLink = ({ href, label }) => (
    <ChakraProvider>
      <Link href={href} passHref legacyBehavior>
        <Button
          as="a"
          variant="ghost"
          _hover={{ bg: hoverBg }}
        >
          {label}
        </Button>
      </Link>
    </ChakraProvider>
  );

  return (
    <ChakraProvider>
      <Box bg={useColorModeValue("white", "gray.900")} px={4} boxShadow="sm">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Trivia
          </Text>

          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <Button
              onClick={() => setShowOptions(!showOptions)}
              variant="ghost"
              _hover={{ bg: hoverBg }}
            >
              Game Options
            </Button>
          </HStack>

          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack spacing={4}>
              {links.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
              <Button
                onClick={() => setShowOptions(!showOptions)}
                variant="ghost"
                _hover={{ bg: hoverBg }}
              >
                Game Options
              </Button>
            </Stack>
          </Box>
        )}

        <SlideFade in={showOptions} offsetY="-20px">
          {showOptions && (
            <Box 
              w="full" 
              bg="white" 
              p={6} 
              borderRadius="xl" 
              boxShadow="lg"
              mb={4}
              position="relative"
              zIndex={1000}
            >
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={4} color="black">
                    Categories
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {categoryOptions.map((category, index) => (
                      <Box
                        key={index}
                        p={3}
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ bg: "gray.50" }}
                      >
                        <HStack>
                          <Checkbox
                            id={category.name}
                            name={category.name}
                            isChecked={selectedCategories.includes(category.name)}
                            onChange={(event) => {
                              const isChecked = event.target.checked;
                              setSelectedCategories((prevState) =>
                                isChecked
                                  ? [...prevState, category.name]
                                  : prevState.filter((c) => c !== category.name)
                              );
                            }}
                          />
                          <Text color="black" as="label" htmlFor={category.name}>
                            {category.displayName}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={4} color="black">
                    Difficulty
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    {difficultyOptions.map((difficulty, index) => (
                      <Box
                        key={index}
                        p={3}
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ bg: "gray.50" }}
                      >
                        <HStack>
                          <Checkbox
                            id={difficulty.name}
                            name={difficulty.name}
                            isChecked={selectedDifficulties.includes(difficulty.name)}
                            onChange={(event) => {
                              const isChecked = event.target.checked;
                              if (isChecked) {
                                setSelectedDifficulties([difficulty.name]);
                              } else {
                                setSelectedDifficulties((prevState) =>
                                  prevState.filter((d) => d !== difficulty.name)
                                );
                              }
                            }}
                          />
                          <Text color="black" as="label" htmlFor={difficulty.name}>
                            {difficulty.displayName}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </VStack>
            </Box>
          )}
        </SlideFade>
      </Box>
    </ChakraProvider>
  );
}
