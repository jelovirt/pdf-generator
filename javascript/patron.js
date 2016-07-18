requirejs.config({
  baseUrl: '/javascripts/lib',
  paths: {
    hb: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
    app: '../app',
    rx: '//cdnjs.cloudflare.com/ajax/libs/rxjs/4.0.7/rx.lite.min',
    handlebars: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min'
    //'handlebars.runtime': '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.runtime.amd'
  },
  //packages: [
  //  {
  //    name: 'handlebars',
  //    location: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.runtime.amd',
  //    main: './handlebars'
  //  }
  //]
});

requirejs(['app/mainPatron'])