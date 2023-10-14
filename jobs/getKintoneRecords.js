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
      const arrayOfLists = resp.records.map(
          record => {
            // 取得レコードのステータス更新
            client.record.updateRecord({
              params:{app: record.app, id: record.id, 
                record: {
                  'ステータス': {
                    'value': 'published'
                }}}
              });
          }
          )
 
    } catch (err) {
      console.log(err);
    }
  })();