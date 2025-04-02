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
  IconButton,
  Collapse,
  useDisclosure
} from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'

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

const FoodSelector = () => {
  const [foods, setFoods] = useState<string[]>(DEFAULT_FOODS)
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [newFood, setNewFood] = useState('')
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