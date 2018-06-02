import {LitElement, html} from '../../@polymer/lit-element/lit-element.js';
import {compose, identity} from '../power-functions/combinators.js';
import {map, some} from '../power-functions/array.js';
import {prop} from '../power-functions/object.js';

const constant = (x) => () => x;
const when = (p, f) => (x) => p(x) ? f(x) : constant(x);
const isTrue = (p) => !!p;

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
      /** Margin around the element within which the IntersectionObserver fires. */
      rootMargin: String,
      /** img src */
      src: String,
      /** Whether or not the image should fade into view. */
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
    const {rootMargin, threshold} = this;
    const unload = () => this.observer = null;
    const setIntersecting = (b) =>
      (this.intersecting = (b || this.intersecting), b);

    // Sets `intersecting` property on the element, then unloads the observer.
    const callback = compose(
      when(isTrue, unload),
      setIntersecting,
      some(identity),
      map(prop('isIntersecting'))
    );

    this.observer = new IntersectionObserver(callback, {rootMargin, threshold});
    this.observer.observe(this);
  }

  _render({alt, fade, intersecting, placeholder, src}) {
    const url = intersecting ? src : placeholder;
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

      [fade] {
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      [intersecting] {
        opacity: 1;
      }
    </style>

    <img alt$="${alt}" intersecting?="${intersecting}" fade?="${fade}" src$="${url}"/>`;
  }
}

customElements.define('lazy-image', LazyImage);
