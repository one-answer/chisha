import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Icon,
  Flex,
  useColorModeValue
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'

// 食物趣味小知识
const foodFacts = [
  "火锅起源于中国东汉时期，最初是用铜锅煮食物。",
  "寿司最初是一种保存鱼的方法，将鱼与米饭一起发酵。",
  "披萨最早起源于意大利那不勒斯，是穷人的食物。",
  "汉堡包的名字来源于德国汉堡市，但现代汉堡是在美国发明的。",
  "意大利面条可能起源于中国，由马可·波罗带回欧洲。",
  "巧克力最初是作为饮料饮用的，由玛雅人发明。",
  "番茄原产于南美洲，最初在欧洲被认为是有毒的。",
  "爆米花已有至少6000年的历史，是最古老的零食之一。",
  "咖啡豆其实是咖啡树果实的种子，不是真正的豆类。",
  "冰淇淋的历史可以追溯到公元前400年的波斯。",
  "酱油起源于中国，已有2500多年的历史。",
  "土豆原产于南美洲安第斯山脉，有超过4000种不同品种。",
  "胡萝卜最初是紫色的，橙色胡萝卜是17世纪在荷兰培育的。",
  "全世界每天约有超过10亿人食用米饭。",
  "牛排的稀有程度（三分熟、五分熟等）最初是由法国厨师发明的。",
  "世界上最贵的香料是藏红花，比黄金还贵。",
  "芥末可以刺激鼻腔是因为它含有一种叫做异硫氰酸烯丙酯的化合物。",
  "椰子不是坚果，而是一种称为'核果'的水果。",
  "全球约有1/3的食物在从农场到餐桌的过程中被浪费。",
  "人类的味蕾大约每10天更新一次。",
  "蜂蜜是唯一一种永远不会变质的食物，考古学家曾在古埃及墓中发现仍可食用的蜂蜜。",
  "辣椒的辣味不是一种味道，而是一种疼痛反应。",
  "苹果与玫瑰花属于同一科植物。",
  "香蕉技术上来说是一种浆果。",
  "全球约有超过30000种可食用植物，但人类只使用其中约200种作为主要食物。"
]

interface FoodFunFactProps {
  selectedFood: string
}

const FoodFunFact = ({ selectedFood }: FoodFunFactProps) => {
  const [fact, setFact] = useState('')
  
  useEffect(() => {
    if (selectedFood) {
      // 随机选择一个趣味小知识
      const randomIndex = Math.floor(Math.random() * foodFacts.length)
      setFact(foodFacts[randomIndex])
    }
  }, [selectedFood])
  
  const bgColor = useColorModeValue('yellow.50', 'yellow.900')
  const borderColor = useColorModeValue('yellow.200', 'yellow.700')
  
  if (!selectedFood || !fact) return null
  
  return (
    <Box 
      p={4} 
      bg={bgColor} 
      borderRadius="md" 
      borderWidth="1px" 
      borderColor={borderColor}
      width="100%"
      mt={4}
    >
      <Flex align="center" mb={2}>
        <Icon as={InfoIcon} color="yellow.500" mr={2} />
        <Text fontWeight="bold" color="yellow.500">趣味小知识</Text>
      </Flex>
      <Text fontSize="sm">{fact}</Text>
    </Box>
  )
}

export default FoodFunFact
