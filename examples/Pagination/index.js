import Filly from '../../Filly.js';

import template from './template.js';

import style from './style.js';


class Pagination extends Filly {
  template = template;

  style = style;

  constructor(props) {
    super(props);

    this.data = {
      activeIndex: 0
    }
  }

  callback() {
    console.log('callback');
  }

  onClick(e, idx) {
    this.setData({ activeIndex: idx });
  }
}


Pagination.getter('observedAttributes', function() { return ['check'] })
Pagination.define('f-pagination');