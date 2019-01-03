import { PolymerElement, html } from '@polymer/polymer';

const isIntersecting = ({ isIntersecting }) => isIntersecting;

class PolymerLazyImage extends PolymerElement {
  static get template() {
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

      <div id="placeholder" aria-hidden$="[[computePlaceholderAriaHidden(intersecting)]]">
        <slot name="placeholder"></slot>
      </div>

      <img id="image"
        aria-hidden$="[[computeImageAriaHidden(intersecting)]]"
        src="[[computeSrc(intersecting, src)]]"
        alt$="[[alt]]"
        on-load="onLoad"
      />
    `;
  }

  static get is() {
    return 'polymer-lazy-image';
  }

  static get properties() {
    return {
      /** Image alt-text. */
      alt: String,

      /** Whether the element is on screen. */
      intersecting: Boolean,

      /** Image URI. */
      src: String,

      /**
       * Whether the image has loaded.
       * @type {Boolean}
       */
      loaded: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },
    };
  }

  constructor() {
    super();
    this.observerCallback = this.observerCallback.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    // Remove the wrapping `<lazy-image>` element from the a11y tree.
    this.setAttribute('role', 'presentation');
    // if IntersectionObserver is available, initialize it.
    if ('IntersectionObserver' in window) this.initIntersectionObserver();
    // if IntersectionObserver is unavailable, simply load the image.
    else this.intersecting = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectObserver();
  }

  /**
   * Loads the img when IntersectionObserver fires.
   * @param  {Boolean} intersecting
   * @param  {String} src
   * @return {String}
   */
  computeSrc(intersecting, src) {
    return intersecting ? src : undefined;
  }

  /**
   * "true" when intersecting, "false" otherwise.
   * @protected
   */
  computePlaceholderAriaHidden(intersecting) {
    return String(intersecting);
  }

  /**
   * "false" when intersecting, "true" otherwise.
   * @protected
   */
  computeImageAriaHidden(intersecting) {
    return String(!intersecting);
  }

  /**
   * Sets the `loaded` property when the image is finished loading.
   * @protected
   */
  onLoad() {
    this.loaded = true;
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
   * Initializes the IntersectionObserver when the element instantiates.
   * @protected
   */
  initIntersectionObserver() {
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

customElements.define(PolymerLazyImage.is, PolymerLazyImage);
