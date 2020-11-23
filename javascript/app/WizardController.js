import $ from 'jquery';
import Generator from '../generator';
import FileSaver from 'file-saver';
import JSZip from 'jszip';

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
  // const next = $(
  //   "<button type='button' class='btn btn-default' id='next'>Next &gt;</button>"
  // ).click(nextHandler);
  $('#generate').before(prev).before(' ');
  //.before(next).before(' ');

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
      $('#prev').hide().prop('disabled', true);
    } else {
      $('#prev').show().prop('disabled', false);
    }

    if ($('#p1.current').length !== 0) {
      // last page
      // $('#next').prop('disabled', true);
      if (valid) {
        $('#generate').show().prop('disabled', false);
      } else {
        $('#generate').show().prop('disabled', true);
      }
    } else if ($('.current').nextAll('.page:first').length === 0) {
      // download page
      // $('#next').prop('disabled', true);
      $('#generate').hide().prop('disabled', true);
    } else {
      // if (valid) {
      //   $('#next').removeAttr('disabled');
      // } else {
      //   $('#next').prop('disabled', true);
      // }
      $('#generate').hide().prop('disabled', true);
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
    // $(':input[name=json]').val(JSON.stringify(store.getState()));
    // $('form#generate-plugin').submit();
    const generator = new Generator(store.getState());
    const zip = new JSZip();
    generator.generate_plugin(zip);
    zip
      .generateAsync({
        type: 'blob',
        platform: 'UNIX',
      })
      .then((zipData) =>
        FileSaver.saveAs(zipData, `${store.getState().id}.zip`)
      );
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

  // /**
  //  * Next page button handler.
  //  */
  // function nextHandler(event) {
  //   const n = $('.current').nextAll('.page:not(.disabled):first');
  //   $('.current').removeClass('current').hide();
  //   n.addClass('current').show();
  //   validatePage();
  //   setFragment();
  // }

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
