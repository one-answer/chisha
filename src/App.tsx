import { ChakraProvider, Container, Heading, VStack } from '@chakra-ui/react'
import FoodSelector from './components/FoodSelector'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10}>
        <VStack gap={8}>
          <Heading as="h1" size="2xl" textAlign="center" color="teal.500">
            今天吃什么？
          </Heading>
          <Heading as="h2" size="md" color="gray.500">
            解决选择困难症 😋
          </Heading>
          <FoodSelector />
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App
