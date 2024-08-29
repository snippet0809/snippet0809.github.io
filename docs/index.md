---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: 编程备忘录
hero:
  name: 编程备忘录
  text: 日复一日，必有精进
  tagline: 遇事不决，可问春风，春风不语，即随本心
  actions:
    - theme: brand # brand
      text: 编程
    - theme: alt
      text: ...

features:
  - title: Operating System
    details: Windows、Linux、MacOS...
  - title: Java
    details: Compile once, run anywhere
  - title: TypeScript
    details: TypeScript is JavaScript with syntax for types
    link: 
  - title: VueJs
    details: The Progressive JavaScript Framework
  - title: Python
    details: Life is short, use python
  - title: C++
    details: 
  - title: Android
    details:
  - title: OpenCV
    details:
---
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
