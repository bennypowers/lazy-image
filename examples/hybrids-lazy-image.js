import { html, dispatch } from 'hybrids';

const style = html`
  <style>
    :host {
      display: block;
      position: relative;
    }

    #image,
    #placeholder ::slotted(*) {
      position: absolute;
      top: 0;
      left: 0;
      transition:
        opacity
        var(--lazy-image-fade-duration, 0.3s)
        var(--lazy-image-fade-easing, ease);
      object-fit: var(--lazy-image-fit, contain);
      width: var(--lazy-image-width, 100%);
      height: var(--lazy-image-height, 100%);
    }

    #placeholder ::slotted(*),
    #image.loaded {
      opacity: 1;
    }

    #image,
    #placeholder.loaded ::slotted(*) {
      opacity: 0;
    }
  </style>
`;

const constant = x => () => x;
const passThroughSetter = (_, v) => v;
const isIntersecting = ({ isIntersecting }) => isIntersecting;
const intersect = (options) => {
  if (!('IntersectionObserver' in window)) return constant(true);
  return {
    connect: (host, propName) => {
      const observerCallback = entries =>
        (host[propName] = entries.some(isIntersecting));
      const observer = new IntersectionObserver(observerCallback, options);
      const disconnect = () => observer.disconnect();
      observer.observe(host);
      return disconnect;
    }
  }
}

const bubbles = true;
const composed = true;
const detail = { value: true };
const onLoad = host => {
  host.loaded = true;
  // Dispatch an event that supports Polymer two-way binding.
  dispatch(host, 'loaded-changed', { bubbles, composed, detail })
};

const render = ({ alt, src, intersecting, loaded }) => html`
  ${style}
  <div id="placeholder"
      class="${{ loaded }}"
      aria-hidden="${String(!!intersecting)}">
    <slot name="placeholder"></slot>
  </div>

  <img id="image"
      class="${{ loaded }}"
      aria-hidden="${String(!intersecting)}"
      src="${intersecting ? src : undefined}"
      alt="${alt}"
      onload="${onLoad}"
    />
`;

export const LazyImage = {
  src: '',
  alt: '',
  loaded: false,
  intersecting: intersect({ rootMargin: '10px' }),
  render,
}
