const template = function(props) {
  const renderItem = (item, idx) => /*html*/`
    <div class="item" onclick="this.getRootNode().host.onClick(event, ${idx})">
      ${idx + 1} ${this.data.activeIndex == idx ? 'active' : 'inactive'}
    </div>
  `

  return /*html*/`
    <div class="root">
      ${Array(Number(props['page-count'])).fill().map(renderItem).join('')}
    </div>
  `;
}


export default template;

// use this when shadow dom is inactive
// this.closest('f-pagination').onClick(event, ${idx})