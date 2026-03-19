import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  SimpleGrid,
  useRadioGroup,
  useRadio,
  UseRadioProps,
  chakra,
  Badge,
} from '@chakra-ui/react'

// 定义心情类型
type Mood = 'happy' | 'sad' | 'tired' | 'hungry' | 'stressed'

// 不同心情对应的食物类型
const moodFoodMap: Record<Mood, string[]> = {
  happy: ['火锅', '烤肉', '自助餐', '海鲜', '披萨'],
  sad: ['甜点', '巧克力', '冰淇淋', '奶茶', '蛋糕'],
  tired: ['粥', '面条', '汤', '粉丝', '暖锅'],
  hungry: ['大盘鸡', '烧烤', '麻辣香锅', '炒饭', '盖浇饭'],
  stressed: ['寿司', '沙拉', '轻食', '水果', '坚果']
}

// 心情表情映射
const moodEmojis: Record<Mood, string> = {
  happy: '😄',
  sad: '😢',
  tired: '😴',
  hungry: '🤤',
  stressed: '😰'
}

// 心情描述
const moodDescriptions: Record<Mood, string> = {
  happy: '开心时来点热闹的食物',
  sad: '难过时需要甜食安慰',
  tired: '疲惫时需要暖胃食物',
  hungry: '饥饿时需要饱腹感强的食物',
  stressed: '压力大时需要轻食',
}

// 自定义单选按钮
const MoodRadioCard = (props: UseRadioProps & { mood: Mood }) => {
  const { getInputProps, getRadioProps } = useRadio(props)
  const { mood } = props
  
  const input = getInputProps()
  const checkbox = getRadioProps()
  
  return (
    <chakra.label>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='24px'
        borderColor='rgba(138, 90, 61, 0.14)'
        bg='rgba(255, 248, 242, 0.9)'
        _checked={{
          bg: '#7d4c31',
          color: 'white',
          borderColor: '#7d4c31',
          transform: 'translateY(-3px)',
          boxShadow: '0 18px 30px rgba(125, 76, 49, 0.25)',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        _hover={{
          transform: 'translateY(-2px)',
        }}
        px={5}
        py={4}
        transition="all 0.22s ease"
        h='100%'
      >
        <VStack align='start' spacing={2}>
          <Text fontSize="2xl">{moodEmojis[mood]}</Text>
          <Text fontWeight="bold" textTransform="capitalize">{mood}</Text>
          <Text fontSize="sm" opacity={0.78}>
            {moodDescriptions[mood]}
          </Text>
        </VStack>
      </Box>
    </chakra.label>
  )
}

interface MoodSelectorProps {
  onSelectFood: (food: string) => void
}

const MoodSelector = ({ onSelectFood }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  
  const moods: Mood[] = ['happy', 'sad', 'tired', 'hungry', 'stressed']
  
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'mood',
    onChange: (value) => setSelectedMood(value as Mood),
  })
  
  const group = getRootProps()
  
  const handleSuggestFood = () => {
    if (selectedMood) {
      const foods = moodFoodMap[selectedMood]
      const randomIndex = Math.floor(Math.random() * foods.length)
      onSelectFood(foods[randomIndex])
    }
  }
  
  return (
    <VStack spacing={6} width="100%" align="stretch">
      <Box>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg="orange.100"
          color="orange.800"
          fontSize="xs"
          letterSpacing="0.08em"
        >
          MOOD MATCH
        </Badge>
        <Text fontSize="xl" fontWeight="bold" mt={3}>
          你现在是什么状态？
        </Text>
        <Text mt={1} color="rgba(47, 36, 31, 0.68)">
          选一个最接近的情绪，让今天这顿饭更像一次情绪安抚。
        </Text>
      </Box>
      
      <SimpleGrid {...group} columns={{ base: 1, md: 2 }} spacing={4}>
        {moods.map((mood) => {
          const radio = getRadioProps({ value: mood })
          return (
            <MoodRadioCard key={mood} mood={mood} {...radio} />
          )
        })}
      </SimpleGrid>
      
      {selectedMood && (
        <Box
          textAlign="left"
          p={4}
          bg="rgba(255, 243, 231, 0.92)"
          borderRadius="22px"
          border="1px solid rgba(138, 90, 61, 0.12)"
          width="100%"
        >
          <Text fontSize="sm" color="rgba(47, 36, 31, 0.62)">
            当前推荐策略
          </Text>
          <Text mt={1} fontWeight="bold">
            {moodDescriptions[selectedMood]}
          </Text>
        </Box>
      )}
      
      <Button
        bg="#2f241f"
        color="white"
        _hover={{ bg: '#4a382f' }}
        _active={{ bg: '#241b17' }}
        isDisabled={!selectedMood}
        onClick={handleSuggestFood}
        width="100%"
        size="lg"
        borderRadius="full"
      >
        给我一个贴心推荐
      </Button>
    </VStack>
  )
}

export default MoodSelector
