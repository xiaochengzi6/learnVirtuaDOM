## element.js
用来生成 js 对象模拟 dom 树
~~~js
function createElement(type, props, children) {} => {} /*返回的对象存储这 模拟的dom树*/
~~~
## diff.js
用来对比模拟dom树的不同

diff会进行深度优先的遍历记录并返回差异
使用到的问题是字符串的最小编辑距离问题，最常见的解决算法是  Levenshtein Distance
~~~js
function diff(oldTree, newTree){} => {} /*返回的对象里面保存着 dom 不同点*/
/**
 * oldTree 和 newTree 比较
 * 1.dom移除 打上标记 {type: 'REMOVE', index}
 * 2.dom是字符串 ? 是 并且不相同 {type: 'TEXT', newNode}
 * 3.dom节点类型相同 ? 是 属性改变 {type: 'ATTR', attr}  如果有子节点 ？ 在经历 1->4 的步骤
 * 4.dom节点不同 ？ 是 {type: 'REPLACE', newNode}
 */
~~~

主要流程是深度优先的遍历方式 通过遍历得到得到与新老节点的差异保存下来索引值是(节点深度优先)遍历的顺序，当 dom 树以同样的方式遍历并取得对应的差异就开始操作 dom 


## patch.js
用来合并修改 dom树
对dom 树进行深度优先的遍历，遍历的时候根据返回不同的标记来处理dom操作
~~~js
function patch() {} => /*返回一个修改好的dom*/
~~~


## 总结 

Virtual DOM 算法主要是实现上面步骤的三个函数：element，diff，patch。然后就可以实际的进行使用。

1、使用 `element.js` 生成虚拟节点产出虚拟 dom 树也就是 js 对象表示的 dom 树。
2、使用 `diff.js` 进行深度优先的比对工作 将差异存放起来
3、使用 `patch.js` 将 diff 中的差异提取出来在以同样的方式遍历然后找到对应的差异并应用上

## 最小编辑距离 -- > Levenshtein Distance 算法

解决字符串的动态规划问题：
s_i = 'rad'
s_j = 'apple'

只能用三种操作： 1.删除 2.替换 3.增加

代码的框架是这样 主要是先找到了 `base case` 也就是递归循环的终止条件。然后递归函数 关于 [bae case](https://akaedu.github.io/book/ch05s03.html)的介绍。
~~~js
if s1[i] == s2[j]:
    啥都别做（skip）
    i, j 同时向前移动
else:
    三选一：
        插入（insert）
        删除（delete）
        替换（replace）
~~~
三个函数全部尝试一遍哪一个编辑路径最小就选择哪一个
> s_i 要根据 s_j 来进行改变
~~~ c++
def minDistance(s1, s2) -> int:

    def dp(i, j):
        # base case
        if i == -1: return j + 1
        if j == -1: return i + 1

        if s1[i] == s2[j]:
            return dp(i - 1, j - 1)  # 啥都不做
        else:
            return min(
                dp(i, j - 1) + 1,    # 插入
                dp(i - 1, j) + 1,    # 删除
                dp(i - 1, j - 1) + 1 # 替换
            )

    # i，j 初始化指向最后一个索引
    return dp(len(s1) - 1, len(s2) - 1)
~~~
1、`base casse` 中如果 i 是-1 就会返回 j + 1 的操作数 如果j = -1 就会返回 i + 1 的操作数

2、如果两者相同 `if(s1[i] == s2[j])`说明这个时候没有任何的操作。 `dp(i-1, j-1) + 0`

3、插入的话是 `dp(i, j-1) + 1` 操作步骤加 1  删除是 `dp(i-1, j) + 1` 替换`dp(i-1, j-1) + 1` 这三者中哪一个操作数最小就选择那个

这种解决问题的方法是暴力递归解法 所有的可能性都尝试完得到最小的操作数

这个出现了重叠子问题需要进行动态规划优化 有两种方法 备忘录 或者 DP table

增加备忘录
~~~js
def minDistance(s1, s2) -> int:

    memo = dict() # 备忘录
    def dp(i, j):
        if (i, j) in memo: 
            return memo[(i, j)]
        ...

        if s1[i] == s2[j]:
            memo[(i, j)] = ...  
        else:
            memo[(i, j)] = ...
        return memo[(i, j)]

    return dp(len(s1) - 1, len(s2) - 1)
~~~

使用 DP table

| s_i\s_j | "  " | a    | p    | p    | l    | e    |
| ---- | :--- | ---- | ---- | ---- | ---- | ---- |
| "  " | 0    | 1    | 2    | 3    | 4    | 5    |
| r    | 1    | 1    | 2    | 3    | 4    | 5    |
| a    | 2    | 1    | 2    | 3    | 4    | 5    |
| d    | 3    | 1    | 2    | 3    | 4    | 5    |

dp 函数的 base case 是 i,j 等于 -1，而数组索引至少是 0，所以 dp 数组会偏移一位。


~~~ c++
int minDistance(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    // base case 
    for (int i = 1; i <= m; i++)
        dp[i][0] = i;
    for (int j = 1; j <= n; j++)
        dp[0][j] = j;
    // 自底向上求解
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1.charAt(i-1) == s2.charAt(j-1))
                dp[i][j] = dp[i - 1][j - 1];
            else               
                dp[i][j] = min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i-1][j-1] + 1
                );
    // 储存着整个 s1 和 s2 的最小编辑距离
    return dp[m][n];
}

int min(int a, int b, int c) {
    return Math.min(a, Math.min(b, c));
}
~~~

## 参考文章 
1. [详解一道经典面试题：编辑距离](https://zhuanlan.zhihu.com/p/80682302)

2. [字符串相似度算法（编辑距离算法 Levenshtein Distance）](https://www.cnblogs.com/ivanyb/archive/2011/11/25/2263356.html)

3. [深度剖析：如何实现一个 Virtual DOM 算法 - 作者：戴嘉华](https://github.com/livoras/blog/issues/13)
