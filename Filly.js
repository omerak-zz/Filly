class Filly extends HTMLElement {
  constructor(props) {
    super(props);
    this.props = Object.assign({}, props);
    this.useShadowDOM = true;

    this._handleGlobalStyles();
    this._handleAttributes();

    this.props.children = this.innerHTML;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.props[attrName] = newVal;
    if (this.useShadowDOM && this.shadow) {
      this._updateRendering();
    } else if (!this.useShadowDOM) {
      this._updateRendering();
    }
  }

  connectedCallback() {
    const styleStatuses = window.__FILLY_STYLES_STATUS;
    if (this.useShadowDOM && !this.shadow) {
      this.shadow = this.attachShadow({ mode: 'open' });
    } else if (!this.useShadowDOM && !styleStatuses[this.tagName]) {
      const style = this.getStyle();
      document.head.insertAdjacentHTML('beforeend', style);
      styleStatuses[this.tagName] = true;
    }
    this._updateRendering();
  }

  _handleGlobalStyles() {
    if (Filly._globalStyles === undefined) {
      Filly._globalStyles = '';
      const elems = document.querySelectorAll(this.constructor.defaults.globalCSS);
      if (elems.length > 0) {
        for (var i = 0; i < elems.length; i++) {
          Filly._globalStyles = Filly._globalStyles + elems[i].cloneNode(true).outerHTML;
        }
      };
    }
  }

  _handleAttributes() {
    for (let i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i]
      if (attr.name.startsWith('.')) {
        const name = attr.name.replace('.', '');
        this.props[name] = this.constructor.byString(this.getRootNode().host, attr.value)
      } else {
        this.props[attr.name] = attr.value;
      }
    }
  }

  getStyle() {
    const style = this.style ? this.style() : '';
    return `<style>${style}</style>`;
  }

  _updateRendering() {
    const template = this.template(this.props);
    if (this.useShadowDOM) {
      this.shadow.innerHTML = template + Filly._globalStyles + this.getStyle();
    } else {
      this.innerHTML = template;
    }
  }
}


window.__FILLY_STYLES_STATUS = {};

Filly.defaults = {
  globalCSS: '.filly-globals'
};

Filly.define = function(name) {
  window.customElements.define(name, this);
}

Filly.getter = function(key, value) {
  Object.defineProperty(this, key, { get: value });
};

Filly.setter = function(key, value) {
  Object.defineProperty(this, key, { set: value });
};

Filly.byString = function(o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1');
  s = s.replace(/^\./, '');
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}


export default Filly;