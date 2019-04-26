# API OVERVIEW 

提供API供後台呼叫

Provide API for BO

>權限
+ <a href="#1-get-member-menu">取得菜單</a>

>檔案管理
+ <a href="#1-upload-file">[上傳檔案]</a>
+ <a href="#2-get-file">[下載檔案]</a>

>功能
+ <a href="#會員"><strong><I>1. 會員</I></strong></a>
+ <a href="#1-get-member-profile-by-uuid">[基本資料]</a> - [BO-18/BO-12]
+ <a href="#2-update-member-status">[狀態調整]</a> - [BO-17/BO-185]
+ <a href="#3-get-member-status-history">[狀態異動紀錄]</a> - [BO-26]
+ <a href="#4-get-member-login-history">[登入資料]</a> - [BO-11]
+ <a href="#5-get-member-same-ip-history">[關聯資料]</a> - [BO-14]
+ <a href="#6-get-member-risk-controll">[風控條件]</a> - [BO-16]
+ <a href="#7-get-member-turnover">[交易資料]</a> - [BO-13]


## Common Object

**Error Response**
```
Property | Value Type | Description
---------|------------|-----------------------------------------------------------------
code     | integer    | Error code
message  | string     | A human-readable description of the status of this operation
traceId  | string     | Trace ID for logger debug
```
```
{
    "code" : xxxyyy,
    "message": "The access token could not be decrypted",
    "traceId": "H7mQAG32Fk6"
}
```

# 權限

## 1. Get Member Menu
> 取得客服後台菜單清單與權限，且每次換頁也會詢問

**HTTP Request** 

```
GET /{brand}/api/v1/menu
```

**Path Parameters**
```
Parameter     | Description
------------- | ----------------------------------------------------
partition     | Partition for brand, e.g. example-brand
```
**Request Header**
```
Parameter     | Description
------------- | --------------------------------------------------------
Authorization | access token: "token {accessToken}"
```
**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
If sussess return following data in Array

Property                         | Value Type    | Description
-------------------------------- | ------------  |--------------------------------------------------
menuPath                         | string        | 權限可取得的連結 類似 /account/transaction
```

# 檔案管理

## 1. Upload File
> 上傳檔案 [提供後台CS上傳檔案]

**HTTP Request** 

```
POST /{brand}/api/v1/files
```

**Path Parameters**
```
Parameter     | Description
------------- | --------
partition     | Partition for brand, e.g. example-brand
```
**Request Header**
```
Parameter     | Description
------------- | ------------
Authorization | access token: "token {accessToken}"
```

**Request Body**
```
Property                         | Value Type    | Description
-------------------------------- | ------------  |-------------------
file                             | string        | 檔案的base64
fileName                         | string        | 檔案名稱
```

**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
Property                         | Value Type    | Description
-------------------------------- | ------------  |-------------------
fileId                           | string        | 檔案流水編號
fileName                         | string        | 檔案名稱(含副檔名)
```

## 2. Get File
> 取得檔案 [下載檔案使用]

**HTTP Request** 

```
GET /{brand}/api/v1/files/{fileId}
```

**Path Parameters**
```
Parameter     | Description
------------- | -------------------------------------------------
partition     | Partition for brand, e.g. example-brand
fileId        | file id
```
**Request Header**
```
Parameter     | Description
------------- | --------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Response**
```
Code          | Description
------------- | ---------------------------------------------------
200           | OK 
```
**Response Body**
```
Property                         | Value Type    | Description
-------------------------------- | ------------  |----------------------
fileId                           | string        | 檔案流水編號
fileName                         | string        | 檔案名稱(含副檔名)
fileData                         | string        | 檔案base64
```

# 會員

## 1. Get Member Profile By Uuid
> 後台人員查詢會員資料(不支援模糊查詢) [BO-18]

**HTTP Request** 

```
GET /{brand}/api/v1/members/{uuid}/profile
```

**Path Parameters**
```
Parameter     | Description
------------- | ----------------------------------------------------
partition     | Partition for brand, e.g. example-brand
uuid          | uuid, e.g. a9bb60e4-4481-4c97-8cac-481ebba219da
```
**Request Header**
```
Parameter     | Description
------------- | --------------------------------------------------------
Authorization | access token: "token {accessToken}"
```
**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
Property                         | Value Type    | Description
-------------------------------- | ------------  |--------------------------------------------------
uuid                             | string        | Member uuid 用戶名稱
nickName                         | string        | Nickname 會員暱稱
createDate                       | timestamp     | Content timestamp 會員建立日期
currencyCode                     | string        | [一種]: 人民幣(CNY)
roleCode                         | string        | [一種]: 直客(Normal)
phoneNumber                      | string        | 會員phone number 顯示後四碼，不能顯示全部
riskControllLevel                | string        | 風控等級[五種]: A,B,C,D,黑名單(W)
riskControllLevelCreateDate      | timestamp     | 風控等級上次更新時間
amount                           | decimal       | 錢包金額(不包含保險櫃金額) e.g. 12345678.1234
freezeAmount                     | decimal       | 遊戲凍結金額
securityBoxAmount                | decimal       | 保險箱金額
withdrawalLimitAmount            | decimal       | 提款限額
availableWithdrawalLimitAmount   | decimal       | 可提領金額
turnoverAmount                   | decimal       | 有效流水
turnoverAmountCreateDate         | timestamp     | 有效流水上次更新時間
status                           | string        | 會員目前狀態[三種]: 正常(Normal), 不可登入(E2), 不可提現(E1)
isBigWin                         | boolean       | 會員是否中大獎
bigWinCreateDate                 | timestamp     | 會員上次中大獎時間
isSettled                        | boolean       | 會員注單是否結算完畢
settleStatus                     | string        | 注單結算狀態[兩種]正常(Normal)/異常(Abnormal) 
```



