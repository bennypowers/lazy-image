[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@power-elements/lazy-image)
[![npm (scoped)](https://img.shields.io/npm/v/@cycle/core.svg)](https://www.npmjs.com/package/@power-elements/lazy-image)
[![Build Status](https://travis-ci.org/bennypowers/lazy-image.svg?branch=master)](https://travis-ci.org/bennypowers/lazy-image)
[![Contact me on Codementor](https://cdn.codementor.io/badges/contact_me_github.svg)](https://www.codementor.io/bennyp?utm_source=github&utm_medium=button&utm_term=bennyp&utm_campaign=github)

# <lazy-image\>

[Lazily load](https://web.dev/lazy-loading-images/) your images!

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

<!-- In a Module -->
<script type="module">
  import '/node_modules/@power-elements/lazy-image/lazy-image.js';
  // ...
</script>
```

## 💪 Use it!
```html
<lazy-image src="image.jpg" alt="Lazy Image">
  <svg slot="placeholder"><use xlink:href="#placeholder-svg"></use></svg>
</lazy-image>
```

The optional placeholder could be any element. Inline <abbr title="Scalable Vector Graphics">SVG</abbr>, Pure <abbr title="Cascading Style Sheets">CSS</abbr> graphics, or an `<img src="data:foo"/>` would work best.

## 💄 Style it!
You should give your `<lazy-image>` elements some specific dimensions, since it absolutely positions its shadow children. In most cases, you should set the wrapping element as well as the `--lazy-image-` custom properties to the known display dimensions of your image.

```html
<style>
html {
  --lazy-image-width: 640px;
  --lazy-image-height: 480px;
}

lazy-image {
  width: var(--lazy-image-width);
  height: var(--lazy-image-height);
}
</style>

<lazy-image src="https://fillmurray.com/640/480"></lazy-image>
```

`<lazy-image>` exposes a set of custom properties for your customizing delight:

Property|Purpose|Default
-----|-----|-----
`--lazy-image-width`|Width of the internal image and placeholder elements|100%
`--lazy-image-height`|Height of the internal image and placeholder elements|100%
`--lazy-image-fit`|[`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property of the internal image and placeholder elements|contain
`--lazy-image-fade-duration`|Duration of the fade in from the placeholder to the image. Set to 0 to disable fading.|0.3s
`--lazy-image-fade-easing`|[`ease`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function) property of the opacity transition for the image and placeholder|ease

### Browser support
`lazy-image` manages the loading of your images via an Intersection Observer. In browsers where an Intersection Observer is not present, your images will be loaded immediately much like standard `<img/>` elements. Conditionally delivering the [IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) along with your `lazy-image`s to your users will ensure that all users experience the benefits of loading images lazily. Stay lazy, friend!
