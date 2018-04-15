import { LitElement, html } from '/node_modules/@polymer/lit-element/lit-element.js';
import { compose, map, prop, some } from './lib.js';

/**
 * Lazy Image loads an image lazily!
 *
 * ## Usage
 * ```html
 * <lazy-image src="/image.jpg" alt="Lazy Image"></lazy-image>
 * ```
 */
class LazyImage extends LitElement {

  static get properties() {
    return {
      /** Alt value for image. */
      alt: String,

      /** Whether or not the image has intersected. */
      intersecting: Boolean,

      /** Placeholder image string. */
      placeholder: String,

      /** Margin into the image which determines when the IntersectionObserver fires. */
      rootMargin: String,

      /** img src */
      src: String,

      /** img src */
      fade: Boolean,

      /** Threshold at which to trigger intersection. */
      threshold: Number,
    };
  }

  constructor() {
    super();
    this.intersecting = false;
    this.threshold = this.threshold || 0;
  }

  connectedCallback() {
    super.connectedCallback();

    const {
      rootMargin,
      threshold
    } = this;

    const setIntersecting = b => (this.intersecting = b || this.intersecting, b);

    const unloadIfIntersecting = intersecting => {
      if (intersecting) this.observer = null;
    };

    this.observer = new IntersectionObserver(
      compose(
        unloadIfIntersecting,
        setIntersecting,
        some(identity),
        map(prop('isIntersecting'))
      ), { rootMargin, threshold }
    );

    this.observer
      .observe(this);
  }

  render({
    alt,
    fade,
    intersecting,
    placeholder,
    src,
  }) {
    return html `
      <style>
      :host {
        display: block;
        width: 100%;
      }

      img {
        display: block;
        width: 100%;
        height: var(--lazy-image-img-height, auto);
        object-fit: var(--lazy-image-img-object-fit, contain);
      }

      .fade {
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .intersecting {
        opacity: 1;
      }
    </style>

    <img alt$="${alt}"
        src$="${intersecting ? src : placeholder}"
        class$="${intersecting ? 'intersecting' : ''} ${fade ? 'fade' : ''}"/>`;
  }
}

customElements.define('lazy-image', LazyImage);
