---
icon: pen-to-square
date: 2025-06-14
category:
  - Learning Records
tag:
  - Declarative Programming
---

# Prolog 内置谓词速查表

| 命令                              | 作用              |
| ------------------------------- | --------------- |
| `help(Name)`                    | 查看某个谓词的用法简要说明   |
| `apropos(Keyword)`              | 搜索包含某关键词的所有文档条目 |
| `listing(Name/Arity)`           | 查看用户自定义谓词定义     |
| `predicate_property(P,Prop)`    | 查询谓词的属性         |
| `current_predicate(Name/Arity)` | 查看所有当前存在的谓词     |
| `trace.` / `notrace.`           | 启用/禁用调试         |

---

## 🧰 基本谓词（结构、判断）

| 谓词          | 说明             | 示例                               |
| ----------- | -------------- | -------------------------------- |
| `X = Y`     | 结构统一           | `X = foo(Y)` → `X = foo(Y)`      |
| `X \= Y`    | 结构无法统一         | `foo(a) \= foo(b)` → `true`      |
| `X == Y`    | 完全相同（不试图统一）    | `X = a, Y = a, X == Y` → `true`  |
| `X \== Y`   | 不完全相同          | `X = a, Y = b, X \== Y` → `true` |
| `X is Expr` | 数值求值（右侧是算术表达式） | `X is 2 + 3` → `X = 5`           |
| `X =:= Y`   | 数值等于           | `2 + 3 =:= 5` → `true`           |
| `X =\= Y`   | 数值不等           | `5 =\= 6` → `true`               |
| `X @< Y`    | 字典序小于          | `'apple' @< 'banana'` → `true`   |
| `X @> Y`    | 字典序大于          | `'zoo' @> 'apple'` → `true`      |
| `\+`        | 逻辑非             | `\+ true` → `false`              |

var(Term) means Term is an unbound variable
nonvar(Term) means Term is not an unbound variable
ground(Term) means Term contains no unbound variables

---

## 🔢 数字运算  

| 谓词                  | 说明                   | 示例                                        |
| ------------------- | -------------------- | ----------------------------------------- |
| `+`                 | 加法                   | `2 + 3` → `5`                             |
| `-`                 | 减法                   | `5 - 2` → `3`                             |
| `*`                 | 乘法                   | `2 * 3` → `6`                             |
| `/`                 | 除法（浮点数）           | `5 / 2` → `2.5`                           |
| `div 或者 //`               | 整数除法（商）            | `5 div 2` → `2`                           |
| `rem`               | 取余（整数除法余数）        | `5 rem 2` → `1`                           |
| `abs`               | 绝对值                 | `abs(-5)` → `5`                          |
## 🔁 控制结构

| 谓词                    | 说明        | 示例                                     |
| --------------------- | --------- | -------------------------------------- |
| `(A, B)`              | 同时满足（AND） | `(X = 1, Y = 2)` → `X = 1, Y = 2`      |
| `(A ; B)`             | 任一满足（OR）  | `(X = 1 ; X = 2)` → `X = 1 ; X = 2`    |
| `Cond -> Then ; Else` | 条件分支      | `(X > 0 -> Pos = yes ; Pos = no)`      |
| `fail`                | 强制失败      | `(write('hello'), fail)` → 输出 hello，失败 |
| `true`                | 总是成功      | `true.` → `true`                       |

---

## 📋 列表处理

| 谓词                 | 说明                | 示例                                        |
| ------------------ | ----------------- | ----------------------------------------- |
| `member(X, L)`     | `X` 是 `L` 中的成员    | `member(2, [1,2,3])` → `true`             |
| `append(A,B,AB)`   | 拼接：`A ++ B = AB`  | `append([1,2],[3],R)` → `R = [1,2,3]`     |
| `length(L, N)`     | 求长度               | `length([a,b,c], N)` → `N = 3`            |
| `reverse(L, R)`    | 列表反转              | `reverse([1,2,3], R)` → `R = [3,2,1]`     |
| `select(X, L, R)`  | 移除元素 X，返回新列表 R    | `select(2, [1,2,3], R)` → `R = [1,3]`     |
| `nth0(I, L, X)`    | 第 `I` 个元素（从 0 开始） | `nth0(1, [a,b,c], X)` → `X = b`           |
| `maplist(P, L)`    | 对 L 中每个元素应用 P     | `maplist(writeln, [a,b,c])` 输出 abc        |
| `include(P, L, R)` | 保留满足 P 的元素        | `include(even, [1,2,4], R)` → `R = [2,4]` |
| `exclude(P, L, R)` | 删除满足 P 的元素        | `exclude(even, [1,2,4], R)` → `R = [1]`   |

