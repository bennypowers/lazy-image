import './lazy-image.js'

import { expect, fixture, aTimeout } from '@open-wc/testing';

// eslint-disable-next-line max-len
const src = 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7';

let element;

afterEach(function() {
  element = undefined;
})

describe('<lazy-image>', function() {
  beforeEach(async function() {
    element = await fixture('<lazy-image></lazy-image>');
  })
  it('has an img element in shadow root', function() {
    expect(element.shadowImage).to.be.an.instanceof(HTMLImageElement);
  });
  it('reflects src property', function() {
    element.src = 'foo'
    expect(element.getAttribute("src")).to.equal('foo')
  });
  it('has read only intercting prop', function() {
    const init = element.intersecting;
    element.intersecting = Math.random();
    expect(element.intersecting).to.equal(init);
  })
});

describe('<lazy-image alt="alt" placeholder="placeholder">', function() {
  beforeEach(async function() {
    element = await fixture('<lazy-image alt="alt"></lazy-image>');
  })
  it('returns alt dom property', function() {
    expect(element.alt).to.equal('alt')
  });
});

describe('<lazy-image src="url/to/img">', function() {
  if ("IntersectionObserver" in window) {
    describe('"IntersectionObserver" supported', function() {
      beforeEach(async function() { element = await fixture(`<lazy-image style="position: fixed; left: -10000px;" src="${src}"></lazy-image>`)});
      it('initializes an IntersectionObserver', function() {
        expect(element.observer).to.be.an.instanceof(IntersectionObserver);
      });

      it('does not set img src', function() {
        expect(element.shadowImage.src).to.not.be.ok;
      });

      it('does not set intersecting attr', async function() {
        expect(element.hasAttribute('intersecting')).to.be.false;
      });

      describe("when image scrolls into view", function() {
        beforeEach(async function() {
          element.style.left = '100px';
          await aTimeout(100);
        });

        it('Loads image', async function() {
          expect(element.shadowImage.src).to.equal(src);
        });

        it('sets intersecting attr', async function() {
          expect(element.hasAttribute('intersecting')).to.be.true;
        });
      })
    });
  } else {
    describe('"IntersectionObserver" not supported', function() {
      beforeEach(async function() { element = await fixture(`<lazy-image style="position: fixed; left: -10000px;" src="${src}"></lazy-image>`)});
      it('sets img src immediately', function() {
        expect(element.shadowImage.src).to.equal(src);
      });
    });
  }
});
