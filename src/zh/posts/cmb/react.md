---
icon: pen-to-square
date: 2026-02-15
category:
  - Job Notes
tag:
  - China Merchant Bank
---

# React 与 JSX 教学

## 一、JSX 是什么

**JSX**（JavaScript XML）是 JavaScript 的语法扩展，允许在 JS 中写类似 HTML 的标记。它**不是** HTML，也不是字符串，而是会被编译成普通的 JavaScript 函数调用。

```jsx
// 你写的 JSX
const element = <h1>Hello, world!</h1>;

// 编译后（简化示意）
const element = React.createElement('h1', null, 'Hello, world!');
```

**核心理解**：JSX 本质是 `React.createElement()` 的语法糖，最终产物是 JavaScript 对象（React 元素）。

## 二、JSX 与 JavaScript 的关系

### 1. JSX 必须被编译

浏览器不能直接执行 JSX，需要 Babel 等工具转成 JS：

| 阶段 | 内容 |
|------|------|
| 源码 | JSX 语法 |
| 编译后 | `React.createElement()` 调用 |
| 运行结果 | 描述 UI 的 JavaScript 对象 |

### 2. 在 JSX 中嵌入 JavaScript 表达式

用 `{}` 包裹任意**合法 JavaScript 表达式**：

```jsx
const name = '张三';
const element = <h1>你好，{name}！</h1>;

// 表达式可以是变量、运算、函数调用
const a = 1, b = 2;
const el = <p>1 + 2 = {a + b}</p>;

function greet(user) {
  return user.name;
}
const el2 = <p>{greet({ name: '李四' })}</p>;
```

**注意**：`{}` 里必须是**表达式**，不能是语句（如 `if`、`for`）：

```jsx
// ❌ 错误：if 是语句
<p>{ if (ok) { 'yes' } }</p>

// ✅ 正确：用三元表达式
<p>{ ok ? 'yes' : 'no' }</p>
```

### 3. JSX 本身也是表达式

JSX 编译后是对象，可以像普通值一样使用：

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {user.name}</h1>;
  }
  return <h1>Hello, Stranger</h1>;
}
```

## 三、JSX 语法规则

### 1. 必须有一个根元素

```jsx
// ❌ 错误：多个根
return (
  <h1>标题</h1>
  <p>段落</p>
);

// ✅ 正确：用 div 或 Fragment 包裹
return (
  <div>
    <h1>标题</h1>
    <p>段落</p>
  </div>
);

// ✅ 或使用 Fragment（不产生额外 DOM）
return (
  <>
    <h1>标题</h1>
    <p>段落</p>
  </>
);
```

### 2. Fragment：不产生额外 DOM 的容器

**Fragment** 是 React 提供的组件，用于**包裹多个子元素但不产生真实 DOM 节点**。

**为什么需要？** 用 `<div>` 包裹会多出一个 DOM 节点，有时会破坏布局（如表格结构要求 `<tr>` 下直接是 `<td>`，不能夹一层 `div`）。

```jsx
// 完整写法
import { Fragment } from 'react';

return (
  <Fragment>
    <td>单元格1</td>
    <td>单元格2</td>
  </Fragment>
);

// 简写：空标签 <>
return (
  <>
    <td>单元格1</td>
    <td>单元格2</td>
  </>
);
```

| 写法 | DOM 结果 |
|------|----------|
| `<div>...</div>` | 多一个 `<div>` 节点 |
| `<Fragment>...</Fragment>` 或 `<>...</>` | 不增加任何节点，子元素直接挂到父级 |

**总结**：Fragment 是「逻辑上的容器」，不产生真实 DOM，适合需要分组但不想要多余标签的场景（表格、列表、条件渲染等）。

### 3. 标签必须闭合

```jsx
// ❌ 错误
<img src="x.jpg">

// ✅ 正确：自闭合
<img src="x.jpg" />
```

### 4. 属性名用 camelCase

JSX 更接近 JavaScript，属性名遵循驼峰命名：

```jsx
// HTML          →  JSX
// class         →  className
// for            →  htmlFor
// onclick        →  onClick
// tabindex       →  tabIndex

<div className="container" onClick={handleClick}>
  <label htmlFor="email">邮箱</label>
</div>
```

### 5. 属性值为字符串或表达式

```jsx
// 字符串：用引号
<input type="text" placeholder="请输入" />

// 表达式：用 {}
<input value={userName} disabled={isLoading} />
```

## 四、JSX 中的 JavaScript 常见用法

### 1. 条件渲染

```jsx
// 三元表达式
{ isLoggedIn ? <UserPanel /> : <LoginButton /> }

// 逻辑与 &&（常用于「有则显示」）
{ hasError && <ErrorMessage /> }

// 提前 return
if (!user) return null;
return <Profile user={user} />;
```

### 2. 列表渲染

```jsx
const items = ['苹果', '香蕉', '橙子'];

// 必须提供 key（稳定、唯一）
<ul>
  {items.map((item, index) => (
    <li key={item}>{item}</li>
  ))}
</ul>

// 数据带 id 时用 id 作 key
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}
```

### 3. 事件处理

事件名用 camelCase，传入**函数引用**而非调用结果：

```jsx
// ✅ 正确：传入函数
<button onClick={handleClick}>点击</button>

// ❌ 错误：handleClick() 会立即执行
<button onClick={handleClick()}>点击</button>

// 需要传参时用箭头函数包裹
<button onClick={() => handleDelete(id)}>删除</button>
```

### 4. 样式

```jsx
// 内联样式：对象，属性用 camelCase
<div style={{ color: 'red', fontSize: 16 }}>文本</div>

// 注意：外层 {} 是 JSX 表达式，内层 {} 是对象字面量
```

## 五、JSX 与 HTML 的主要区别

| 维度 | HTML | JSX |
|------|------|-----|
| 本质 | 标记语言 | 编译为 JS 的语法扩展 |
| 属性名 | `class`、`onclick` | `className`、`onClick` |
| 表达式 | 无 | 用 `{}` 嵌入 |
| 根元素 | 可有多个 | 必须单一根或 Fragment |
| 自闭合 | 部分标签可省略 | 必须显式闭合 |

## 六、小结

1. **JSX = JavaScript + 类 XML 语法**，编译后是 `React.createElement()` 调用
2. **`{}` 内写 JavaScript 表达式**，可放变量、运算、函数调用、三元、`map` 等
3. **属性、事件、样式**都遵循 JavaScript 命名和用法
4. 掌握 JSX，本质是掌握「在标记中嵌入 JavaScript」的规则
