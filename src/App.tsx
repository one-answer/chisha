import { ChakraProvider, Container, Heading, VStack, Box } from '@chakra-ui/react'
import FoodSelector from './components/FoodSelector'
import { useEffect } from 'react'

// 结构化数据 - JSON-LD
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "吃啥",
  "alternateName": "今天吃什么",
  "description": "一个帮助解决"今天吃什么"选择困难症的有趣应用",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "author": {
    "@type": "Organization",
    "name": "吃啥应用团队"
  }
}

function App() {
  // 添加结构化数据到页面
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10} as="main">
        <VStack gap={8}>
          <header>
            <Heading as="h1" size="2xl" textAlign="center" color="teal.500">
              今天吃什么？
            </Heading>
            <Heading as="h2" size="md" color="gray.500">
              解决选择困难症 😋
            </Heading>
          </header>
          <FoodSelector />
          <Box as="footer" fontSize="sm" color="gray.500" textAlign="center" mt={8}>
            © {new Date().getFullYear()} 吃啥应用 - 解决选择困难症
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App
