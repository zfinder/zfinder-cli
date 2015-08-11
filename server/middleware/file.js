/* jshint strict: false, undef: true, unused: true */
/* global require, module, __dirname */

var fs = require('fs');
var path = require('path'),
    join = path.join,
    relative = path.relative,
    resolve = path.resolve;
var url = require('url'),
    parseUrl = url.parse;
var pastry = require('pastry'),
    json = pastry.json;

var utils = require('../utils/middleware'),
    decodeUriStr = utils.decodeUriStr,
    extname = utils.extname,
    readFile = utils.readFile,
    genHTMLRes = utils.genHTMLRes,
    genTemplateRender = utils.genTemplateRender;

var nameByExt = {
    markdown: 'markdown',
    md: 'markdown'
};
var templateByName = {
    markdown: genTemplateRender(
        join(__dirname, '../template/file-markdown.html')
    )
};
//var tips = readFile(join(__dirname, '../../doc/markdown-previewer-tips.markdown'));

module.exports = function(options) {
    return function(req, res, next) {
        function serveFile(fullFilename, filename) {
            var ext = extname(filename);
            if (fs.existsSync(fullFilename)) {
                switch (nameByExt[ext]) {
                    case 'markdown':
                        genHTMLRes(
                            templateByName.markdown({
                                content: readFile(fullFilename),
                                //tips: tips,
                                options: options,
                                CONST_JSON: json.stringify(options),
                                filename: filename,
                            }, pastry, true),
                            res
                        );
                        break;
                    default:
                        next();
                        break;
                }
            } else {
                next();
            }
        }

        var urlInfo = parseUrl(req.url, true);
        var pathname = decodeUriStr(urlInfo.pathname); // !!!node.js should do this for us!!!
        var query = urlInfo.query;

        if (query && query.raw) { // expecting raw file content
            next();
        } else {
            if (pathname.indexOf(options.serverRoot) > -1) {
                pathname = pathname.replace(options.serverRoot, '');
                var serveRoot = resolve(__dirname, '../../');
                var fullServerRootPathname = join(serveRoot, pathname);
                serveFile(fullServerRootPathname, relative(serveRoot, fullServerRootPathname));
            } else {
                // serve server root files, too
                var root = options.root;
                var fullRootPathname = join(root, pathname);
                serveFile(fullRootPathname, relative(root, fullRootPathname));
            }
        }
    };
};

