const renderItem = (item, idx) => /*html*/`
  <div class="item">
    ${idx + 1}
  </div>
`

const template = function() {
  return /*html*/`
    <div class="root">
      Pagination
      ${Array(Number(this.props['page-count'])).fill().map(renderItem)}
    </div>
  `;
}


export default template;