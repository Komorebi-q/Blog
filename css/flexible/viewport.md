# Viewport

- layout viewport 渲染区域，页面真实所在位置
- visual viewport 视口区域，可视区域，仅控制缩放

## 为什么会存在viewport
正常pc页面直接渲染在手机浏览器上会出现布局问题，所以需要将大的页面渲染在 layout viewport（正常尺寸），之后将 layout viewport 的内容显示在 visual viewport （缩放）来做到样式适配。

### 手机浏览器的作用
- 将页面渲染在layout viewport
- 将layout viewport缩放

## 标签中的viewport

![phone size](https://images0.cnblogs.com/blog/130623/201407/300958470402077.png)