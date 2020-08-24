const modules = {}

let fs = require('fs');

let path = __dirname;
let self = __filename.substring(__dirname.length + 1)

let files = fs.readdirSync(path);
files.forEach(function(filename) {
    if(filename == self)
        return

    let pos = filename.lastIndexOf('.')
    if(pos == -1)
        return

    let filePrefix = filename.substr(0, pos);
    let filePostfix = filename.substr(pos + 1);
    if(filePrefix.length < 1 || filePostfix.length < 1 || filePostfix != 'js')
        return

    let mod = require(path + '/' + filePrefix);
    let name = mod.get_name()
    if(!name)
        return

    modules[name] = mod
        
});

module.exports = modules
