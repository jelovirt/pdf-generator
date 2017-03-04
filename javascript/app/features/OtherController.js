import $ from 'jquery'
import template from '../../lib/other.html'

export default function OtherHandler(model) {
  const $root = $('#p5')
  $root.append(template)

  $(':input[name=bookmark-style]').change((event) => {
    model.configuration.bookmark_style = $(event.target).val()
  }).change()
  $(':input[name=toc-maximum-level]').change((event) => {
    model.configuration.toc_maximum_level = Number($(event.target).val())
  }).change()
  $(':input[name=task-label]').change((event) => {
    model.configuration.task_label = $(event.target).is(':checked')
  }).change()
  $(':input[name=include-related-links]').change((event) => {
    model.configuration.include_related_links = $(event.target).val()
  }).change()
  $(':input[name=table-continued]').change((event) => {
    model.configuration.table_continued = $(event.target).is(':checked')
  }).change()
  $(':input[name=page-number]').change((event) => {
    model.configuration.page_number = $(event.target).val()
  }).change()
}
