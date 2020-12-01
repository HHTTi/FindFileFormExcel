const path = require('path');
const fs = require('fs-extra');
const log4js = require('./src/middleware/logger')

// const logger = log4js.getLogger()//根据需要获取logger
const errlog = log4js.getLogger('err')
const infolog = log4js.getLogger('info')

const config = require('./config')

const excelAndFile = require('./src/excelAndFile')
const excelAndFileSdf = require('./src/excelAndFile_sdf')
const excelAndDownloadFile = require('./src/excelAndDownloadFile')
const excelAddCid = require('./src/excelAddCid')
const excelAddCompoundName = require('./src/excelAddCompoundName')


var args = process.argv.splice(2)

if (args[0]) {
    switch (args[0]) {
        case 'excelAndFileFn':
            excelAndFileFn()
            break;
        case 'excelAndFileSdfFn':
            excelAndFileSdfFn()
            break;
        case 'excelAndDownloadFileFn':
            excelAndDownloadFileFn()
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

    let excleUrl = 'public/excel/化合物11.25.xlsx',
        inputUrl = 'public/input3/已处理配体',
        outputUrl = 'public/output5'
    if (!fs.existsSync(excleUrl)) {
        errlog.error('文件路径 ', excleUrl, ' 有误！')
        return;
    }

    let excel = new excelAndFile(excleUrl, inputUrl, outputUrl);
    excel.init()

}

function excelAndFileSdfFn() {

    let excleUrl = 'public/output6/化合物归类11_25.xlsx',
        inputUrl = 'public/output7',
        outputUrl = 'public/output7'
    if (!fs.existsSync(excleUrl)) {
        errlog.error('文件路径 ', excleUrl, ' 有误！')
        return;
    }

    let excel = new excelAndFileSdf(excleUrl, inputUrl, outputUrl);
    excel.init()

}

function excelAndDownloadFileFn() {

    let excleUrl = 'public/output6/化合物归类11_25.xlsx',
        outputUrl = 'public/output7'
    if (!fs.existsSync(excleUrl)) {
        errlog.error('文件路径 ', excleUrl, ' 有误！')
        return;
    }

    let excel = new excelAndDownloadFile(excleUrl, outputUrl);
    excel.init()

}