## 2. Update Member Status
> 調整會員狀態 [BO-17/BO-185]

**HTTP Request** 

```
POST /{brand}/api/v1/members/{uuid}/status

Note:
*狀態轉換前，必須做檢查*
Normal ←→ E1
Normal ←→ E2
*但不可以 E1 和 E2 兩者轉換
```

**Path Parameters**
```
Parameter     | Description
------------- | ----------------------------------------------------
partition     | Partition for brand, e.g. example-brand
```
**Request Header**
```
Parameter     | Description
------------- | --------------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Request Body**
```
Property                         | Value Type    | Description
-------------------------------- | ------------  |--------------------------------------------
uuid                             | string        | Member uuid 用戶名稱
action                           | string        | 設為 [三種]: 正常(Normal), 不可登入(E2), 不可提現(E1)
reason                           | string        | 備註
files                            | array<string> | 上傳檔案，檔案id陣列
```

**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
If successful, this method returns an empty response body, or returns an error property.
```


## 3. Get Member Status History
> 查詢會員-狀態異動紀錄 [BO-26]

**HTTP Request** 

```
GET /{brand}/api/v1/members/{uuid}/status-history
```

**Path Parameters**
```
Parameter     | Description
------------- | ----------------------------------------------------
partition     | Partition for brand, e.g. example-brand
uuid          | uuid, e.g. a9bb60e4-4481-4c97-8cac-481ebba219da
```
**Request Header**
```
Parameter     | Description
------------- | --------------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Response**
```
Code          | Description
------------- | ----------------------------------------------------
200           | OK 
```
**Response Body**
```
If sussess return following data in array
回傳的資料必須依照時間降序排列

Array Property                   | Value Type    | Description
-------------------------------- | ------------  |----------------------------------------------------
createDate                       | timestamp     | 建立日期
csId                             | string        | CS id
csName                           | string        | CS 名稱
action                           | string        | [三種]: 正常(Normal), 不可登入(E2), 不可提現(E1)
reason                           | string        | 備註
files                            | array<Files>  | 檔案陣列


Files Property                   | Value Type    | Description
-------------------------------- | ------------  |----------------------------------------------------
fileId                           | string        | 檔案流水編號
fileName                         | string        | 檔案名稱(含副檔名)
```


## 4. Get Member Login History
> 查詢會員-最近七天登入資料 [BO-11]

**HTTP Request** 

```
GET /{brand}/api/v1/members/{uuid}/login-history?startDate={startDate}&endDate={endDate}&isSuccess={isSuccess}
```

**Path Parameters**
```
Parameter     | Description
------------- | ------------------------------------------------------------
partition     | Partition for brand, e.g. example-brand
uuid          | uuid, e.g. a9bb60e4-4481-4c97-8cac-481ebba219da
```

**Query Parameters**
```
Parameter                        | Value Type    | Description
-------------------------------- | ------------  |----------------------------
startDate                        | timestamp     | 起始時間
endDate                          | timestamp     | 結束時間
isSuccess (optional)             | boolean       | 是否登入成功，如果有帶此參數，即表示需要過濾；反之不過濾
```

**Request Header**
```
Parameter     | Description
------------- | ----------------------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
If sussess return following data in array
回傳的資料必須依照時間降序排列


Array Property                   | Value Type    | Description
-------------------------------- | ------------  |-----------------
createDate                       | timestamp     | 登入時間
ip                               | string        | IP Address
isSuccess                        | boolean       | 是否登入成功
loginType                        | string        | [兩種]: 手機(Mobile)/網頁(Web)
```


## 5. Get Member Same Ip History
> 查詢會員-上次登入相同Ip資料 [BO-14]
> 取得與此用戶上次登入相同IP，且在時間區間內登入的其他用戶登入資料

**HTTP Request** 

```
GET /{brand}/api/v1/members/{uuid}/same-ip-history
```

**Path Parameters**
```
Parameter     | Description
------------- | ------------------------------------------------------------
partition     | Partition for brand, e.g. example-brand
uuid          | uuid, e.g. a9bb60e4-4481-4c97-8cac-481ebba219da
```
**Request Header**
```
Parameter     | Description
------------- | ----------------------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Request Body**
```
Property                         | Value Type    | Description
-------------------------------- | ------------  |-----------
startDate                        | timestamp     | 起始時間
endDate                          | timestamp     | 結束時間
```

