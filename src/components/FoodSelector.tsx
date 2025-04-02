import { useState, useCallback } from 'react'
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
  IconButton
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

// 默认食物列表
const DEFAULT_FOODS = [
  '火锅', '烤肉', '炒菜', '面条',
  '寿司', '披萨', '汉堡', '盖浇饭'
]

const FoodSelector = () => {
  const [foods, setFoods] = useState<string[]>(DEFAULT_FOODS)
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [newFood, setNewFood] = useState('')
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

    const randomIndex = Math.floor(Math.random() * foods.length)
    setSelectedFood(foods[randomIndex])
  }, [foods, toast])

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

  return (
    <VStack gap={6} width="100%">
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

      <Button
        colorScheme="teal"
        size="lg"
        onClick={selectRandomFood}
        width="100%"
      >
        随机选择
      </Button>

      {selectedFood && (
        <Fade in={true}>
          <Box
            p={6}
            borderRadius="lg"
            bg="teal.500"
            color="white"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold">
              就吃 {selectedFood} 吧！
            </Text>
          </Box>
        </Fade>
      )}
    </VStack>
  )
}

export default FoodSelector 