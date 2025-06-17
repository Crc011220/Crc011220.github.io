---
icon: pen-to-square
date: 2025-06-14
category:
  - Learning Records
tag:
  - Declarative Programming
---

# Haskell 常见内置函数速查

### 列表操作

| 函数          | 类型签名                             | 说明          | 例子                                        |
| ----------- | -------------------------------- | ----------- | ----------------------------------------- |
| `head`      | `[a] -> a`                       | 取列表第一个元素    | `head [1,2,3] = 1`                        |
| `tail`      | `[a] -> [a]`                     | 去掉列表第一个元素   | `tail [1,2,3] = [2,3]`                    |
| `init`      | `[a] -> [a]`                     | 去掉列表最后一个元素  | `init [1,2,3] = [1,2]`                    |
| `last`      | `[a] -> a`                       | 取列表最后一个元素   | `last [1,2,3] = 3`                        |
| `length`    | `[a] -> Int`                     | 计算列表长度      | `length [1,2,3] = 3`                      |
| `null`      | `[a] -> Bool`                    | 判断列表是否为空    | `null [] = True`                          |
| `reverse`   | `[a] -> [a]`                     | 翻转列表        | `reverse [1,2,3] = [3,2,1]`               |
| `take`      | `Int -> [a] -> [a]`              | 取前 n 个元素    | `take 2 [1,2,3] = [1,2]`                  |
| `drop`      | `Int -> [a] -> [a]`              | 丢弃前 n 个元素   | `drop 2 [1,2,3] = [3]`                    |
| `splitAt`   | `Int -> [a] -> ([a],[a])`        | 分割列表为两部分    | `splitAt 2 [1,2,3] = ([1,2],[3])`         |
| `filter`    | `(a -> Bool) -> [a] -> [a]`      | 过滤满足条件的元素   | `filter even [1..5] = [2,4]`              |
| `map`       | `(a -> b) -> [a] -> [b]`         | 对列表每个元素应用函数 | `map (+1) [1,2,3] = [2,3,4]`              |
| `foldl`     | `(b -> a -> b) -> b -> [a] -> b` | 从左到右折叠      | `foldl (+) 0 [1,2,3] = 6`                 |
| `foldr`     | `(a -> b -> b) -> b -> [a] -> b` | 从右到左折叠      | `foldr (:) [] [1,2,3] = [1,2,3]`          |
| `zip`       | `[a] -> [b] -> [(a,b)]`          | 两个列表配对成元组列表 | `zip [1,2] ['a','b'] = [(1,'a'),(2,'b')]` |
| `zipWith`   | `(a -> b -> c) -> [a] -> [b] -> [c]` | 两个列表的对应元素分别应用一个函数，返回一个新列表 | `zipWith (+) [1,2] [3,4] = [4,6]`          |
| `concat`    | `[[a]] -> [a]`                   | 合并列表的列表     | `concat [[1,2],[3]] = [1,2,3]`            |
| `concatMap` | `(a -> [b]) -> [a] -> [b]`      | 对列表每个元素应用函数，返回一个新列表 | `concatMap (\x -> [x,x]) [1,2,3] = [1,1,2,2,3,3]` |
| `elem`      | `Eq a => a -> [a] -> Bool`       | 判断元素是否在列表中  | `elem 3 [1,2,3] = True`                   |
| `notElem`   | `Eq a => a -> [a] -> Bool`       | 判断元素不在列表中   | `notElem 4 [1,2,3] = True`                |
| `takeWhile` | `(a -> Bool) -> [a] -> [a]`      | 从头取满足条件的元素  | `takeWhile (<3) [1,2,3] = [1,2]`          |
| `dropWhile` | `(a -> Bool) -> [a] -> [a]`      | 从头丢弃满足条件的元素 | `dropWhile (<3) [1,2,3] = [3]`            |
| `span`      | `(a -> Bool) -> [a] -> ([a], [a])` | 从头分割列表，前部分满足条件，后部分不满足，在第一次不满足条件时停止 | `span (<3) [1,2,3] = ([1,2],[3])`          |
| `all`       | `(a -> Bool) -> [a] -> Bool`      | 判断列表所有元素是否满足条件 | `all (<3) [1,2,3] = True`            |
| `\\`        | `(a -> Bool) -> [a] -> [a]`      | 列表差集操作符 | `[1,2,3] \\ [1,2] = [3]`            |
| `flip`      | `(a -> b -> c) -> b -> a -> c`   | 翻转函数参数顺序 | `flip (++) "word" " hello" = "hello word"`            |
---

