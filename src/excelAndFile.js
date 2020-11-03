const log4js = require('./middleware/logger')
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')
const xlsx = require('node-xlsx');
const fs = require('fs-extra');
const path = require('path');

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

            Array.isArray(excel) && excel.map((item, index) => {
                if (index > 0) {
                    let id = String(item[1]).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''),
                        input = path.join(this.inputUrl, 'Structure2D_CID_' + id + '.mol2'),
                        output = path.join(this.outputUrl, 'Structure2D_CID_' + id + '.mol2')
                    console.log(input, 'input');
                    if (fs.existsSync(input)) {
                        fs.copySync(input, output)
                        infolog.info('copy file to ' + 'Structure2D_CID_' + id + '.mol2' + ' success;')
                    } else {
                        errlog.error('文件不存在：', ' Structure2D_CID_' + id + '.mol2')
                    }
                }
            })
            infolog.info('init done!')
        } catch (error) {
            errlog.error('init出错：', error)
        }

    }

}

module.exports = excelAndFile;