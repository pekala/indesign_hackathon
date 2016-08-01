const articles = require('./articles.json');
const marked = require('marked');

const markdown = articles.map(article => {
    return article.content.map((content, index) => {
        if(content.type === 'text') {
            const text = content.textFrames.map(textFrame => textFrame.content.replace('\r\r', '\n\n').replace('\r', ' ')).join('\n\n');
            if(index === 0) {
                return `# ${text}\n`;
            }
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
