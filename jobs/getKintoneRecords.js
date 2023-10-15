'use strict';

const {KintoneRestAPIClient, KintoneRecordField} = require('@kintone/rest-api-client');

function getQRCodeUrl(url) {
  return `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=100x100`;
}

(async () => {
    try {
      // クライアントの作成
      const client = new KintoneRestAPIClient({
        // kintoneのデータ取得先を設定
        baseUrl: 'https://1lc011kswasj.cybozu.com',
        auth: {
          apiToken: process.env.KINTONE_API_TOKEN
        }
      });
  
      // リクエストパラメータの設定
      const APP_ID = 2;
      const query_string = 'ステータス="accepted" order by $id';
      const params = {
        app: APP_ID,
        fields:['$id', 'ステータス', 'title', 'URL', 'descriptions'],
        query: query_string
      };
      
        // レコードの取得
      const resp = await client.record.getRecords(params);
      console.log(resp.records);
      const LIST_PATH = './src/url_list.txt';

      // リスト追加先のファイル準備
      const fs = require('fs');
      if( fs.existsSync(LIST_PATH) === false ) {
        fs.open(LIST_PATH, 'w+', err => {
          console.log(err.message);
          return;
        });
      }

      const arrayOfLists = resp.records.map(
          record => {
            // 取得データ→JSON→オブジェクト
            const srcData = JSON.stringify(record);
            const jrec = JSON.parse(srcData);

            // 取得データを表示対象リストに追加する
            fs.appendFile(LIST_PATH, srcData, err => {
              if( err ){
                console.log(err.message);
              } else {
                console.log(`appendFile id=${jrec.$id.value}`);
              }
            }); 

            // 取得レコードのステータス更新
            client.record.updateRecordStatus( {action:'公開する', app:APP_ID, id:jrec.$id.value})
          });
 
    } catch (err) {
      console.log(err);
    }
  })();