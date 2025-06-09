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
  Container,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function Navbar({ 
  selectedCategories, 
  setSelectedCategories, 
  selectedDifficulties, 
  setSelectedDifficulties,
  setShowGameOptions,
  setFirstTime,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" }
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
      <Box as="nav" bg={useColorModeValue("white", "gray.900")} px={4} boxShadow="sm" position="sticky" top={0} zIndex={1000}>
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <HStack spacing={8} alignItems="center">
              <Link href="/" passHref>
                <Box as="a" fontSize="xl" fontWeight="bold" color="blue.500" onClick={() => {
                  setSelectedCategories([]);
                  setSelectedDifficulties([]);
                  setShowGameOptions(false);
                  setFirstTime(true);
                }}>
                  Trivia Game
                </Box>
              </Link>
              <HStack spacing={6} display={{ base: "none", md: "flex" }}>
                {links.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </HStack>
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
              <Stack as="nav" spacing={4}>
                {links.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </Stack>
            </Box>
          )}
        </Container>
      </Box>
    </ChakraProvider>
  );
}
