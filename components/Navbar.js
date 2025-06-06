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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" }
    
  ];

  const NavLink = ({ href, label }) => (
    <ChakraProvider>
      {" "}
      <Link href={href} passHref legacyBehavior>
        <Button
          as="a"
          variant="ghost"
          _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
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

          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />

          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </HStack>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack spacing={4}>
              {links.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}
