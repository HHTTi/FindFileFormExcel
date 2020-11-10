const path = require('path');
const fs = require('fs-extra');
const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const config = require('./config')

const excelAndFile = require('./src/excelAndFile')
const excelAddCid = require('./src/excelAddCid')
const excelAddCompoundName = require('./src/excelAddCompoundName')


var args = process.argv.splice(2)

if (args[0]) {
    switch (args[0]) {
        case 'excelAndFileFn':
            excelAndFileFn()
            break;
        case 'excelAddCidFn':
            excelAddCidFn()
            break;
        case 'excelAddCompoundNameFn':
            excelAddCompoundNameFn()
            break;
    }
}


function excelAddCompoundNameFn() {
    const { excelAddCompoundNameData } = config

    Array.isArray(excelAddCompoundNameData) && excelAddCompoundNameData.map(e => {
        const { excleUrl, inputUrl, outputUrl, name } = e;
        if (!fs.existsSync(excleUrl)) {
            errlog.error('文件路径 ', excleUrl, ' 有误！')
            return;
        }

        let excel = new excelAddCompoundName(excleUrl, inputUrl, outputUrl, name);
        excel.init()
    })
}

function excelAddCidFn() {
    const { excelAddCidData } = config

    Array.isArray(excelAddCidData) && excelAddCidData.map(e => {
        const { excleUrl, inputUrl, outputUrl, name, startId } = e;
        if (!fs.existsSync(excleUrl)) {
            errlog.error('文件路径 ', excleUrl, ' 有误！')
            return;
        }

        let excel = new excelAddCid(excleUrl, inputUrl, outputUrl, name, startId);
        excel.init()
    })
}


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