### 数字和数学

| 函数                                | 类型签名                                 | 说明           | 例子                            |
| --------------------------------- | ------------------------------------ | ------------ | ----------------------------- |
| `(+)`, `(-)`, `(*)`, `div`, `mod` | 数字的加减乘除及模运算                          | 常见算术运算       | `5 + 3 = 8`                   |
| `abs`                             | `Num a => a -> a`                    | 取绝对值         | `abs (-5) = 5`                |
| `signum`                          | `Num a => a -> a`                    | 符号函数         | `signum (-3) = -1`            |
| `fromIntegral`                    | `(Integral a, Num b) => a -> b`      | 整数转换成更一般数字类型 | `fromIntegral 5 :: Double`    |
| `sqrt`                            | `Floating a => a -> a`               | 平方根          | `sqrt 9 = 3.0`                |
| `(^)`                             | `(Num a, Integral b) => a -> b -> a` | 幂运算          | `2 ^ 3 = 8`                   |
| `quot`, `rem`                     | `Integral a => a -> a -> a`          | 商和余数         | `quot 7 3 = 2`, `rem 7 3 = 1` |
| `max`, `min`                      | `Ord a => a -> a -> a`               | 最大值和最小值       | `max 3 5 = 5`, `min 3 5 = 3` |

---

### 布尔逻辑

| 函数          | 类型签名   | 说明        | 例子                                      |         |                         |
| ----------- | ------ | --------- | --------------------------------------- | ------- | ----------------------- |
| `&&`, \`    |    `Bool`    | `, `not\` | `Bool -> Bool -> Bool` / `Bool -> Bool` | 逻辑与、或、非 | `True && False = False` |
| `otherwise` | `Bool` | 总为真，用于守卫  | `otherwise = True`                      |         |                         |

---

### 字符串和字符

| 函数             | 类型签名                                  | 说明        | 例子                                    |
| -------------- | ------------------------------------- | --------- | ------------------------------------- |
| `head`, `tail` | `[Char] -> Char` / `[Char] -> [Char]` | 取首字符和尾字符串 | `head "hello" = 'h'`                  |
| `length`       | `[Char] -> Int`                       | 计算字符串长度   | `length "abc" = 3`                    |
| `++`           | `[a] -> [a] -> [a]`                   | 字符串连接     | `"hello" ++ " world" = "hello world"` |



### 语法/函数

| 语法/函数                        | 示例代码                                                   | 说明/作用                    | 常用场景或备注                         |
| ---------------------------- | ------------------------------------------------------ | ------------------------ | ------------------------------- |
| **匿名函数**（Lambda）             | `\x -> x + 1`                                          | 定义没有名字的函数，`x` 是参数，右边是函数体 | 传递给 `map`, `filter` 等高阶函数       |
| 多参数匿名函数                      | `\x y -> x * y`                                        | 函数可有多个参数                 | `zipWith (\x y -> x + y) xs ys` |
| **case表达式**                  | `case x of 0 -> "zero"; _ -> "nonzero"`                | 模式匹配，对变量的值分支处理           | 替代复杂的 if/then/else              |
| **函数箭头 `->`**                | `f x = x + 1`<br>`\x -> x + 1`<br>`case x of 1 -> ...` | 用于函数定义和case匹配中的模式和结果分隔   | 任何函数定义、case分支语法                 |
| **通配符 `_`**                  | `case xs of [] -> 0; _ -> 1`                           | 匹配任意不关心的值                | 忽略变量，减少模式匹配冗余                   |
| **let/in 绑定**                | `let y = 2*x in y + 3`                                 | 在表达式中局部定义变量              | 用于复杂计算局部绑定                      |
| **where绑定**                  | `f x = y + 3 where y = 2*x`                            | 在函数定义后局部绑定变量             | 增加可读性，局部命名                      |
| **if then else**             | `if x > 0 then "pos" else "neg"`                       | 条件判断表达式                  | 简单条件表达式替代case                   |
| **高阶函数 map**                 | `map (\x -> x*2) [1,2,3]`                              | 对列表每个元素应用函数              | 列表元素批量转换                        |
| **高阶函数 filter**              | `filter even [1..10]`                                  | 过滤满足条件的元素                | 过滤列表中满足条件的元素                    |
| **高阶函数 foldl**               | `foldl (+) 0 [1,2,3]`                                  | 从左开始累积                   | 求和、求积、累积结果                      |
| **高阶函数 foldr**               | `foldr (:) [] [1,2,3]`                                 | 从右开始累积                   | 构造列表，递归遍历                       |
| **zip**                      | `zip [1,2] ['a','b']`                                  | 组合两个列表成元组列表              | 两个列表按位置配对                       |
| **zipWith**                  | `zipWith (+) [1,2] [3,4]`                              | 对两个列表对应元素应用函数            | 同时处理两个列表                        |
| **function composition (.)** | `(negate . abs) (-5)`                                  | 函数组合，先执行右边，再执行左边         | 简化多函数嵌套调用                       |
| **currying**                 | `add x y = x + y` 实际为 `add = \x -> \y -> x + y`        | 函数自动柯里化，可部分应用            | 方便传递参数较少的函数                     |
| **Maybe Monad do写法**         | `do { x <- Just 1; return (x+1) }`                     | 链式处理可能失败的计算              | 处理带有 `Nothing` 可能性的计算           |
| `read` | `read "123" :: Int` | 将字符串转换为指定类型 | 将字符串转换为整数 |
| `show` | `show 123` | 将指定类型转换为字符串 | 将整数转换为字符串 |

### 类
```haskell
data Square = Red | Black | Empty deriving (Eq, Ord, Show) -- 定义一个Square类，有三个值：Red, Black, Empty