**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
If sussess return following data in array
回傳的資料必須依照時間降序排列


Array Property                   | Value Type    | Description
-------------------------------- | ------------  |-------------------------------------------
uuid                             | string        | Member uuid 用戶名稱
createDate                       | timestamp     | 登入時間
ip                               | string        | IP Address
isSuccess                        | boolean       | 是否登入成功
loginType                        | string        | [兩種]: 手機(Mobile)/網頁(Web)
roleCode                         | string        | [一種]: 直客(Normal)
```

## 6. Get Member Risk Controll
> 查詢會員-風控條件 [BO-16]
> 取得與此用戶風控相關資料

**HTTP Request** 

```
GET /{brand}/api/v1/members/{uuid}/risk-controll
```

**Path Parameters**
```
Parameter     | Description
------------- | ------------------------------------------------------------
partition     | Partition for brand, e.g. example-brand
uuid          | uuid, e.g. a9bb60e4-4481-4c97-8cac-481ebba219da
```
**Request Header**
```
Parameter     | Description
------------- | ----------------------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
Property                            | Value Type     | Description
----------------------------------- | ---------------|-------------------------------------------
uuid                                | string         | Member uuid 用戶名稱
riskControlRule                     | RiskControlRule| 物件 RiskControlRule
depositeAmount                      | decimal        | 累積充值金額
depositeCount                       | integer        | 累積充值成功次數
dailyContributionAmount             | decimal        | 本日累積貢獻度
dailyDeposite                       | RuleCheck      | 物件 RuleCheck 會員有無違反提現風控條件 - 本日提款
dailyTurnover                       | RuleCheck      | 物件 RuleCheck 會員有無違反提現風控條件 - 本日有效流水
dailyContribution                   | RuleCheck      | 物件 RuleCheck 會員有無違反提現風控條件 - 本日貢獻度
sevenDaysContribution               | RuleCheck      | 物件 RuleCheck 會員有無違反提現風控條件 - 七日貢獻度
riskControlRuleDepositing           | RuleCheck      | 物件 RuleCheck 會員有無違反提現風控條件 - 申請提領中
riskControllLevelCreateDate         | timestamp      | 風控等級上次更新時間
riskControllLevelReason             | string         | 風控等級上次更新原因
riskControllLevelCreateUser         | timestamp      | [兩種] 風控等級上次更新系統(System)/人員代號(CS_09)
sevenDaysTurnoverRate               | decimal        | 會員7日存流比 e.g. 5.3



RuleCheck Property            | Value Type    | Description
----------------------------------- | ------------  |-------------------------------------------
amount                              | decimal       | 實際金額
isLegal                             | boolean       | 是否違反對應風控條件


RiskControlRule Property                   | Value Type    | Description
------------------------------------------ | ------------  |-------------------------------------------
riskControllLevel                          | decimal       | 風控等級[五種]: A,B,C,D,黑名單(W)
dailyDepositeAmount                        | decimal       | 風控條件 - 本日提款
dailyTurnoverAmount                        | decimal       | 風控條件 - 本日有效流水
dailyContributionAmount                    | decimal       | 風控條件 - 本日貢獻度
sevenDaysContributionAmount                | decimal       | 風控條件 - 七日貢獻度
depositingAmount                           | decimal       | 風控條件 - 申請提領中

```

## 7. Get Member Turnover
> 查詢會員-交易資料 [BO-13]
> 取得與此用戶流水相關資料

**HTTP Request** 

```
GET /{brand}/api/v1/members/{uuid}/turnover
```

**Path Parameters**
```
Parameter     | Description
------------- | ------------------------------------------------------------
partition     | Partition for brand, e.g. example-brand
uuid          | uuid, e.g. a9bb60e4-4481-4c97-8cac-481ebba219da
```
**Request Header**
```
Parameter     | Description
------------- | ----------------------------------------------------------------
Authorization | access token: "token {accessToken}"
```

**Response**
```
Code          | Description
------------- | --------
200           | OK 
```
**Response Body**
```
Property                            | Value Type    | Description
----------------------------------- | ------------  |-------------------------------------------
uuid                                | string        | Member uuid 用戶名稱
lastWithdrawnDate                   | timestamp     | 最新提現成功交易時間
lastdepositedDate                   | timestamp     | 最新充值成功交易時間
withdrawingAmount                   | decimal       | 審核中 - 充值 
depositingAmount                    | decimal       | 審核中 - 提現
dailyWithdrawalAmount               | decimal       | 本日累積 - 充值
dailyDepositeAmount                 | decimal       | 本日累積 - 提現
dailyTurnoverAmount                 | decimal       | 本日累積 - 有效流水
sevenDaysAccumulatedWithdrawalAmount| decimal       | 7日累積 - 充值
sevenDaysAccumulatedDepositeAmount  | decimal       | 7日累積 - 提現
sevenDaysAccumulatedTurnoverAmount  | decimal       | 7日累積 - 有效流水
```
