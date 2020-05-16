import Filly from '../../Filly.js';

import template from './template.js';


class Pagination extends Filly {
  constructor(props) {
    super(props, template);
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