instance Show Square where -- 重写Show类，使得Square可以被自定义打印
    show Red = "Red111"
    show Black = "Black11"
    show Empty = "Empty11"

instance Eq Square where -- 重写Eq类，使得Square可以被比较
    Red == Red = True

-- a 代表列表中的元素类型
data List a = ListNode a (List a) | ListEnd
-- 这样的类型是定义死的
data List = ListNode Int List | ListEnd


data Person a b = Person a b deriving (Show)
tellMan :: (Show a, Show b) => Person a b -> String
tellMan (Person name age) = "Name: " ++ name ++ ", Age: " ++ show age

data Vector a = Vector a a a deriving (Show)

vplus :: (Num a) => Vector a -> Vector a -> Vector a
vplus (Vector a b c) (Vector a' b' c') = Vector (a + a') (b + b') (c + c')

vmult :: (Num a) => Vector a -> a -> Vector a
vmult (Vector a b c) k = Vector (a * k) (b * k) (c * k)

-- 递归定义的列表
data List a = ListNode a (List a) | ListEnd

mylength :: List a -> Int
mylength ListEnd         = 0
mylength (ListNode _ xs) = 1 + mylength xs

mymaximum :: Ord a => List a -> a
mymaximum ListEnd = error "Empty list has no maximum"
mymaximum (ListNode x xs) = maxHelper x xs
  where
    maxHelper currMax ListEnd = currMax
    maxHelper currMax (ListNode y ys) = maxHelper (max currMax y) ys

```





### Tree
```haskell
-- 二叉树
data BST a = Empty | Node (BST a) a (BST a) deriving (Eq, Show)

-- 1. 最大深度
maxDepth :: BST a -> Int
maxDepth Empty = 0
maxDepth (Node l _ r) = 1 + max (maxDepth l) (maxDepth r)

-- 2. 最小深度
minDepth :: BST a -> Int
minDepth Empty = 0
minDepth (Node l _ r) = 1 + min (minDepth l) (minDepth r)

