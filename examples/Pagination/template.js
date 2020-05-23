const renderItem = (item, idx) => /*html*/`
  <div class="item">
    ${idx + 1}
  </div>
`

const template = (props) => {
  return /*html*/`
    <div class="root">
      ${props.children}
      ${Array(Number(props['page-count'])).fill().map(renderItem).join('')}
    </div>
  `;
}


export default template;