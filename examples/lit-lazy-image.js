import { LitElement, css, html } from 'lit';

const isIntersecting = ({ isIntersecting }) => isIntersecting;

class LitLazyImage extends LitElement {
  static get is() {
    return 'lit-lazy-image';
  }

  static get properties() {
    return {
      alt: { type: String },
      intersecting: { type: Boolean },
      src: { type: String },
      loaded: { type: Boolean, reflect: true },
    }
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
           alt="${this.alt}"
           .src="${this.intersecting ? this.src : undefined}"
           @load="${this.#onLoad}">
    `;
  }

  constructor() {
    super();
    /** @type{IntersectionObserver} */
    this.#io;
    /** Image URI. */
    this.src = '';
    /** Image alt-text. */
    this.alt = '';
    /** Whether the element is on screen. */
    this.intersecting = false;
    /** Whether the image has loaded. */
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Remove the wrapping `<lazy-image>` element from the a11y tree.
    this.setAttribute('role', 'presentation');
    // if IntersectionObserver is available, initialize it.
    this.#initIO();
  }

  /** Disconnects and unloads the IntersectionObserver. */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.#io.disconnect();
    this.#io = null;
    delete this.#io;
  }

  /**
   * Sets the `intersecting` property when the element is on screen.
   * @param  {IntersectionObserverEntry[]} entries
   */
  #observerCallback(entries) {
    if (entries.some(isIntersecting)) this.intersecting = true;
  }

  /** Sets the `loaded` property when the image is finished loading. */
  #onLoad(event) {
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

  /** Initializes the IntersectionObserver when the element instantiates. */
  #initIO() {
    // if IntersectionObserver is unavailable, simply load the image.
    if (!('IntersectionObserver' in window)) return this.intersecting = true;
    // Short-circuit if observer has already initialized.
    if (this.#io) return;
    // Start loading the image 10px before it appears on screen
    const rootMargin = '10px';
    this.#io =
      new IntersectionObserver(x => this.#observerCallback(x), { rootMargin });
    this.#io.observe(this);
  }
}

customElements.define(LitLazyImage.is, LitLazyImage);
