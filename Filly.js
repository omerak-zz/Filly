class Filly extends HTMLElement {
  constructor(props, template) {
    super(props);
    this.props = Object.assign({}, props);

    for (var i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i]
      if (attr.name.startsWith('.')) {
        const name = attr.name.replace('.', '');
        this.props[name] = this.constructor.byString(this.getRootNode().host, attr.value)
      } else {
        this.props[attr.name] = attr.value;
      }
    }

    this.props.children = this.innerHTML;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.template = template;
    this.renderTemplate();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.props[attrName] = newVal;
    if (this.isConnectionCompleted) {
      this.renderTemplate();
    }
  }

  renderTemplate = () => {
    const globalStyles = document.querySelectorAll(this.constructor.defaults.globalCSS);
    let template = this.template.bind(this)();
    if (globalStyles.length > 0) {
      for (var i = 0; i < globalStyles.length; i++) {
        template = template + globalStyles[i].cloneNode(true).toString();
      }
    };
    this.isConnectionCompleted = true;
    this.shadow.innerHTML = template;
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