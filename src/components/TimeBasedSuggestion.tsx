import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Badge,
  SimpleGrid,
  VStack,
  Button,
} from '@chakra-ui/react'

// 根据时间段推荐不同的食物类型
const timeBasedFoods = {
  morning: ['粥', '包子', '豆浆', '油条', '煎饼果子', '三明治', '面包', '牛奶'],
  noon: ['盖浇饭', '炒饭', '面条', '快餐', '便当', '沙拉', '汉堡', '披萨'],
  afternoon: ['奶茶', '咖啡', '甜点', '蛋糕', '水果', '冰淇淋', '小吃'],
  evening: ['火锅', '烤肉', '炒菜', '海鲜', '烧烤', '麻辣烫', '饺子', '寿司'],
  night: ['夜宵', '烧烤', '麻辣烫', '关东煮', '炸鸡', '泡面', '粥', '小龙虾']
}

// 根据当前时间获取时间段
const getTimeOfDay = (): keyof typeof timeBasedFoods => {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 10) return 'morning'
  if (hour >= 10 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 22) return 'evening'
  return 'night'
}

// 时间段对应的中文名称
const timeNames = {
  morning: '早餐',
  noon: '午餐',
  afternoon: '下午茶',
  evening: '晚餐',
  night: '夜宵'
}

// 时间段对应的表情
const timeEmojis = {
  morning: '🌅',
  noon: '☀️',
  afternoon: '🍵',
  evening: '🌆',
  night: '🌙'
}

interface TimeBasedSuggestionProps {
  onSelectFood: (food: string) => void
}

const TimeBasedSuggestion = ({ onSelectFood }: TimeBasedSuggestionProps) => {
  const [timeOfDay, setTimeOfDay] = useState<keyof typeof timeBasedFoods>(getTimeOfDay())
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // 每分钟更新一次时间
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      setTimeOfDay(getTimeOfDay())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  const foods = timeBasedFoods[timeOfDay]
  
  return (
    <Box
      p={{ base: 5, md: 6 }}
      bg="rgba(255,255,255,0.72)"
      borderRadius="28px"
      borderWidth="1px"
      borderColor="rgba(126, 82, 54, 0.12)"
      width="100%"
      boxShadow="0 18px 50px rgba(121, 74, 47, 0.08)"
    >
      <VStack align="start" spacing={4}>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg="rgba(255, 170, 90, 0.18)"
          color="orange.800"
          fontSize="xs"
          letterSpacing="0.08em"
        >
          TIME PICK
        </Badge>

        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {timeEmojis[timeOfDay]} 现在适合吃点 {timeNames[timeOfDay]}
          </Text>
          <Text mt={2} color="rgba(47, 36, 31, 0.66)">
            不知道从哪里开始时，先顺着时间节奏选，通常比较不容易后悔。
          </Text>
        </Box>

        <Badge
          bg="rgba(47, 36, 31, 0.94)"
          color="orange.50"
          px={3}
          py={1.5}
          borderRadius="full"
        >
          当前时间 {' '}
            {currentTime.getHours().toString().padStart(2, '0')}:
            {currentTime.getMinutes().toString().padStart(2, '0')}
        </Badge>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} width="100%">
          {foods.map(food => (
            <Button
              key={food}
              onClick={() => onSelectFood(food)}
              variant="outline"
              justifyContent="center"
              h="56px"
              borderRadius="18px"
              borderColor="rgba(138, 90, 61, 0.18)"
              bg="rgba(255, 248, 242, 0.72)"
              _hover={{
                bg: 'rgba(255, 170, 90, 0.18)',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s ease"
            >
              {food}
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default TimeBasedSuggestion
