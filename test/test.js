// polyfills required by exceljs
require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');


const crypto = require('crypto');
const ExcelJS = require('exceljs/dist/es5');
const fs = require('fs');

const getPasswordHash = async (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256')
}


const cryptPassword = async () => {
    const salt = crypto.randomBytes(16);
    let hash = await getPasswordHash('123', salt)
    console.log(hash, salt)
    let s_hash = hash.toString('base64')
    let s_salt = salt.toString('base64')

    console.log(s_hash, s_salt)

    let new_salt = Buffer.from(s_salt, 'base64')
    let new_hash = Buffer.from(s_hash, 'base64')

    
    let restored_hash = await getPasswordHash('123', new_salt)
    console.log(restored_hash, new_hash )

    console.log(crypto.timingSafeEqual(new_hash, restored_hash))

}

const main = async () => {  
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'God of CRM';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.views = [
        {
          x: 0, y: 0, width: 10000, height: 20000,
          firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ]
    const worksheet = workbook.addWorksheet('Excel form');
    worksheet.columns = [
        { header: 'testfsrdsfrd', key: 'test', width: 10, style: { font: { bold: true } } },
    ]
    workbook.xlsx.writeFile('Excel.xlsx')
}
main()