---

## 🧠 元编程（谓词操作）

| 谓词                 | 说明                    | 示例                                                    |
| ------------------ | --------------------- | ----------------------------------------------------- |
| `findall(X, G, L)` | 所有满足 G 的 X 放进 L（重复保留） | `findall(X, member(X,[a,b]), L)` → `L = [a,b]`        |
| `bagof(X, G, L)`   | 分组结果（按自由变量分组）         | `bagof(X, Y^member(X-Y, [a-1,a-2]), L)` → `L = [a,a]` |
| `setof(模板, 条件, L)`   | 找出所有满足“条件”的解，用“模板”表示出来，并去重后放入“结果列表      | `setof(X, member(X,[b,a,b]), L)` → `L = [a,b]`        |
| `call(P)`          | 动态调用谓词                | `P = member(X,[1,2]), call(P)` → `X = 1 ; X = 2`      |
| `once(G)`          | 只取第一个解                | `once(member(X,[a,b]))` → `X = a`                     |
| `\+ Goal`          | `Goal` 不可满足时成立（逻辑非）   | `\+ member(3, [1,2])` → `true`                        |
| `^`                | 绑定变量（将变量绑定到值）        | `X^member(X,[1,2])` → `X = 1 ; X = 2`                 |

---

## 📊 排序 & 比较

| 谓词                  | 说明                   | 示例                                        |
| ------------------- | -------------------- | ----------------------------------------- |
| `sort(L, R)`        | 排序并去重                | `sort([3,1,2,1], R)` → `R = [1,2,3]`      |
| `msort(L, R)`       | 排序但保留重复项             | `msort([3,1,2,1], R)` → `R = [1,1,2,3]`   |
| `keysort(Pairs, R)` | 根据键排序，如 `K-V` 结构     | `keysort([2-b,1-a], R)` → `R = [1-a,2-b]` |
| `compare(O, A, B)`  | 比较字典顺序，得 `<`、`=`、`>` | `compare(R, apple, banana)` → `R = <`     |

---


## 🧪 调试辅助

| 谓词                   | 说明                  | 示例                                         |
| -------------------- | ------------------- | ------------------------------------------ |
| `trace`              | 开启逐步调试              | `trace.` → 开始追踪执行                          |
| `notrace`            | 关闭调试                | `notrace.`                                 |
| `listing`            | 显示当前定义的谓词规则         | `listing(largest_city/2).`                 |
| `print_term(T, [O])` | 美化打印结构体（SWI-Prolog） | `print_term(foo(bar,baz), [output(user)])` |

---

### CLP(FD)
:- use_module(library(clpfd)).

| 谓词                  | 说明                   | 示例                                        |
| ------------------- | -------------------- | ----------------------------------------- |
| `X #= Y`            | 数值相等               | `X #= 5` → `X = 5`                        |
| `X #\= Y`           | 数值不等               | `X #\= 5` → `X = 5`                       |
| `X #< Y`            | 数值小于               | `X #< 5` → `X = 5`                        |
| `X #> Y`            | 数值大于               | `X #> 5` → `X = 5`                        |
| `X #=< Y`           | 数值小于等于           | `X #=< 5` → `X = 5`                       |
| `X #>= Y`           | 数值大于等于           | `X #>= 5` → `X = 5`                       |
| `label(Vars)`        | 约束变量(告诉系统 “现在请开始遍历所有可能值，找出满足的组合”)               | `label([X,Y])` → `X = 5, Y = 5`            |


