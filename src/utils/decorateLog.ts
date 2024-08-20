export function decorateLog() {
    var originalFunc = console.log;
    // var datetime = new Date();

    console.log = function(){
      originalFunc.apply(console, [`${(new Date()).toISOString()}#`].concat([].slice.call(arguments)))
    }
}
