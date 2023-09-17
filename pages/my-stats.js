import { useState, useEffect, useMemo } from "react";
import styles from "../styles/Home.module.css";
import {
  Button,
  Checkbox,
  Stack,
  Text,
  VStack,
  HStack,
  Box,
  ChakraProvider,
  Center,
} from "@chakra-ui/react";
import { Alert, Space } from "antd";

export default function Reservations() {
  return (
    <div>
      <ChakraProvider>
        <Center>
          <HStack spacing={4} align="center">
            <Button>My Stats</Button>
          </HStack>
        </Center>
      </ChakraProvider>
    </div>
  );
}
