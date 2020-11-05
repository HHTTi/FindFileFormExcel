const path = require('path');
const fs = require('fs-extra');
const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const excelAndFile = require('./src/excelAndFile')

var args = process.argv.splice(2)

excelAndFileFn()

function excelAndFileFn() {

    let excleUrl = path.join(__dirname, args[0]),
        inputUrl = path.join(__dirname, args[1]),
        outputUrl = path.join(__dirname, args[2])
    if (!fs.existsSync(excleUrl)) {
        errlog.error('文件路径 ', excleUrl, ' 有误！')
        return;
    }

    let excel = new excelAndFile(excleUrl, inputUrl, outputUrl);
    excel.init()

}