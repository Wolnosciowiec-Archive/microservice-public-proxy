OSPath = require('path');
fs     = require('fs');
xml2js = require('xml2js');

class ConfigurationLoader {
    constructor() {
        this.config = [];
    }

    compile() {
        let files = this.scanDir('./config', '.xml');

        for (let file in files) {
            this.loadFile(files[file]);
        }
    }

    loadFile(path) {
        console.info('[ConfigurationLoader] Loading ' + path);

        let data   = fs.readFileSync(path, 'utf-8');
        let rThis  = this;
        let parser = new xml2js.Parser();

        parser.parseString(data, function (xmlParsingError, result) {
            rThis.config[path] = result;
        });
    }

    /**
     * @param {string} startPath
     * @param {string} filter
     * @returns {Array}
     */
    scanDir(startPath, filter){
        if (!fs.existsSync(startPath)){
            throw new ParseException('Cannot compile configuration, missing configuration directory');
        }

        let filePaths = [];

        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++){
            let filename=OSPath.join(startPath,files[i]);
            let stat = fs.lstatSync(filename);

            if (stat.isDirectory()){
                filePaths = filePaths.merge(this.scanDir(filename, filter)); //recurse
            }
            else if (filename.indexOf(filter) >= 0) {
                filePaths.push(filename);
            }
        }

        return filePaths;
    };
}

module.exports = ConfigurationLoader;
