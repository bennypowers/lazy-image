const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const map = f => as => as.map(f)
const some = f => as => as.some(f)
const constant = x => () => x;
const when = (p, f) => x => p(x) ? f(x) : constant(x);
const isTruthy = p => !!p;

const anyIntersecting = compose(
  some(Boolean),
  map(({isIntersecting}) => isIntersecting)
)

const getBackgroundImageString = placeholder =>
  !placeholder ? 'none' : `url("${placeholder}")`;

/**
 * Initializes the template with this.alt and this.placeholder.
 * @param  {String} alt          image alt text
 * @param  {String} placeholder  placeholder image. preferable a datauri
 * @return {HTMLTemplateElement}
 */
const getTemplate = ({alt, placeholder}) => {
  const template = document.createElement('template')
  template.innerHTML = `
    <style>
    :host {
      display: block;
      width: 100%;
      background-image: ${getBackgroundImageString(placeholder)};
    }

    img {
      display: block;
      width: 100%;
      height: var(--lazy-image-img-height, auto);
      object-fit: var(--lazy-image-img-object-fit, contain);
      transition:
        opacity
        var(--lazy-image-fade-timing, 0.5s)
        var(--lazy-image-fade-easing, ease);
    }

    :host([fade]) img {
      opacity: 0;
    }

    img[intersecting] {
      opacity: 1;
    }
  </style>

  <img alt="${alt || ''}" src="${placeholder || ''}"/>`;

  return template;
}

/**
 * `<lazy-image>` loads an image lazily!
 *
 * ## Usage
 * ```html
 * <lazy-image fade src="/image.jpg" alt="Lazy Image"></lazy-image>
 * ```
 *
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--lazy-image-img-height` | applies to the height property of the img element | auto
 * `--lazy-image-img-object-fit` | applies to the object-fit property of the img element | contain
 * `--lazy-image-fade-timing` | applies to the `transition: opacity` property of the img element when `fade` is true. | 0.5s
 * `--lazy-image-fade-easing` | applies to the `transition: opacity` property of the img element when `fade` is true. | ease
 *
 * @customElement
 * @extends HTMLElement
 */
class LazyImage extends HTMLElement {
  /**
   * The internal img element
   * @type {HTMLImageElement}
   * @protected
   */
  get __img () {
    return this.shadowRoot.querySelector('img');
  }

  /**
   * Image alt text
   * @type {String}
   */
  get alt() {
    return this.getAttribute('alt');
  }

  set alt(alt) {
    alt ? this.setAttribute('alt', alt) : this.removeAttribute('alt');
    if (this.__img) this.__img.alt = alt;
  }

  /**
   * Whether the image should fade into view.
   * @type {Boolean}
   */
  get fade() {
    return this.hasAttribute('fade');
  }

  set fade(fade) {
    fade
      ? this.setAttribute('fade', '')
      : this.removeAttribute('fade')
  }

  /**
   * Whether the image has intersected with the page.
   * @type {Boolean}
   */
  get intersecting() {
    return this.__intersecting;
  }

  set intersecting(intersecting) {
    this.__intersecting = intersecting;
    if (!this.__img) return;
    if (intersecting) {
      this.__img.setAttribute('intersecting', ''),
      this.__img.src = this.src;
    } else this.__img.removeAttribute('intersecting')
  }

  /**
   * Placeholder image URI.
   * @type {String}
   */
  get placeholder() {
    return this.getAttribute('placeholder');
  }

  set placeholder(placeholder) {
    if (this.placeholder === placeholder) return;
    this.style.backgroundImage = getBackgroundImageString(placeholder);
    placeholder
      ? this.setAttribute('placeholder', placeholder)
      : this.removeAttribute('placeholder');
  }

  /**
   * Margin around the element within which the IntersectionObserver fires.
   * @type {String}
   */
  get rootMargin() {
    return (
      this.__rootMargin ||
      this.observer &&
      this.observer.rootMargin ||
      '0px 0px'
    );
  }


  set rootMargin(rootMargin) {
    this.__rootMargin = rootMargin;
    this.initIntersectionObserver(this);
  }

  /**
   * The image src.
   * @type {String}
   */
  get src() {
    return this.getAttribute('src')
  }

  set src(src) {
    src
      ? this.setAttribute('src', src)
      : this.removeAttribute('src');
    this.initIntersectionObserver(this);
  }

  /**
   * Percentage of image element pixels which must be present within root in order to intersect.
   * @type {Number}
   */
  get threshold() {
    return (
      this.__threshold ||
      this.observer &&
      this.observer.threshold ||
      0
    );
  }

  set threshold(threshold) {
    this.__threshold = threshold;
    this.initIntersectionObserver(this);
  }

  /** @protected */
  connectedCallback() {
    this.attachShadow({mode: 'open'})
      .appendChild(getTemplate(this).content.cloneNode(true));
    ('IntersectionObserver' in window)
      ? this.initIntersectionObserver(this)
      : this.setIntersecting(true)

    this.placeholder = this.getAttribute('placeholder')
  }

  /**
   * Sets `intersecting` property on the element, then unloads the observer.
   * @param  {Object} observerInit
   * @param  {HTMLElement} root
   * @param  {String} rootMargin
   * @param  {Number|Array<Number>} threshold
   * @return {IntersectionObserver}
   * @protected
   */
  initIntersectionObserver({ root, rootMargin, threshold }) {
    const callback = compose(
      when(isTruthy, this.disconnectObserver.bind(this)),
      this.setIntersecting.bind(this),
      anyIntersecting
    );

    this.observer =
      new IntersectionObserver(callback, {root, rootMargin, threshold});

    this.observer.observe(this);

    this.__rootMargin = undefined;
    this.__threshold = undefined;

    return this.observer;
  }

  /**
   * Sets the intersecting property
   * @param {Boolean} intersecting
   * @return {Boolean}
   * @protected
   */
  setIntersecting(intersecting) {
    this.intersecting = (intersecting || this.intersecting)
    return intersecting;
  }

  /**
   * Disconnects and Deletes the IntersectionObserver
   * @protected
   */
  disconnectObserver() {
    this.observer.disconnect();
    this.observer = null;
    delete this.observer;
  }
}

customElements.define('lazy-image', LazyImage);
