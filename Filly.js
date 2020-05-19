class Filly extends HTMLElement {
  constructor(props, template) {
    super(props);
    this.props = Object.assign({}, props);

    this._handleGlobalStyles();
    this._handleAttributes();

    this.props.children = this.innerHTML;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.template = template;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log(attrName, oldVal, newVal);
    this.props[attrName] = newVal;
    this._updateRendering();
  }

  connectedCallback() {
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

  _updateRendering = () => {
    let template = this.template(this.props);
    
    this.shadow.innerHTML = template + Filly._globalStyles;
  }
}

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