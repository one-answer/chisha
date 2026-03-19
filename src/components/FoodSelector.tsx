import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Input,
  HStack,
  IconButton,
  Circle,
  Flex,
  keyframes,
  ScaleFade,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Badge,
  Heading,
  SimpleGrid,
  Progress,
  InputGroup,
  InputRightElement,
  Kbd,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import MoodSelector from './MoodSelector'
import TimeBasedSuggestion from './TimeBasedSuggestion'
import FoodFunFact from './FoodFunFact'

// 默认食物列表
const DEFAULT_FOODS = [
  '火锅', '烤肉', '炒菜', '面条', '寿司', '披萨', '汉堡', '盖浇饭',
  '麻辣烫', '冒菜', '煲仔饭', '生煎', '饺子', '拉面', '炸酱面', '重庆小面',
  '肯德基', '麦当劳', '必胜客', '海底捞', '大盘鸡', '烧烤', '麻辣香锅', '粥',
  '便当', '沙县小吃', '黄焖鸡米饭', '兰州拉面', '螺蛳粉', '酸辣粉', '肠粉', '云吞面',
  '炒河粉', '叉烧饭', '烧鸭饭', '咖喱饭', '三明治', '煎饼果子', '炸鸡', '韩式炸鸡',
  '韩式烤肉', '部队火锅', '寿喜锅', '天妇罗', '刺身', '回转寿司', '乌冬面', '荞麦面',
  '咖喱乌冬', '亲子丼', '牛丼', '猪排饭', '天津饭', '炒面', '炒饭', '盒饭',
  '麻婆豆腐', '水煮鱼', '红烧肉', '糖醋里脊', '宫保鸡丁', '鱼香肉丝', '回锅肉', '东坡肉',
  '小龙虾', '大闸蟹', '粤式早茶', '肠粉', '虾饺', '烧卖', '叉烧包', '流沙包',
  '蛋挞', '凉皮', '肉夹馍', '羊肉泡馍', '臊子面', '油泼面', '羊肉串', '烤鱼',
  '酸菜鱼', '水煮牛肉', '毛血旺', '辣子鸡', '泡椒凤爪', '夫妻肺片', '担担面', '麻辣兔头',
  '卤味', '鸭血粉丝', '酱骨头', '羊蝎子', '铁板烧', '关东煮', '寿司', '拌饭',
  '石锅拌饭', '炸串', '串串香', '自助餐', '海鲜', '粥店', '面馆', '快餐'
]

// 定义旋转动画关键帧
const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const pulseAnimation = keyframes`
  0% { transform: scale(0.96); opacity: 0.7; }
  70% { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(0.96); opacity: 0.7; }
`

