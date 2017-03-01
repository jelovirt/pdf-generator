import $ from 'jquery'
import templates from './templates.html'
import dragula from 'dragula'

export default function HeaderController() {
  const $scripts = $(templates())
  const $element = $scripts.filter('#header-footer')
  $('.header-footer')
    .first().before($element.html())
    .end().remove()

  const drake = dragula([document.querySelector('#header-source'),
    document.querySelector('#even-header'), document.querySelector('#odd-header'),
    document.querySelector('#even-footer'), document.querySelector('#odd-footer')
  ], {
    // copy: true,
    removeOnSpill: true,
    copy: (el, source) => source === document.getElementById('header-source'),
    accepts: (el, target) => target !== document.getElementById('header-source')
  })
  drake.on('drop', (label, target, source) => {
    if(label.classList.contains('label-editable')) {
      label.contentEditable = true
      label.innerText = '\u200B' // \u200B
      label.focus()
    }
  })
}