class Filly extends HTMLElement {
  static defaults = {
    globalCSS: '.filly-globals'
  }

  static unEntity(str) {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }

  data = {}

  constructor(props) {
    super(props);
    this.props = Object.assign({}, props);

    for (var i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i]
      this.props[attr.name] = attr.value;
    }

    this.props.children = this.innerHTML;
    this.data.children = this.props.children;
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
      // // other approach
      // var elems = this.shadow.querySelectorAll(`[${attrName}="${oldVal}"]`);
      // for (var i = 0; i < elems.length; i++) {
      //   elems[i].setAttribute(attrName, newVal);
      // }
      this.render();
    }
  }

  render() {
    const html = this.template.innerHTML || '';
    var rendered = html.replace(/\n/g, '').replace(/\{{{(.*?)}}}/gm, (a, b) => {
      return eval(this.constructor.unEntity(b)).join('');
    }).replace(/\{{(.*?)}}/gm, (a, b) => {
      return eval(this.constructor.unEntity(b));
    });
    console.log(rendered);
    rendered = rendered.replace(/<script\b[^>]*>(.*?)<\/script>/gm, (a, b) => {
      console.log(b);
      return eval(b).join('');
    })
    this.shadow.innerHTML = rendered;
  }
}