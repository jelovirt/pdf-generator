import $ from 'jquery';
import _ from 'lodash';
import { Generator } from '../../generator';
import { Version } from '../../lib/version';
import FileSaver from 'file-saver';

export default function WizardController(store, pages) {
  pages.forEach((sections, i) => {
    let $root = $(`#p${i + 1}`);
    sections.forEach((section) => {
      $root.append(section.$element);
    });
  });

  $(':input').change(validatePage);
  $('form').submit(validateForm);

  // wizard pages
  $('.page')
    .each(function (i) {
      //$(this).attr("id", "p" + i)
    })
    .hide();
  $('.page:first').addClass('current').show();
  const prev = $(
    "<button type='button' class='btn btn-default' id='prev'>&lt; Previous</button>"
  ).click(prevHandler);
  const next = $(
    "<button type='button' class='btn btn-default' id='next'>Next &gt;</button>"
  ).click(nextHandler);
  $('#generate').before(prev).before(' ').before(next).before(' ');

  $('#generate').attr('type', 'button').click(generateHandler);

  // init
  validatePage();
  setInterval(checkFragment, 100);

  /** Current location fragment. */
  let hash = location.hash;

  function validateForm(event) {
    const target = event.target;
    for (let i = 0; i < target.elements.length; i++) {
      const elem = target.elements[i];
      if (elem.className === 'required' && !elem.disabled) {
        let value;
        switch (elem.nodeName.toLowerCase()) {
          case 'select':
            for (let k = 0; k < elem.options.length; k++) {
              if (elem.options[k].selected) {
                value = elem.options[k].value;
                break;
              }
            }
            break;
          default:
            value = elem.value;
        }
        if (value === '') {
          const label = getLabel(elem);
          window.alert(
            'Required field ' + label.toLowerCase() + ' has no value'
          );
          event.stopPropagation();
          event.preventDefault();
          return false;
        }
      }
    }
    return true;
  }

  function validatePage() {
    const elements = $('.current .required:enabled');
    let valid = true;
    if (
      elements.filter(':radio, :checkbox').length > 0 &&
      elements.filter(':checked').length === 0
    ) {
      valid = false;
    }
    if (
      elements.find('option').length > 0 &&
      elements.find('option:selected').length === 0
    ) {
      valid = false;
    }
    elements.filter(':text').each(function (i) {
      const elem = $(this);
      const value = elem.val();
      if (value === '') {
        valid = false;
      }
    });
    if (elements.filter('.invalid').length > 0) {
      valid = false;
    }

    if ($('.current').prevAll('.page:first').length === 0) {
      // first page
      $('#prev').attr('disabled', true);
    } else {
      $('#prev').removeAttr('disabled');
    }

    if ($('.current#p6').length !== 0) {
      // last page
      $('#next').attr('disabled', true);
      if (valid) {
        $('#generate').removeAttr('disabled');
      } else {
        $('#generate').attr('disabled', true);
      }
    } else if ($('.current').nextAll('.page:first').length === 0) {
      // download page
      $('#next').attr('disabled', true);
      $('#generate').attr('disabled', true);
    } else {
      if (valid) {
        $('#next').removeAttr('disabled');
      } else {
        $('#next').attr('disabled', true);
      }
      $('#generate').attr('disabled', true);
    }
    //alert(valid);
    return true;
  }

  function getLabel(elem) {
    return $('label[for=' + elem.name + ']:first').text();
  }

  function generateHandler(event) {
    const n = $('.current').nextAll('.page:not(.disabled):first');
    $('.current').removeClass('current').hide();
    n.addClass('current').show();
    validatePage();
    setFragment();
    $(':input[name=json]').val(JSON.stringify(store.getState()));
    // $('form#generate-plugin').submit();
    generate(store.getState());
  }

  function generate(conf) {
    const generator = new Generator();

    //validate
    if (!_.has(conf, 'ot_version')) {
      throw new Error('version missing');
    }
    generator.ot_version = new Version(conf['ot_version']);
    if (!_.has(conf, 'id')) {
      throw new Error('id missing');
    }
    if (_.has(conf, 'plugin_name')) {
      generator.plugin_name = conf['plugin_name'];
    } else {
      generator.plugin_name = conf['id'];
    }
    if (_.has(conf, 'plugin_version')) {
      generator.plugin_version = conf['plugin_version'];
    }
    generator.transtype = conf.transtype;

    const __config = conf.configuration;
    generator.page = __config.page;
    generator.style = __config.style;
    generator.force_page_count = __config['force_page_count'];
    generator.chapter_layout = __config['chapter_layout'];
    generator.bookmark_style = __config['bookmark_style'];
    generator.toc_maximum_level = __config['toc_maximum_level'];
    generator.task_label = __config['task_label'];
    generator.include_related_links = __config['include_related_links'];
    if (_.has(__config, 'body_column_count')) {
      generator.body_column_count = __config['body_column_count'];
    }
    if (_.has(__config, 'index_column_count')) {
      generator.index_column_count = __config['index_column_count'];
    }
    if (_.has(__config, 'column_gap')) {
      generator.column_gap = __config['column_gap'];
    }
    generator.mirror_page_margins = __config['mirror_page_margins'];
    //__dita_gen.dl = __config["dl"]
    generator.title_numbering = __config['title_numbering'];
    //__dita_gen.table_numbering = __config["table_numbering"]
    //__dita_gen.figure_numbering = __config["figure_numbering"]
    //__dita_gen.link_pagenumber = __config["link_pagenumber"]
    generator.table_continued = __config['table_continued'];
    generator.formatter = __config['formatter'];
    generator.override_shell = __config['override_shell'];
    //if ("cover_image" in self.request.arguments() && type(self.request.POST["cover_image"]) != unicode) {
    //  __dita_gen.cover_image = self.request.get("cover_image")
    //  __dita_gen.cover_image_name = self.request.POST["cover_image"].filename
    //}
    if (_.has(__config, 'cover_image_metadata')) {
      generator.cover_image_metadata = __config['cover_image_metadata'];
    }
    if (_.has(__config, 'cover_image_topic')) {
      generator.cover_image_topic = __config['cover_image_topic'];
    }
    generator.header = __config['header'];
    generator.footer = __config['footer'];
    if (_.has(__config, 'page_number')) {
      generator.page_number = __config['page_number'];
    }
    generator.options = {
      blank_pages: __config.blank_pages,
    };

    generator
      .generate_plugin()
      .then((zipData) => FileSaver.saveAs(zipData, `${conf.id}.zip`));
  }

  /**
   * Previous page button handler.
   */
  function prevHandler(event) {
    const p = $('.current').prevAll('.page:not(.disabled):first');
    $('.current').removeClass('current').hide();
    p.addClass('current').show();
    validatePage();
    setFragment();
  }

  /**
   * Next page button handler.
   */
  function nextHandler(event) {
    const n = $('.current').nextAll('.page:not(.disabled):first');
    $('.current').removeClass('current').hide();
    n.addClass('current').show();
    validatePage();
    setFragment();
  }

  /** Set location fragment to current page. */
  function setFragment(i) {
    location.hash = $('.current').attr('id');
  }

  /** Check if location fragment has changed and change page accordingly. */
  function checkFragment() {
    if (location.hash.substr(1) !== hash) {
      if (location.hash.substr(1) === '') {
        location.replace('#' + $('.page:first').attr('id'));
      }
      hash = location.hash.substr(1);
      $('.current').removeClass('current').hide();
      $('#' + hash)
        .addClass('current')
        .show();
      validatePage();
    }
  }
}