-- 3. 判断是否为空
isEmpty :: BST a -> Bool
isEmpty Empty = True
isEmpty _     = False

-- 4. 判断是否平衡（最大深度和最小深度差<=1）
isBalanced :: BST a -> Bool
isBalanced t = maxDepth t - minDepth t <= 1

-- 5. 中序遍历
inorder :: BST a -> [a]
inorder Empty = []
inorder (Node l v r) = inorder l ++ [v] ++ inorder r

-- 6. 插入元素到BST
bstInsert :: Ord a => a -> BST a -> BST a
bstInsert x Empty = Node Empty x Empty
bstInsert x (Node l v r)
  | x <= v    = Node (bstInsert x l) v r
  | otherwise = Node l v (bstInsert x r)

-- 7. 判断元素是否存在
bstSearch :: Ord a => a -> BST a -> Bool
bstSearch _ Empty = False
bstSearch x (Node l v r)
  | x == v    = True
  | x < v     = bstSearch x l
  | otherwise = bstSearch x r

-- 8. 计算节点总数
countNodes :: BST a -> Int
countNodes Empty = 0
countNodes (Node l _ r) = 1 + countNodes l + countNodes r

-- 9. 计算叶子节点数（左右子树都为空）
countLeaves :: BST a -> Int
countLeaves Empty = 0
countLeaves (Node Empty _ Empty) = 1
countLeaves (Node l _ r) = countLeaves l + countLeaves r

-- 10. 镜像树（交换左右子树）
mirrorTree :: BST a -> BST a
mirrorTree Empty = Empty
mirrorTree (Node l v r) = Node (mirrorTree r) v (mirrorTree l)

-- 11. 判断是否为BST
isBST :: Ord a => BST a -> Bool
isBST Empty = True
isBST (Node l v r) = isBST l && isBST r && all (< v) (inorder l) && all (> v) (inorder r)

-- 12. list to tree
listToTree :: [a] -> BST a
listToTree [] = Empty
listToTree (x:xs) = bstInsert x (listToTree xs)

-- 13. 判断是否两树是一个shape
isSameShape :: BST a -> BST a -> Bool
isSameShape Empty Empty = True
isSameShape (Node l1 v1 r1) (Node l2 v2 r2) = isSameShape l1 l2 && isSameShape r1 r2
isSameShape _ _ = False
```

---

### 1. 计算树的高度（深度）

```haskell
height :: BST a -> Int
height Empty = 0
height (Node l _ r) = 1 + max (height l) (height r)
```

---

### 2. 判断树是否是满二叉树（每个节点要么是叶子，要么有两个子节点）

```haskell
isFull :: BST a -> Bool
isFull Empty = True
isFull (Node Empty _ Empty) = True
isFull (Node l _ r) = isFull l && isFull r && (l /= Empty && r /= Empty)
isFull _ = False
```

---

### 3. 查找某个元素是否在树中存在

```haskell
contains :: Eq a => a -> BST a -> Bool
contains _ Empty = False
contains x (Node l v r)
  | x == v = True
  | otherwise = contains x l || contains x r
```

---

### 4. 将树转成列表（中序遍历）

```haskell
toList :: BST a -> [a]
toList Empty = []
toList (Node l v r) = toList l ++ [v] ++ toList r
```

---

### 5. 计算树中节点值的总和（假设存的值是数字）

```haskell
sumTree :: Num a => BST a -> a
sumTree Empty = 0
sumTree (Node l v r) = sumTree l + v + sumTree r
```

---

### 6. 找出树中的最大值（假设树非空且元素可比较）
```haskell
-- 非BST 的情况
maxValue :: Ord a => BST a -> a
maxValue Empty = error "Empty tree"
maxValue (Node l v r) = maximum [v, maxL, maxR]
  where
    maxL = if l == Empty then v else maxValue l
    maxR = if r == Empty then v else maxValue r

