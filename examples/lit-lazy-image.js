import { LitElement, css, html } from 'lit-element';

const isIntersecting = ({ isIntersecting }) => isIntersecting;

class LitLazyImage extends LitElement {
  static get is() {
    return 'lit-lazy-image';
  }

  static get styles() {
    return css`
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
    `;
  }

  render() {
    return html`
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
        reflect: true,
      },
    }
  }

  constructor() {
    super();
    this.observerCallback = this.observerCallback.bind(this);
    this.intersecting = false;
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Remove the wrapping `<lazy-image>` element from the a11y tree.
    this.setAttribute('role', 'presentation');
    // if IntersectionObserver is available, initialize it.
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
  onLoad(event) {
    this.loaded = true;
    // Dispatch and event that supports Polymer two-way binding.
    const bubbles = true;
    const composed = true;
    const detail = { value: true };
    this.dispatchEvent(new CustomEvent('loaded-changed', {
      bubbles,
      composed,
      detail
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

customElements.define(LitLazyImage.is, LitLazyImage);
