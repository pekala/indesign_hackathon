'use strict';

const articles = require('./articles.json');
const marked = require('marked');
const cmykRgb = require('cmyk-rgb');
const equals = require('shallow-equals');
const contrast = require('contrast');

const markdown = articles.map(article => {
    return article.content.map((content, index) => {
        if(content.type === 'text') {
            const text = content.textFrames.map(textFrame => {
                return textFrame.textStyleRanges
                .map(range => !!range.content.trim() ? range : range.content)
                .reduce((allRanges, currentRange) => {
                    if (typeof currentRange === 'string') {
                        allRanges[allRanges.length - 1].content += currentRange;
                        return allRanges;
                    }

                    const previous = Object.assign({}, allRanges[allRanges.length - 1], {
                        content: null,
                        fillColor: null,
                    });

                    const current = Object.assign({}, currentRange, {
                        content: null,
                        fillColor: null
                    });

                    if(equals(previous, current)) {
                        allRanges[allRanges.length - 1].content += currentRange.content;
                    } else {
                        allRanges.push(currentRange);
                    }
                    return allRanges;
                }, [])
                .map(style => {
                    let rgbColor;
                    if(style.fillColor.length === 4) {
                        rgbColor = cmykRgb(style.fillColor).join()
                    } else {
                        rgbColor = style.fillColor.join();
                    }
                    return `<div style="margin-bottom: 20px; color: rgb(${rgbColor === '255,255,255' ? '0,0,0' : rgbColor}); font-size: ${style.pointSize*1.5}pt; font-family: '${style.fontFamily}';">${style.content.replace('\r', ' ')}</div>`
                }).join('');
            }).join('\n\n');
            return `\n${text}\n`;
        } else if(content.type === 'image') {
            const path = '/' + content.path.split(':').slice(1).join('/');
            return `\n![](${path})\n`;
        }
    }).join('');
});

const html = `\
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
    ${marked(markdown.join('\n\n'))}
    </body>
</html>\
`;

console.log(html)
