import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
  Tooltip
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
  
  const bgColor = useColorModeValue('gray.100', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const foods = timeBasedFoods[timeOfDay]
  
  return (
    <Box 
      p={4} 
      bg={bgColor} 
      borderRadius="md" 
      borderWidth="1px" 
      borderColor={borderColor}
      width="100%"
    >
      <VStack align="start" spacing={3}>
        <HStack>
          <Text fontSize="lg" fontWeight="bold">
            {timeEmojis[timeOfDay]} 现在是{timeNames[timeOfDay]}时间
          </Text>
          <Badge colorScheme="purple">
            {currentTime.getHours().toString().padStart(2, '0')}:
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </Badge>
        </HStack>
        
        <Text fontSize="sm" color="gray.500">
          这个时间段适合吃：
        </Text>
        
        <HStack flexWrap="wrap" spacing={2}>
          {foods.map(food => (
            <Tooltip key={food} label="点击选择这个" placement="top">
              <Badge
                colorScheme="teal"
                variant="solid"
                p={2}
                borderRadius="md"
                cursor="pointer"
                onClick={() => onSelectFood(food)}
                _hover={{ transform: 'scale(1.1)' }}
                transition="all 0.2s"
              >
                {food}
              </Badge>
            </Tooltip>
          ))}
        </HStack>
      </VStack>
    </Box>
  )
}

export default TimeBasedSuggestion
