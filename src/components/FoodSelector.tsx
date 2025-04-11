import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Fade,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Input,
  HStack,
  IconButton,
  Collapse,
  useDisclosure,
  Circle,
  Flex,
  Spinner,
  keyframes,
  ScaleFade,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider
} from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
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

const FoodSelector = () => {
  const [foods, setFoods] = useState<string[]>(DEFAULT_FOODS)
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [newFood, setNewFood] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelFoods, setWheelFoods] = useState<string[]>([])
  const spinTimeoutRef = useRef<number | null>(null)
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()

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

    // 清除之前的超时
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
    }

    // 随机选择5-8个食物放在轮盘上
    const wheelSize = Math.min(foods.length, Math.floor(Math.random() * 4) + 5)
    const shuffled = [...foods].sort(() => 0.5 - Math.random())
    const selectedWheelFoods = shuffled.slice(0, wheelSize)
    setWheelFoods(selectedWheelFoods)

    // 开始旋转动画
    setIsSpinning(true)
    setSelectedFood('')

    // 2-4秒后停止旋转并选择结果
    const spinTime = Math.floor(Math.random() * 2000) + 2000
    spinTimeoutRef.current = window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * selectedWheelFoods.length)
      setSelectedFood(selectedWheelFoods[randomIndex])
      setIsSpinning(false)
    }, spinTime)
  }, [foods, toast])

  // 清理超时
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [])

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

    // 清除之前的超时
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
    }

    // 设置轮盘食物
    const wheelSize = Math.min(foods.length, 6)
    const shuffled = [...foods].sort(() => 0.5 - Math.random())
    const selectedWheelFoods = shuffled.slice(0, wheelSize)

    // 确保推荐的食物在轮盘上
    if (!selectedWheelFoods.includes(food)) {
      selectedWheelFoods[0] = food
    }

    setWheelFoods(selectedWheelFoods)

    // 开始旋转动画
    setIsSpinning(true)
    setSelectedFood('')

    // 2-3秒后停止旋转并选择结果
    const spinTime = Math.floor(Math.random() * 1000) + 2000
    spinTimeoutRef.current = window.setTimeout(() => {
      setSelectedFood(food)
      setIsSpinning(false)
    }, spinTime)
  }, [foods])

  return (
    <VStack gap={6} width="100%">
      <TimeBasedSuggestion onSelectFood={handleMoodFoodSelect} />

      <Tabs isFitted variant="enclosed" width="100%" colorScheme="teal" mt={4}>
        <TabList mb="1em">
          <Tab _selected={{ color: 'white', bg: 'teal.500' }}>随机选择</Tab>
          <Tab _selected={{ color: 'white', bg: 'teal.500' }}>心情选择</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack gap={4} width="100%">
              <HStack width="100%">
                <Input
                  placeholder="添加新的食物选项"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFood()}
                />
                <IconButton
                  aria-label="添加食物"
                  icon={<AddIcon />}
                  onClick={addFood}
                  colorScheme="teal"
                  size="md"
                  fontSize="20px"
                  variant="solid"
                  isRound
                  _hover={{
                    transform: 'scale(1.1)',
                  }}
                  transition="all 0.2s"
                />
              </HStack>

              <Button
                width="100%"
                onClick={onToggle}
                variant="outline"
                colorScheme="teal"
                rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              >
                {isOpen ? '收起选项列表' : '展开选项列表'} ({foods.length}个)
              </Button>

              <Collapse in={isOpen} animateOpacity>
                <Wrap gap={3}>
                  {foods.map((food) => (
                    <WrapItem key={food}>
                      <Tag
                        size="lg"
                        variant="subtle"
                        colorScheme="teal"
                      >
                        <TagLabel>{food}</TagLabel>
                        <TagCloseButton onClick={() => removeFood(food)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Collapse>

              <Button
                colorScheme="teal"
                size="lg"
                onClick={selectRandomFood}
                width="100%"
                isDisabled={isSpinning}
              >
                {isSpinning ? '正在选择...' : '随机选择'}
              </Button>
            </VStack>
          </TabPanel>
          <TabPanel>
            <MoodSelector onSelectFood={handleMoodFoodSelect} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider />

      {/* 食物轮盘 */}
      {(isSpinning || selectedFood) && (
        <Box
          position="relative"
          width="100%"
          height="200px"
          mt={4}
        >
          <Flex
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            animation={isSpinning ? `${spinAnimation} 1.5s linear infinite` : undefined}
          >
            {wheelFoods.map((food, index) => {
              const angle = (360 / wheelFoods.length) * index
              const isSelected = food === selectedFood
              return (
                <Box
                  key={food}
                  position="absolute"
                  transform={`rotate(${angle}deg) translateX(80px) rotate(-${angle}deg)`}
                  zIndex={isSelected ? 2 : 1}
                >
                  <Circle
                    size={isSelected ? "70px" : "60px"}
                    bg={isSelected ? "yellow.400" : "teal.400"}
                    color="white"
                    fontSize={isSelected ? "md" : "sm"}
                    fontWeight={isSelected ? "bold" : "normal"}
                    boxShadow={isSelected ? "0 0 10px yellow" : undefined}
                    transition="all 0.3s ease"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    p={2}
                  >
                    {food}
                  </Circle>
                </Box>
              )
            })}
          </Flex>

          {/* 中心指针 */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={3}
          >
            {isSpinning ? (
              <Spinner size="xl" color="red.500" thickness="4px" />
            ) : selectedFood ? (
              <Circle size="40px" bg="red.500" />
            ) : null}
          </Box>
        </Box>
      )}

      {selectedFood && !isSpinning && (
        <ScaleFade initialScale={0.9} in={true}>
          <Box
            p={6}
            borderRadius="lg"
            bg="teal.500"
            color="white"
            textAlign="center"
            mt={4}
          >
            <Text fontSize="2xl" fontWeight="bold">
              就吃 {selectedFood} 吧！
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