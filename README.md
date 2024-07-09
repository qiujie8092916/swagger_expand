# swagger-expand
- 一个 Tampermonkey 脚本，用于对老版本的 swagger 不能自动展开，不能根据 hash 定位对应 API 功能缺陷的增强
- 如果有 hash: 会定位到对应 API 位置
- 如果没有 hash: 会默认展开所有，以显示 API，方便快速手动定位

## 使用
视情况将 @match \[https://**/*/swagger-ui.html\] 替换

## 兼容性
None

