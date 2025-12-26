// src/libs/SplitText.ts

export interface SplitTextOptions {
  type?: 'chars';
  charsClass?: string;
  reduceWhiteSpace?: boolean;
  mask?: boolean;
  propIndex?: boolean;
}

export default class SplitText {
  chars: HTMLElement[] = [];
  originalHTML = '';

  constructor(element: HTMLElement, options: SplitTextOptions = {}) {
    if (!element) return;

    this.originalHTML = element.innerHTML;
    const text = element.innerText;

    element.innerHTML = '';

    const chars: HTMLElement[] = [];

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.classList.add(options.charsClass || 'char');

      if (options.propIndex) {
        span.dataset.index = index.toString();
      }

      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      element.appendChild(span);
      chars.push(span);
    });

    this.chars = chars;
  }

  revert() {
    const el = this.chars[0]?.parentElement;
    if (!el) return;

    el.innerHTML = this.originalHTML;
  }
}