const shimmerAnimation = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`

const countdownMessages = ['3', '2', '1']
const spinCommentary = [
  '正在翻找你最近最可能想吃的东西...',
  '纠结雷达启动，排除“随便都行”中...',
  '胃口裁判团正在内部投票...',
  '再等等，这一口马上就有名字了...',
]

const FoodSelector = () => {
  const [foods, setFoods] = useState<string[]>(DEFAULT_FOODS)
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [newFood, setNewFood] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelFoods, setWheelFoods] = useState<string[]>([])
  const [highlightedFood, setHighlightedFood] = useState<string>('')
  const [countdown, setCountdown] = useState<string>('')
  const [gameStatusText, setGameStatusText] = useState('按下开始，让今天的这一顿自动揭晓')
  const spinTimeoutRef = useRef<number | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)
  const highlightIntervalRef = useRef<number | null>(null)
  const commentaryIntervalRef = useRef<number | null>(null)
  const toast = useToast()

  const clearSpinEffects = useCallback(() => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
      spinTimeoutRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    if (highlightIntervalRef.current) {
      clearInterval(highlightIntervalRef.current)
      highlightIntervalRef.current = null
    }
    if (commentaryIntervalRef.current) {
      clearInterval(commentaryIntervalRef.current)
      commentaryIntervalRef.current = null
    }
  }, [])

  const runSpinGame = useCallback((candidateFoods: string[], finalFood: string, revealDelay: number) => {
    clearSpinEffects()
    setWheelFoods(candidateFoods)
    setSelectedFood('')
    setIsSpinning(true)
    setCountdown(countdownMessages[0])
    setHighlightedFood(candidateFoods[0] ?? '')
    setGameStatusText('倒计时开始，准备交出今天的饭权')

    let countdownIndex = 0
    countdownIntervalRef.current = window.setInterval(() => {
      countdownIndex += 1

      if (countdownIndex < countdownMessages.length) {
        setCountdown(countdownMessages[countdownIndex])
        return
      }

      if (countdownIndex === countdownMessages.length) {
        setCountdown('开吃')
        setGameStatusText('转盘进入高速模式，正在缩小范围')
        clearInterval(countdownIntervalRef.current!)
        countdownIntervalRef.current = null
      }
    }, 420)

    let highlightIndex = 0
    highlightIntervalRef.current = window.setInterval(() => {
      if (candidateFoods.length === 0) return
      highlightIndex = (highlightIndex + 1) % candidateFoods.length
      setHighlightedFood(candidateFoods[highlightIndex])
    }, 140)

    let commentaryIndex = 0
    setGameStatusText(spinCommentary[commentaryIndex])
    commentaryIntervalRef.current = window.setInterval(() => {
      commentaryIndex = (commentaryIndex + 1) % spinCommentary.length
      setGameStatusText(spinCommentary[commentaryIndex])
    }, 900)

    spinTimeoutRef.current = window.setTimeout(() => {
      clearSpinEffects()
      setCountdown('')
      setHighlightedFood(finalFood)
      setSelectedFood(finalFood)
      setIsSpinning(false)
      setGameStatusText(`结果锁定，今天就吃 ${finalFood}`)
    }, revealDelay)
  }, [clearSpinEffects])

  // 随机选择食物
  const selectRandomFood = useCallback(() => {
    if (foods.length === 0) {
      toast({
        title: '请先添加一些食物选项',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    // 随机选择5-8个食物放在轮盘上
    const wheelSize = Math.min(foods.length, Math.floor(Math.random() * 4) + 5)
    const shuffled = [...foods].sort(() => 0.5 - Math.random())
    const selectedWheelFoods = shuffled.slice(0, wheelSize)

    // 2-4秒后停止旋转并选择结果
    const spinTime = Math.floor(Math.random() * 2000) + 2000
    const randomIndex = Math.floor(Math.random() * selectedWheelFoods.length)
    runSpinGame(selectedWheelFoods, selectedWheelFoods[randomIndex], spinTime)
  }, [foods, runSpinGame, toast])

  // 清理超时
  useEffect(() => {
    return () => {
      clearSpinEffects()
    }
  }, [clearSpinEffects])

  // 添加新食物
  const addFood = useCallback(() => {
    if (!newFood.trim()) {
      toast({
        title: '请输入食物名称',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    if (foods.includes(newFood.trim())) {
      toast({
        title: '该食物已经存在',
        status: 'warning',
        duration: 2000,
      })
      return
    }

    setFoods(prev => [...prev, newFood.trim()])
    setNewFood('')
  }, [newFood, foods, toast])

  // 删除食物
  const removeFood = useCallback((food: string) => {
    setFoods(prev => prev.filter(f => f !== food))
  }, [])

  // 处理心情选择器选择的食物
  const handleMoodFoodSelect = useCallback((food: string) => {
    // 如果食物不在列表中，添加它
    if (!foods.includes(food)) {
      setFoods(prev => [...prev, food])
    }

    // 设置轮盘食物
    const wheelSize = Math.min(foods.length, 6)
    const shuffled = [...foods].sort(() => 0.5 - Math.random())
    const selectedWheelFoods = shuffled.slice(0, wheelSize)

    // 确保推荐的食物在轮盘上
    if (!selectedWheelFoods.includes(food)) {
      selectedWheelFoods[0] = food
    }

    // 2-3秒后停止旋转并选择结果
    const spinTime = Math.floor(Math.random() * 1000) + 2000
    runSpinGame(selectedWheelFoods, food, spinTime)
  }, [foods, runSpinGame])

  const spotlightFoods = foods.slice(0, 12)
  const progressValue = isSpinning ? 82 : selectedFood ? 100 : 24

  return (
    <VStack gap={6} width="100%" align="stretch">
      <TimeBasedSuggestion onSelectFood={handleMoodFoodSelect} />

      <Box
        borderRadius="32px"
        border="1px solid rgba(126, 82, 54, 0.12)"
        bg="rgba(255,255,255,0.74)"
        backdropFilter="blur(16px)"
        boxShadow="0 24px 80px rgba(121, 74, 47, 0.12)"
        p={{ base: 5, md: 7 }}
      >
        <VStack align="stretch" gap={5}>
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
            <Box>
              <Badge px={3} py={1} borderRadius="full" bg="red.100" color="red.700" fontSize="xs" letterSpacing="0.08em">
                DECISION LAB
              </Badge>
              <Heading as="h2" size="lg" mt={3}>
                把纠结交给今天的吃饭转盘
              </Heading>
              <Text mt={2} color="rgba(47, 36, 31, 0.68)">
                你负责点开始，我负责让结果看起来命中注定。
              </Text>
            </Box>
            <Box
              px={4}
              py={3}
              borderRadius="20px"
              bg="rgba(255, 243, 231, 0.9)"
              border="1px solid rgba(138, 90, 61, 0.12)"
            >
              <Text fontSize="sm" color="rgba(47, 36, 31, 0.6)">
                当前菜单数
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {foods.length}
              </Text>
            </Box>
          </HStack>

          <Box
            borderRadius="28px"
            p={{ base: 5, md: 6 }}
            bg="linear-gradient(135deg, rgba(63,43,35,0.98), rgba(116,71,42,0.96))"
            color="orange.50"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="-70px"
              right="-30px"
              w="180px"
              h="180px"
              borderRadius="full"
              bg="rgba(255, 181, 91, 0.15)"
            />
            <VStack position="relative" align="stretch" gap={4}>
              <HStack justify="space-between" flexWrap="wrap" gap={3}>
                <Box>
                  <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" opacity={0.72}>
                    Random Mode
                  </Text>
                  <Text mt={1} fontSize="2xl" fontWeight="bold">
                    本轮胃口审判
                  </Text>
                </Box>
                <Badge
                  bg={isSpinning ? 'rgba(255, 187, 89, 0.22)' : 'rgba(255, 255, 255, 0.12)'}
                  color="orange.50"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                >
                  {isSpinning ? '摇号中' : selectedFood ? '已揭晓' : '等待开始'}
                </Badge>
              </HStack>

              <Progress
                value={progressValue}
                size="sm"
                borderRadius="full"
                bg="rgba(255,255,255,0.12)"
                sx={{ '& > div': { background: 'linear-gradient(90deg, #ffb15c, #ff8d52)' } }}
              />

              <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
                <Text fontSize="sm" opacity={0.82}>
                  {gameStatusText}
                </Text>
                <HStack spacing={2}>
                  <Kbd bg="rgba(255,255,255,0.12)" color="orange.50" borderColor="rgba(255,255,255,0.16)">
                    Enter
                  </Kbd>
                  <Text fontSize="xs" opacity={0.72}>也能直接开抽</Text>
                </HStack>
              </HStack>

              <Box
                position="relative"
                minH={{ base: '300px', md: '340px' }}
                borderRadius="28px"
                bg="rgba(255,255,255,0.06)"
                border="1px solid rgba(255,255,255,0.1)"
                overflow="hidden"
              >
                <Flex
                  position="absolute"
                  inset="0"
                  justifyContent="center"
                  alignItems="center"
                  animation={isSpinning ? `${spinAnimation} 2.2s cubic-bezier(.45,.05,.55,.95) infinite` : undefined}
                >
                  {(wheelFoods.length ? wheelFoods : spotlightFoods).map((food, index, arr) => {
                    const angle = (360 / arr.length) * index
                    const radius = arr.length > 8 ? 112 : 102
                    const isSelected = food === selectedFood

                    return (
                      <Box
                        key={`${food}-${index}`}
                        position="absolute"
                        transform={`rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`}
                        zIndex={isSelected ? 2 : 1}
                      >
                        <Circle
                          size={isSelected ? '82px' : '68px'}
                          bg={
                            isSelected
                              ? '#ffcf5a'
                              : highlightedFood === food && isSpinning
                                ? 'linear-gradient(135deg, #ffd295, #ff9b59)'
                                : 'rgba(255, 239, 227, 0.94)'
                          }
                          color={isSelected || highlightedFood === food ? '#5b351e' : '#513223'}
                          fontSize={isSelected ? 'md' : 'sm'}
                          fontWeight="bold"
                          textAlign="center"
                          p={3}
                          boxShadow={
                            isSelected
                              ? '0 0 0 10px rgba(255, 207, 90, 0.18)'
                              : highlightedFood === food && isSpinning
                                ? '0 0 0 8px rgba(255, 162, 93, 0.16), 0 18px 40px rgba(255, 162, 93, 0.18)'
                                : '0 10px 28px rgba(0,0,0,0.16)'
                          }
                          transform={highlightedFood === food && isSpinning ? 'scale(1.08)' : undefined}
                          transition="all 0.3s ease"
                          animation={
                            highlightedFood === food && isSpinning
                              ? `${shimmerAnimation} 1s linear infinite`
                              : undefined
                          }
                          bgSize="200% 200%"
                        >
                          {food}
                        </Circle>
                      </Box>
                    )
                  })}
                </Flex>

                <Flex position="absolute" inset="0" justifyContent="center" alignItems="center" direction="column" zIndex={3}>
                  <Circle
                    size={{ base: '92px', md: '108px' }}
                    bg={selectedFood && !isSpinning ? '#ff8d52' : '#fff5ec'}
                    color={selectedFood && !isSpinning ? 'white' : '#5b351e'}
                    fontWeight="bold"
                    boxShadow="0 18px 44px rgba(0,0,0,0.18)"
                    animation={isSpinning ? `${pulseAnimation} 1.1s ease-in-out infinite` : undefined}
                  >
                    {isSpinning ? (countdown || '抽签中') : selectedFood ? '开吃' : '开始'}
                  </Circle>
                  <Text mt={4} fontSize="sm" opacity={0.78}>
                    {isSpinning ? '高亮正在快速跳动，停下来的那一项就是天选晚餐' : '转盘会从你的菜单里挑出幸运选手'}
                  </Text>
                </Flex>
              </Box>

              <Button
                onClick={selectRandomFood}
                isDisabled={isSpinning}
                h="58px"
                borderRadius="full"
                bg="#ffb15c"
                color="#43291b"
                fontWeight="bold"
                _hover={{ bg: '#ff9b47' }}
                _active={{ bg: '#f68d39' }}
              >
                {isSpinning ? '正在严肃抽签...' : selectedFood ? '不服，再抽一次' : '立即开始摇号'}
              </Button>
            </VStack>
          </Box>

          <InputGroup size="lg">
            <Input
              placeholder="把你常吃的店、菜、套餐加进菜单"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFood()}
              borderRadius="full"
              bg="rgba(255, 248, 242, 0.92)"
              borderColor="rgba(138, 90, 61, 0.18)"
              _hover={{ borderColor: 'rgba(138, 90, 61, 0.28)' }}
              _focusVisible={{
                borderColor: '#ff9b47',
                boxShadow: '0 0 0 1px #ff9b47',
              }}
            />
            <InputRightElement width="4rem" h="100%">
              <IconButton
                aria-label="添加食物"
                icon={<AddIcon />}
                onClick={addFood}
                bg="#2f241f"
                color="white"
                _hover={{ bg: '#4a382f' }}
                isRound
                size="sm"
              />
            </InputRightElement>
          </InputGroup>

          <Box>
            <Text fontSize="sm" color="rgba(47, 36, 31, 0.62)" mb={3}>
              你的常驻菜单
            </Text>
            <Wrap gap={3}>
              {foods.map((food) => (
                <WrapItem key={food}>
                  <Tag
                    size="lg"
                    borderRadius="full"
                    px={4}
                    py={2}
                    bg={selectedFood === food ? 'rgba(255, 177, 92, 0.28)' : 'rgba(255, 248, 242, 0.96)'}
                    color="#4a2f21"
                    border="1px solid rgba(138, 90, 61, 0.12)"
                  >
                    <TagLabel>{food}</TagLabel>
                    <TagCloseButton onClick={() => removeFood(food)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        </VStack>
      </Box>

      <Tabs
        isFitted
        variant="unstyled"
        width="100%"
        mt={1}
      >
        <TabList
          p={1}
          borderRadius="full"
          bg="rgba(92, 58, 40, 0.08)"
          gap={2}
        >
          <Tab
            borderRadius="full"
            fontWeight="bold"
            color="rgba(47, 36, 31, 0.72)"
            _selected={{ bg: '#2f241f', color: 'white' }}
          >
            心情选餐
          </Tab>
          <Tab
            borderRadius="full"
            fontWeight="bold"
            color="rgba(47, 36, 31, 0.72)"
            _selected={{ bg: '#2f241f', color: 'white' }}
          >
            菜单速览
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MoodSelector onSelectFood={handleMoodFoodSelect} />
          </TabPanel>
          <TabPanel>
            <Box
              borderRadius="28px"
              p={{ base: 5, md: 6 }}
              bg="rgba(255,255,255,0.72)"
              border="1px solid rgba(126, 82, 54, 0.12)"
            >
              <Text fontSize="xl" fontWeight="bold">
                菜单速览
              </Text>
              <Text mt={2} color="rgba(47, 36, 31, 0.66)">
                这是系统最常拿来参与抽签的一组热门选手，想刷新口味就继续往上添加新菜名。
              </Text>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3} mt={5}>
                {spotlightFoods.map((food) => (
                  <Box
                    key={food}
                    p={4}
                    borderRadius="22px"
                    bg={selectedFood === food ? 'rgba(255, 177, 92, 0.22)' : 'rgba(255, 248, 242, 0.92)'}
                    border="1px solid rgba(138, 90, 61, 0.12)"
                  >
                    <Text fontWeight="bold">{food}</Text>
                    <Text mt={1} fontSize="sm" color="rgba(47, 36, 31, 0.58)">
                      适合加入本轮纠结候选池
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider borderColor="rgba(126, 82, 54, 0.12)" />

      {selectedFood && !isSpinning && (
        <ScaleFade initialScale={0.9} in={true}>
          <Box
            p={{ base: 6, md: 7 }}
            borderRadius="30px"
            bg="linear-gradient(135deg, #ffb15c, #ff8d52)"
            color="#43291b"
            textAlign="left"
            mt={2}
            boxShadow="0 20px 60px rgba(255, 141, 82, 0.3)"
          >
            <Badge bg="rgba(255,255,255,0.4)" color="#59351f" px={3} py={1} borderRadius="full">
              FINAL ANSWER
            </Badge>
            <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" mt={4}>
              就吃 {selectedFood} 吧。
            </Text>
            <Text mt={3} fontSize="lg" color="rgba(67, 41, 27, 0.82)">
              今天这顿已经替你决定好了，现在只剩下开心出门或者熟练点外卖。
            </Text>
          </Box>
        </ScaleFade>
      )}

      {/* 食物趣味小知识 */}
      <FoodFunFact selectedFood={selectedFood} />
    </VStack>
  )
}

export default FoodSelector
