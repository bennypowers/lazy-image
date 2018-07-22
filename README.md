[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@power-elements/lazy-image)
[![npm (scoped)](https://img.shields.io/npm/v/@cycle/core.svg)](https://www.npmjs.com/package/@power-elements/lazy-image)
[![Build Status](https://travis-ci.org/bennypowers/lazy-image.svg?branch=master)](https://travis-ci.org/bennypowers/lazy-image)

# <lazy-image\>


Lazily load your images

## 🚛 Get it!
```
npm -i -S @power-elements/lazy-image
```

## 📦 Load it!
```html
<!-- From CDN -->
<script async type="module" src="https://unpkg.com/@power-elements/lazy-image/lazy-image.js"></script>

<!-- From local installation -->
<script async type="module" src="/node_modules/@power-elements/lazy-image/lazy-image.js"></script>
```

## 💪 Use it!
```html
<lazy-image src="/image.jpg" alt="Lazy Image"></lazy-image>
```

### 'IntersectionObserver' in window
`lazy-image` manages the loading of your images via an Intersection Observer. In browsers where an Intersection Observer is not present, your images will be loaded immediately much like standard `<img/>` elements. Conditionally delivering the [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) along with your `lazy-image`s to your users will ensure that all users experience the benefits of loading images lazily. Stay lazy, friend!