-- BST 的情况
maxValue :: Ord a => BST a -> a
maxValue Empty = error "Empty tree"
maxValue (Node _ v Empty) = v            -- 没有右子树，当前就是最大值
maxValue (Node _ _ r)     = maxValue r   -- 否则继续向右找
```

---

### 7. 判断树是否对称（镜像对称）

```haskell
isSymmetric :: Eq a => BST a -> Bool
isSymmetric Empty = True
isSymmetric (Node l _ r) = isMirror l r

isMirror :: Eq a => BST a -> BST a -> Bool
isMirror Empty Empty = True
isMirror (Node l1 v1 r1) (Node l2 v2 r2) =
  v1 == v2 && isMirror l1 r2 && isMirror r1 l2
isMirror _ _ = False
```

---

### 8. 计算路径总和（判断是否存在根到叶子路径，路径和等于给定值）

```haskell
hasPathSum :: (Num a, Eq a) => BST a -> a -> Bool
hasPathSum Empty _ = False
hasPathSum (Node Empty v Empty) sum = v == sum
hasPathSum (Node l v r) sum =
  hasPathSum l (sum - v) || hasPathSum r (sum - v)
```

---


## 常见问题
```haskell
-- 手写实现Haskell常用列表/字符串操作函数

-- 筛选出非空列表
let notNull x = not (null x) in filter notNull [[1],[]]

-- 筛选出大写字母
filter (`elem` ['A'..'Z']) "Hello World"

-- 筛选出小于1000的偶数的平方的和
sum (takeWhile (<1000) (filter even (map (^2) [1..])))

-- 计算多项式
sum $ zipWith (*) c $ map (x^) [0..]

-- intersperse: 在列表元素之间插入分隔符
intersperse :: a -> [a] -> [a]
intersperse _ [] = []
intersperse _ [x] = [x]
intersperse sep (x:xs) = x : sep : intersperse sep xs

-- intercalate: 在列表的列表之间插入分隔符列表，然后连接
intercalate :: [a] -> [[a]] -> [a]
intercalate _ [] = []
intercalate _ [xs] = xs
intercalate sep (xs:xss) = xs ++ sep ++ intercalate sep xss

-- transpose: 转置矩阵
transpose :: [[a]] -> [[a]]
transpose [] = []
transpose ([] : xss) = transpose xss
transpose ((x:xs) : xss) = (x : [h | (h:_) <- xss]) : transpose (xs : [t | (_:t) <- xss])

-- concat: 连接列表的列表
concat :: [[a]] -> [a]
concat [] = []
concat (xs:xss) = xs ++ concat xss

-- concatMap: 对每个元素应用函数然后连接结果
concatMap :: (a -> [b]) -> [a] -> [b]
concatMap _ [] = []
concatMap f (x:xs) = f x ++ concatMap f xs

-- and: 逻辑AND操作 所有元素都是 True → 返回 True
and :: [Bool] -> Bool
and [] = True
and (x:xs) = x && and xs

-- or: 逻辑OR操作  
or :: [Bool] -> Bool
or [] = False
or (x:xs) = x || or xs

-- any: 检查是否有任何元素满足条件
any :: (a -> Bool) -> [a] -> Bool
any _ [] = False
any p (x:xs) = p x || any p xs

-- all: 检查是否所有元素都满足条件
all :: (a -> Bool) -> [a] -> Bool
all _ [] = True
all p (x:xs) = p x && all p xs

-- iterate: 无限迭代应用函数
iterate :: (a -> a) -> a -> [a]
iterate f x = x : iterate f (f x)

-- splitAt: 在指定位置分割列表
splitAt :: Int -> [a] -> ([a], [a])
splitAt 0 xs = ([], xs)
splitAt _ [] = ([], [])
splitAt n (x:xs) = let (ys, zs) = splitAt (n-1) xs in (x:ys, zs)

-- dropWhile: 丢弃满足条件的前缀元素
dropWhile :: (a -> Bool) -> [a] -> [a]
dropWhile _ [] = []
dropWhile p (x:xs)
  | p x = dropWhile p xs
  | otherwise = x:xs

