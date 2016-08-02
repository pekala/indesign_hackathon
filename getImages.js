'use strict';
const path = require('path');
const fs = require('fs-extra')
const deepcopy = require("deepcopy");

function copy_and_transform_image_file_paths(articles, base_path){
    var articles_copy = deepcopy(articles);
    for (var i = 0; i < articles_copy.length; i++) {
        for (var i_content = 0; i_content < articles_copy[i].content.length; i_content++) {
            if (articles_copy[i].content[i_content].type === 'image'){
                //console.log(articles_copy[i].content[i_content].path);
                // Hack!
                var source_file = articles_copy[i].content[i_content].path.replace(/:/g, '/').replace('Macintosh HD', '');
                //console.log(source_file);
                var destination_file = path.join(base_path, path.parse(source_file).base)
                //console.log(destination_file)
                fs.copySync(source_file, destination_file);
                // Update path
                articles_copy[i].content[i_content].path = destination_file
            }
        }
    }
    return articles_copy;
}

module.exports.copy_and_transform_image_file_paths = copy_and_transform_image_file_paths;
