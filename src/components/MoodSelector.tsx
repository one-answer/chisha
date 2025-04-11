import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  useRadioGroup,
  useRadio,
  UseRadioProps,
  chakra
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
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
          transform: 'scale(1.1)',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        transition="all 0.2s"
      >
        <VStack>
          <Text fontSize="2xl">{moodEmojis[mood]}</Text>
          <Text fontWeight="bold">{mood}</Text>
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
    <VStack spacing={6} width="100%">
      <Text fontSize="lg" fontWeight="medium" color="gray.600">
        根据心情选择食物
      </Text>
      
      <HStack {...group} spacing={4} flexWrap="wrap" justifyContent="center">
        {moods.map((mood) => {
          const radio = getRadioProps({ value: mood })
          return (
            <MoodRadioCard key={mood} mood={mood} {...radio} />
          )
        })}
      </HStack>
      
      {selectedMood && (
        <Box textAlign="center" p={3} bg="gray.100" borderRadius="md" width="100%">
          <Text>{moodDescriptions[selectedMood]}</Text>
        </Box>
      )}
      
      <Button
        colorScheme="purple"
        isDisabled={!selectedMood}
        onClick={handleSuggestFood}
        width="100%"
      >
        根据心情推荐
      </Button>
    </VStack>
  )
}

export default MoodSelector