-- span: 分割列表，前部分满足条件，后部分不满足，在第一次不满足条件时停止
span :: (a -> Bool) -> [a] -> ([a], [a])
span _ [] = ([], [])
span p (x:xs)
  | p x = let (ys, zs) = span p xs in (x:ys, zs)
  | otherwise = ([], x:xs)

-- break: span的对偶，找到第一个满足条件的位置分割
break :: (a -> Bool) -> [a] -> ([a], [a])
break p = span (not . p)

-- partition: 根据条件分割列表为两部分 不要求连续
partition :: (a -> Bool) -> [a] -> ([a], [a])
partition _ [] = ([], [])
partition p (x:xs) = 
  let (ys, zs) = partition p xs
  in if p x then (x:ys, zs) else (ys, x:zs)

-- sort: 简单的插入排序
sort :: Ord a => [a] -> [a]
sort [] = []
sort (x:xs) = insert x (sort xs)
  where
    insert y [] = [y]
    insert y (z:zs)
      | y <= z = y : z : zs
      | otherwise = z : insert y zs

-- group: 将相邻的相同元素分组
group :: Eq a => [a] -> [[a]]
group [] = []
group (x:xs) = (x : takeWhile (== x) xs) : group (dropWhile (== x) xs)

-- find: 查找第一个满足条件的元素
find :: (a -> Bool) -> [a] -> Maybe a
find _ [] = Nothing
find p (x:xs)
  | p x = Just x
  | otherwise = find p xs

-- elemIndex: 查找元素的第一个索引
elemIndex :: Eq a => a -> [a] -> Maybe Int
elemIndex x xs = findIndex (== x) xs

-- findIndex: 查找满足条件的第一个元素的索引
findIndex :: (a -> Bool) -> [a] -> Maybe Int
findIndex p xs = findIndex' p xs 0
  where
    findIndex' _ [] _ = Nothing
    findIndex' p (x:xs) n
      | p x = Just n
      | otherwise = findIndex' p xs (n+1)

-- elemIndices: 查找元素的所有索引
elemIndices :: Eq a => a -> [a] -> [Int]
elemIndices x xs = findIndices (== x) xs

-- findIndices: 查找满足条件的所有元素的索引
findIndices :: (a -> Bool) -> [a] -> [Int]
findIndices p xs = findIndices' p xs 0
  where
    findIndices' _ [] _ = []
    findIndices' p (x:xs) n
      | p x = n : findIndices' p xs (n+1)
      | otherwise = findIndices' p xs (n+1)

