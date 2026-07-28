// image-slot.js — simplified vanilla-JS reimplementation of the original
// <image-slot> widget (see dc-runtime/image-slot.js for the full original
// doc comment). This version keeps only what the four apps actually use:
// click-to-browse or drag-and-drop an image, shown with object-fit: cover
// and the slot's rounding; an empty-state placeholder caption otherwise.
//
// Persistence: the dropped/picked image (as a data URL) is saved to
// localStorage keyed by the page's path plus the slot's `id` attribute, so
// it survives reloads on the same device. No pan/zoom/reframe, no
// Unsplash `src`/`credit` support — this app never sets those attributes.
//
// Attributes supported: id (required to persist), shape ('rect' | 'rounded'
// | 'circle' | 'pill', default 'rounded'), radius (px, default 12),
// placeholder (empty-state caption text).

class ImageSlot extends HTMLElement {
  connectedCallback() {
    if (!this.style.display) this.style.display = 'block';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.style.cursor = 'pointer';
    this.style.background = this.style.background || 'var(--color-neutral-200)';
    this.style.boxSizing = 'border-box';

    const shape = this.getAttribute('shape') || 'rounded';
    const radius = this.getAttribute('radius') || '12';
    if (shape === 'circle') this.style.borderRadius = '50%';
    else if (shape === 'pill') this.style.borderRadius = '999px';
    else if (shape === 'rect') this.style.borderRadius = '0';
    else this.style.borderRadius = radius + 'px';

    this._key = 'imgslot:' + location.pathname + ':' + (this.id || '');
    this._render();

    this._onClick = () => this._pick();
    this._onDragOver = (e) => { e.preventDefault(); this._setDragState(true); };
    this._onDragLeave = () => this._setDragState(false);
    this._onDrop = (e) => {
      e.preventDefault();
      this._setDragState(false);
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.indexOf('image/') === 0) this._readFile(file);
    };
    this.addEventListener('click', this._onClick);
    this.addEventListener('dragover', this._onDragOver);
    this.addEventListener('dragleave', this._onDragLeave);
    this.addEventListener('drop', this._onDrop);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('dragover', this._onDragOver);
    this.removeEventListener('dragleave', this._onDragLeave);
    this.removeEventListener('drop', this._onDrop);
  }

  _setDragState(on) {
    this.style.outline = on ? '2px dashed var(--color-accent)' : 'none';
    this.style.outlineOffset = on ? '-2px' : '0';
  }

  _pick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => { if (input.files && input.files[0]) this._readFile(input.files[0]); };
    input.click();
  }

  _readFile(file) {
    const reader = new FileReader();
    reader.onload = () => this._setImage(reader.result);
    reader.readAsDataURL(file);
  }

  _setImage(dataUrl) {
    try { localStorage.setItem(this._key, dataUrl); } catch (e) { /* storage unavailable — image just won't persist */ }
    this._render();
  }

  _render() {
    let dataUrl = null;
    try { dataUrl = localStorage.getItem(this._key); } catch (e) { /* ignore */ }
    this.innerHTML = '';
    if (dataUrl) {
      const img = document.createElement('img');
      img.src = dataUrl;
      img.alt = '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
      this.appendChild(img);
    } else {
      const placeholder = this.getAttribute('placeholder') || 'Drop an image';
      const cap = document.createElement('div');
      cap.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;' +
        'text-align:center;padding:14px;font-size:12px;line-height:1.4;opacity:.55;color:var(--color-text)';
      cap.textContent = placeholder;
      this.appendChild(cap);
    }
  }
}
customElements.define('image-slot', ImageSlot);
