'use strict';

const {KintoneRestAPIClient, KintoneRecordField} = require('@kintone/rest-api-client');
const { RecordClient } = require('@kintone/rest-api-client/lib/src/client/RecordClient');


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
      const getparams = {
        app: APP_ID,
        fields:['$id', 'ステータス', 'title', 'URL', 'descriptions'],
        query: query_string
      };
      
  
      // レコードの取得
      const resp = await client.record.getRecords(getparams);
      console.log(resp.records);
    } catch (err) {
      console.log(err);
    }
  })();