-- lines: 按换行符分割字符串
lines :: String -> [String]
lines "" = []
lines s = let (l, s') = break (== '\n') s
          in l : case s' of
                   [] -> []
                   (_:s'') -> lines s''

-- unlines: 用换行符连接字符串列表
unlines :: [String] -> String
unlines [] = []
unlines (x:xs) = x ++ "\n" ++ unlines xs

-- words: 按空白字符分割字符串
words :: String -> [String]
words s = case dropWhile isSpace s of
            "" -> []
            s' -> w : words s''
                  where (w, s'') = break isSpace s'

-- unwords: 用空格连接字符串列表
unwords :: [String] -> String
unwords [] = ""
unwords [w] = w
unwords (w:ws) = w ++ " " ++ unwords ws

-- 辅助函数：判断是否为空白字符
isSpace :: Char -> Bool
isSpace c = c `elem` " \t\n\r"

-- intersect: 求两个列表的交集
intersect :: Eq a => [a] -> [a] -> [a]
intersect [] _ = []
intersect (x:xs) ys
  | x `elem` ys = x : intersect xs ys
  | otherwise = intersect xs ys

-- union: 求两个列表的并集
union :: Eq a => [a] -> [a] -> [a]
union [] ys = ys
union (x:xs) ys
  | x `elem` ys = union xs ys
  | otherwise = x : union xs ys

-- nub: 去除列表中的重复元素
nub :: Eq a => [a] -> [a]
nub [] = []
nub (x:xs) = x : nub (filter (/= x) xs)

-- delete: 删除列表中第一个匹配的元素
delete :: Eq a => a -> [a] -> [a]
delete _ [] = []
delete y (x:xs)
  | x == y = xs
  | otherwise = x : delete y xs

-- deleteAll: 删除列表中所有匹配的元素
deleteAll :: Eq a => a -> [a] -> [a]
deleteAll _ [] = []
deleteAll y (x:xs)
  | x == y    = deleteAll y xs   -- 跳过当前元素，继续删除
  | otherwise = x : deleteAll y xs  -- 保留当前元素，继续删除

-- insert: 在有序列表中插入元素
insert :: Ord a => a -> [a] -> [a]
insert x [] = [x]
insert x (y:ys)
  | x <= y = x : y : ys
  | otherwise = y : insert x ys

-- isPrefixOf: 检查是否为前缀
isPrefixOf :: Eq a => [a] -> [a] -> Bool
isPrefixOf [] _ = True
isPrefixOf _ [] = False
isPrefixOf (x:xs) (y:ys) = x == y && isPrefixOf xs ys

-- isSuffixOf: 检查是否为后缀
isSuffixOf :: Eq a => [a] -> [a] -> Bool
isSuffixOf xs ys = isPrefixOf (reverse xs) (reverse ys)

-- isInfixOf: 检查是否为子列表
isInfixOf :: Eq a => [a] -> [a] -> Bool
isInfixOf [] _ = True
isInfixOf _ [] = False
isInfixOf xs ys@(_:ys')
  | isPrefixOf xs ys = True
  | otherwise = isInfixOf xs ys'
```



## 字符串处理

好的，下面是针对之前提到的**常见字符串题目**的 Haskell **标准写法答案**，从简单到复杂：

---

### 1️⃣ 统计某字符出现次数

```haskell
countChar :: Char -> String -> Int
countChar c = length . filter (== c)
```

---

### 2️⃣ 去除所有空格

```haskell
removeSpaces :: String -> String
removeSpaces = filter (/= ' ')
```

---

### 3️⃣ 判断是否是回文

```haskell
isPalindrome :: String -> Bool
isPalindrome s = s == reverse s
```

---

### 4️⃣ 统计每个字符出现次数

```haskell
import Data.List (group, sort)

countFreqs :: String -> [(Char, Int)]
countFreqs s = map (\g -> (head g, length g)) . group . sort $ s
```
---

### 5️⃣ 反转字符串

```haskell
reverseStr :: String -> String
reverseStr = reverse
```

---

### 6️⃣ Run-Length Encoding（压缩）

```haskell
import Data.List (group)

rle :: String -> String
rle = concatMap (\g -> [head g] ++ show (length g)) . group
```

---

### 7️⃣ Run-Length Decoding（解压）

```haskell
import Data.Char (isDigit)

decodeRLE :: String -> String
decodeRLE [] = []
decodeRLE (c:cs) =
  let (digits, rest) = span isDigit cs
  in replicate (read digits) c ++ decodeRLE rest
```

---

### 8️⃣ 将每个单词首字母大写

```haskell
import Data.Char (toUpper)

capitalizeWords :: String -> String
capitalizeWords = unwords . map capitalize . words
  where capitalize (x:xs) = toUpper x : xs
        capitalize [] = []
```

---

### 9️⃣ 按空格分词（其实就是 `words`）

```haskell
splitWords :: String -> [String]
splitWords = words
```

---

### 🔟 移除重复字符，保留顺序

```haskell
import Data.List (nub)

removeDup :: String -> String
removeDup = nub
```

---

### 1️⃣1️⃣ 子序列

```haskell
subsequences :: [a] -> [[a]]
subsequences [] = [[]]
subsequences (x:xs) = let rest = subsequences xs
                      in rest ++ map (x:) rest
```

---

### 1️⃣2️⃣ 所有长度为 k 的子串

```haskell
substringsOfLength :: Int -> String -> [String]
substringsOfLength k s
  | length s < k = []
  | otherwise    = take k s : substringsOfLength k (tail s)
```

---

### 1️⃣3️⃣ 判断两个字符串是否是字母异位词（Anagram）

```haskell
import Data.List (sort)

isAnagram :: String -> String -> Bool
isAnagram s1 s2 = sort s1 == sort s2
```

---

