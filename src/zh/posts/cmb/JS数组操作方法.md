---
icon: pen-to-square
date: 2026-08-11
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# JS数组操作方法

前端 JavaScript 常用数组操作方法：

```
const arr = [1, 2, 3];
```

- 增删（会修改原数组）

```
arr.push(4);       // 末尾添加 → [1, 2, 3, 4]
arr.pop();         // 删除末尾并返回 4
arr.unshift(0);    // 开头添加
arr.shift();       // 删除开头并返回第一个元素

arr.splice(1, 1);       // 从下标 1 删除 1 项
arr.splice(1, 0, 'a');  // 从下标 1 插入 a
arr.splice(1, 1, 'a');  // 替换下标 1 的元素
```

- 查询与判断

```
arr.includes(2);           // 是否包含 → true
arr.indexOf(2);            // 下标 → 1；不存在则 -1
arr.find(x => x > 1);      // 第一个满足条件的元素 → 2
arr.findIndex(x => x > 1); // 第一个满足条件的下标 → 1
arr.some(x => x > 2);      // 是否至少一个满足 → true
arr.every(x => x > 0);     // 是否全部满足 → true
```

- 遍历、转换、筛选（通常不修改原数组）

```
arr.forEach(x => console.log(x)); // 遍历，无返回新数组
arr.map(x => x * 2);              // 映射 → [2, 4, 6]
arr.filter(x => x > 1);           // 筛选 → [2, 3]
arr.reduce((sum, x) => sum + x, 0); // 累加 → 6
```

- 截取、合并、展开

```
arr.slice(1, 3);           // 截取 → [2, 3]，不改原数组
arr.concat([4, 5]);        // 合并 → [1, 2, 3, 4, 5]
[...arr, 4];               // 展开并新增
arr.join('-');             // 转字符串 → '1-2-3'
[1, [2, [3]]].flat(2);    // 扁平化 → [1, 2, 3]
```

- 排序与反转（会修改原数组）

```
arr.reverse();                 // 反转
arr.sort((a, b) => a - b);     // 数字升序
arr.sort((a, b) => b - a);     // 数字降序
```

若不想改原数组：

```
const sorted = [...arr].sort((a, b) => a - b);
// 或现代写法：arr.toSorted((a, b) => a - b)
```

- 常见对象数组操作

```
const users = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 }
];

users.map(u => u.name);              // ['张三', '李四']
users.filter(u => u.age >= 20);      // 筛选
users.find(u => u.id === 2);         // 查找对象
users.some(u => u.age < 18);         // 判断
users.reduce((sum, u) => sum + u.age, 0); // 求和
```

核心记忆：`map` 转换、`filter` 筛选、`find` 找一个、`reduce` 汇总、`splice` 原地增删改。