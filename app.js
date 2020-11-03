const path = require('path');

const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const excelAndFile = require('./src/excelAndFile')

excelAndFileFn()

//Autodock Vina 打分排名前40%.xlsx
function excelAndFileFn() {

    let excleUrl = 'public/excel/Autodock Vina 打分排名前40%.xlsx',
        inputUrl = 'public/input',
        outputUrl = 'public/output'

    let excel = new excelAndFile(excleUrl, inputUrl, outputUrl);
    excel.init()

}