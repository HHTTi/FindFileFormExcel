const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const fs = require('fs-extra');

class excelAndFile {
    constructor(excleUrl, inputUrl, outputUrl) {
        this.excleUrl = excleUrl;
        this.inputUrl = inputUrl;
        this.outputUrl = outputUrl;
    }

    init() {
        try {
            var excel = xlsx.parse(`${this.excleUrl}`)[0].data;

            fs.ensureDirSync(this.outputUrl);

            Array.isArray(excel) && excel.map((item,index) =>{
                if(index > 0) {
                    let id = item[1],
                    input = path.join(this.inputUrl,'Structure2D_CID_' + id +'.mol2')

                    fs.copySync(input,this.outputUrl)
                    infolog.infolog('copy file to' + input + ' success;')

                }
            })
            infolog.infolog('init done!')
        } catch (error) {
            errlog.errlog('init出错：',errlog)
        }

    }

}

module.exports = excelAndFile;