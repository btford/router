var Q = require('q');
var markdownize = require('../services/markdown');

module.exports = function renderMarkdownProcessor() {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $process: function(docs) {
      return Q.all(docs.map(function(doc) {
        if (doc.docType !== 'markdownFile') {
          return doc;
        }
        return Q.nfcall(markdownize, doc.fileInfo.content).then(function (rendered) {
          return {
            fileInfo: doc.fileInfo,
            name: getTitle(doc.fileInfo.content),
            summary: getDescription(doc.fileInfo.content),
            renderedContent: rendered,
            docType: 'markdown'
          };
        });
      }));
    }
  };
};

var TITLE = /#[ ]?(.+)/;
function getTitle(md) {
  return md.match(TITLE)[1];
}

function getDescription(md) {
  var first = '';
  md.split('\n').some(function (line) {
    return line.trim().length > 0 && line[0] !== '#' && (first = line);
  });
  return first;
}
