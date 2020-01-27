class Filly extends HTMLElement {
  constructor(props) {
    super(props);
    this.props = Object.assign({}, props);

    for (var i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i]
      if (attr.value.startsWith('@')) {
        const val = attr.value.replace('@', '')
        this.props[attr.name] = this.constructor.byString(this.getRootNode().host, val)
      } else {
        this.props[attr.name] = attr.value;
      }
    }

    this.props.children = this.innerHTML;
  }

  connectedCallback() {
    var template = document.querySelector(this.template).cloneNode(true);
    var globals = document.querySelectorAll(this.constructor.defaults.globalCSS);
    if (globals.length > 0) {
      for (var i = 0; i < globals.length; i++) {
        template.content.prepend(globals[i].cloneNode(true));
      }
    };

    this.shadow = this.attachShadow({ mode: 'open' });
    this.template = template;
    this.isConnectionCompleted = true;
    this.render();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.props[attrName] = newVal;
    if (this.isConnectionCompleted) {
      this.render();
    }
  }

  render() {
    const html = this.template.innerHTML || '';
    var rendered = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, (a, b) => {
      const str = eval(b);
      return Array.isArray(str) ? str.join('') : str;
    }).replace(/\${(.*?)}/gm, (a, b) => {
      return eval(b);
    });
    this.shadow.innerHTML = rendered;
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