## 尾递归

```prolog
%用一个acc来记录累加值

sum_list(List, Sum) :-
    sum_list_acc(List, 0, Sum).

sum_list_acc([], Acc, Acc).
sum_list_acc([X|Xs], Acc, Sum) :-
    Acc1 is Acc + X,
    sum_list_acc(Xs, Acc1, Sum).
```

## 练习
---


### 1. `take_while_not_space/3` — 从头取连续非空格字符作为一个单词

```prolog
% take_while_not_space(Line, Word, Rest)
% 从 Line 中取出开头连续的非空格字符放到 Word，剩余放到 Rest。
take_while_not_space([], [], []).  % 空列表，Word 和 Rest 都为空
take_while_not_space([C|Cs], [], [C|Cs]) :-
    C = 0' , !.  % 如果第一个字符是空格，Word 结束为空，Rest 就是原列表
take_while_not_space([C|Cs], [C|Word], Rest) :-
    C \= 0' ,                          % 不是空格
    take_while_not_space(Cs, Word, Rest). % 继续递归
```

---

### 2. `split_on_predicate/4` — 按满足谓词条件的字符分割列表

```prolog
% split_on_predicate(List, Predicate, Prefix, Rest)
% 把 List 按第一个满足 Predicate 的元素分割为 Prefix 和 Rest。
split_on_predicate([], _, [], []).  % 空列表分割结果都空
split_on_predicate([H|T], Pred, [], [H|T]) :-
    call(Pred, H), !. % 如果当前头元素满足谓词，Prefix 为空，Rest 是整个列表
split_on_predicate([H|T], Pred, [H|Prefix], Rest) :-
    \+ call(Pred, H), % 如果不满足谓词，H 加入 Prefix
    split_on_predicate(T, Pred, Prefix, Rest). % 递归处理尾部
```

---

### 3. `compress_spaces/2` — 合并多个连续空格成一个空格

```prolog
% compress_spaces(Input, Output)
% 把 Input 字符列表中的连续空格合并成一个空格输出为 Output。
compress_spaces([], []).  % 空列表对应空输出
compress_spaces([0' |T], [0'|R]) :- % 当前字符是空格
    skip_spaces(T, T2),             % 跳过 Input 中所有连续空格
    compress_spaces(T2, R).         % 继续压缩剩余部分
compress_spaces([H|T], [H|R]) :-    % 非空格字符正常保留
    H \= 0' ,
    compress_spaces(T, R).

% skip_spaces(List, Rest)
% 跳过 List 开头的所有空格，返回剩余 Rest。
skip_spaces([0'|T], R) :-
    skip_spaces(T, R).
skip_spaces(L, L).
```

---

### 4. `prefix/2` — 判断一个列表是不是另一个列表的前缀

```prolog
% prefix(Prefix, List)
% 判断 Prefix 是否是 List 的前缀。
prefix([], _).              % 空列表是任何列表的前缀
prefix([H|T1], [H|T2]) :-   % 两列表头相同则递归比较尾部
    prefix(T1, T2).
```

---

### 5. `remove_duplicates/2` — 删除列表中重复元素，保留顺序

```prolog
% remove_duplicates(List, Result)
% 从 List 中删除重复元素，保留出现顺序。
remove_duplicates([], []).  % 空列表对应空结果
remove_duplicates([H|T], Result) :-
    member(H, T), !,         % 如果 H 在尾部 T 中出现过，跳过 H
    remove_duplicates(T, Result).
remove_duplicates([H|T], [H|Result]) :- % 否则保留 H
    remove_duplicates(T, Result).
```

---

### 6. `split_list/3` — 按长度分割列表成两部分

```prolog
% split_list(N, List, (Front, Back))
% 从 List 中分出前 N 个元素为 Front，剩余为 Back。
split_list(0, List, ([], List)).  % 分割长度为0，Front 空，Back 是整个列表
split_list(N, [H|T], ([H|Front], Back)) :-
    N > 0,
    N1 is N - 1,
    split_list(N1, T, (Front, Back)). % 递归分割尾部
```

---