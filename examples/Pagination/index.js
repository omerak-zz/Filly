import Filly from '../../Filly.js';

import template from './template.js';

import style from './style.js';


class Pagination extends Filly {
  template = template;

  style = style;

  constructor(props) {
    super(props);
  }

  callback() {
    console.log('callback');
  }

  onClick(e, idx) {
    this.data.selecteds.push(idx); 
    this.render();
  }
}


Pagination.getter('observedAttributes', function() { return ['check'] })
Pagination.define('f-pagination');