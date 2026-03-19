import {
  Box,
  ChakraProvider,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  extendTheme,
} from '@chakra-ui/react'
import FoodSelector from './components/FoodSelector'
import { useEffect } from 'react'

// 结构化数据 - JSON-LD
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "吃啥",
  "alternateName": "今天吃什么",
  "description": "一个帮助解决\"今天吃什么\"选择困难症的有趣应用",
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

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#f7efe4',
        color: '#2f241f',
      },
      '#root': {
        minHeight: '100vh',
      },
      '::selection': {
        background: '#ff9c5b',
        color: '#2f241f',
      },
    },
  },
  fonts: {
    heading: `'Trebuchet MS', 'Avenir Next', sans-serif`,
    body: `'Trebuchet MS', 'Avenir Next', sans-serif`,
  },
})

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
    <ChakraProvider theme={theme}>
      <Box
        as="main"
        minH="100vh"
        bgGradient="radial(circle at top, rgba(255,245,230,0.96) 0%, rgba(247,239,228,1) 42%, rgba(239,223,205,1) 100%)"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-12rem"
          right="-8rem"
          w="24rem"
          h="24rem"
          borderRadius="full"
          bg="rgba(255, 176, 92, 0.24)"
          filter="blur(10px)"
        />
        <Box
          position="absolute"
          bottom="-10rem"
          left="-8rem"
          w="22rem"
          h="22rem"
          borderRadius="full"
          bg="rgba(214, 88, 60, 0.18)"
          filter="blur(10px)"
        />

        <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
          <Grid templateColumns={{ base: '1fr', lg: '0.95fr 1.05fr' }} gap={{ base: 6, lg: 10 }} alignItems="start">
            <GridItem>
              <VStack align="stretch" gap={6}>
                <Box
                  borderRadius="32px"
                  border="1px solid rgba(126, 82, 54, 0.14)"
                  bg="rgba(255,255,255,0.68)"
                  backdropFilter="blur(14px)"
                  boxShadow="0 24px 80px rgba(121, 74, 47, 0.14)"
                  p={{ base: 6, md: 8 }}
                >
                  <VStack align="stretch" gap={5}>
                    <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
                      <Box>
                        <Text
                          display="inline-flex"
                          px={3}
                          py={1}
                          borderRadius="full"
                          bg="orange.100"
                          color="orange.800"
                          fontSize="sm"
                          fontWeight="bold"
                          letterSpacing="0.04em"
                        >
                          CHISHA DINER
                        </Text>
                        <Heading as="h1" mt={4} fontSize={{ base: '4xl', md: '6xl' }} lineHeight="0.95">
                          今天吃什么，
                          <br />
                          让胃替你做决定。
                        </Heading>
                      </Box>
                      <Box
                        px={4}
                        py={3}
                        borderRadius="24px"
                        bg="rgba(92, 58, 40, 0.95)"
                        color="orange.50"
                        minW="180px"
                      >
                        <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" opacity={0.72}>
                          今日模式
                        </Text>
                        <Text mt={2} fontSize="lg" fontWeight="bold">
                          选择困难急救中
                        </Text>
                        <Text mt={1} fontSize="sm" opacity={0.76}>
                          点一点，马上出餐建议
                        </Text>
                      </Box>
                    </HStack>

                    <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(47, 36, 31, 0.76)" maxW="2xl">
                      这是一个给纠结星人的吃饭决策站。你可以随机抽签、按心情匹配，或者顺着当前时段挑选，让“随便吃点”终于有个答案。
                    </Text>

                    <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={4}>
                      <Stat
                        borderRadius="24px"
                        p={4}
                        bg="rgba(255, 247, 239, 0.9)"
                        border="1px solid rgba(161, 105, 66, 0.14)"
                      >
                        <StatLabel color="rgba(47, 36, 31, 0.65)">随机抽签</StatLabel>
                        <StatNumber fontSize="2xl">1 秒上头</StatNumber>
                      </Stat>
                      <Stat
                        borderRadius="24px"
                        p={4}
                        bg="rgba(255, 247, 239, 0.9)"
                        border="1px solid rgba(161, 105, 66, 0.14)"
                      >
                        <StatLabel color="rgba(47, 36, 31, 0.65)">情绪推荐</StatLabel>
                        <StatNumber fontSize="2xl">5 种心情</StatNumber>
                      </Stat>
                      <Stat
                        borderRadius="24px"
                        p={4}
                        bg="rgba(255, 247, 239, 0.9)"
                        border="1px solid rgba(161, 105, 66, 0.14)"
                      >
                        <StatLabel color="rgba(47, 36, 31, 0.65)">自定义菜单</StatLabel>
                        <StatNumber fontSize="2xl">无限加菜</StatNumber>
                      </Stat>
                    </Grid>
                  </VStack>
                </Box>

                <Box
                  borderRadius="28px"
                  p={{ base: 5, md: 6 }}
                  bg="rgba(92, 58, 40, 0.96)"
                  color="orange.50"
                  boxShadow="0 18px 40px rgba(92, 58, 40, 0.24)"
                >
                  <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.14em" opacity={0.72}>
                    使用方式
                  </Text>
                  <VStack align="stretch" gap={3} mt={4}>
                    <Text>1. 想摆脱纠结时，直接启动随机抽签。</Text>
                    <Text>2. 想吃得更“对味”，试试按心情或时段筛选。</Text>
                    <Text>3. 把你常吃的店和菜加进菜单，让结果更贴近现实。</Text>
                  </VStack>
                </Box>
              </VStack>
            </GridItem>

            <GridItem>
              <FoodSelector />
            </GridItem>
          </Grid>

          <Box as="footer" fontSize="sm" color="rgba(47, 36, 31, 0.58)" textAlign="center" mt={10} pb={3}>
            © {new Date().getFullYear()} 吃啥应用 · 把“吃啥都行”变成一个真正的决定
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
