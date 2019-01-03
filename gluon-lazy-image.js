import { GluonElement, html } from 'https://unpkg.com/@gluon/gluon/gluon.js?module';

const isIntersecting = ({ isIntersecting }) => isIntersecting;

class GluonLazyImage extends GluonElement {
  get template() {
    return html`
      <style>
        :host {
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
        :host([loaded]) #image {
          opacity: 1;
        }

        #image,
        :host([loaded]) #placeholder ::slotted(*) {
          opacity: 0;
        }
      </style>

      <div id="placeholder" aria-hidden="${String(!!this.intersecting)}">
        <slot name="placeholder"></slot>
      </div>

      <img id="image"
        aria-hidden="${String(!this.intersecting)}"
        .src="${this.intersecting ? this.src : undefined}"
        alt="${this.alt}"
        @load="${this.onLoad}"
      />
    `;
  }

  static get observedAttributes() {
    return ['alt', 'src'];
  }

  /**
   * Implement the vanilla `attributeChangedCallback`
   * to observe and sync attributes.
   */
  attributeChangedCallback(name, _oldVal, newVal) {
    switch (name) {
      case 'alt': return this.alt = newVal
      case 'src': return this.src = newVal
    }
  }

  /**
   * Whether the element is on screen.
   * Note how we coerce the value,
   * this is how you do typed properties with Gluon.
   * @type {Boolean}
   */
  get intersecting() {
    return !!this.__intersecting;
  }

  set intersecting(value) {
    this.__intersecting = !!value;
    this.render();
  }

  /**
   * Image alt-text.
   * @type {String}
   */
  get alt() {
    return this.getAttribute('alt');
  }

  set alt(value) {
    if (this.alt != value) this.setAttribute('alt', value);
    this.render();
  }

  /**
   * Image URI.
   * @type {String}
   */
  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    if (this.src != value) this.setAttribute('src', value);
    this.render();
  }

  /**
   * Whether the image has loaded.
   * @type {Boolean}
   */
  get loaded() {
    return this.hasAttribute('loaded');
  }

  set loaded(value) {
    value ? this.setAttribute('loaded', '') : this.removeAttribute('loaded');
    this.render();
  }

  constructor() {
    super();
    this.observerCallback = this.observerCallback.bind(this);
    this.intersecting = false;
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'presentation');
    this.initIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectObserver();
  }

  /**
   * Sets the `intersecting` property when the element is on screen.
   * @param  {[IntersectionObserverEntry]} entries
   * @protected
   */
  observerCallback(entries) {
    if (entries.some(isIntersecting)) this.intersecting = true;
  }

  /**
   * Sets the `loaded` property when the image is finished loading.
   * @protected
   */
  onLoad() {
    this.loaded = true;
    // Dispatch an event that supports Polymer two-way binding.
    this.dispatchEvent(new CustomEvent('loaded-changed', {
      bubbles: true,
      composed: true,
      detail: { value: true },
    }));
  }

  /**
   * Initializes the IntersectionObserver when the element instantiates.
   * @protected
   */
  initIntersectionObserver() {
    // if IntersectionObserver is unavailable, simply load the image.
    if (!('IntersectionObserver' in window)) return this.intersecting = true;
    // Short-circuit if observer has already initialized.
    if (this.observer) return;
    // Start loading the image 10px before it appears on screen
    const rootMargin = '10px';
    this.observer =
      new IntersectionObserver(this.observerCallback, { rootMargin });
    this.observer.observe(this);
  }

  /**
   * Disconnects and unloads the IntersectionObserver.
   * @protected
   */
  disconnectObserver() {
    this.observer.disconnect();
    this.observer = null;
    delete this.observer;
  }
}


customElements.define(GluonLazyImage.is, GluonLazyImage);
