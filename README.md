
# API OVERVIEW 

提供API供後台呼叫

Provide API for BO

+ <a href="#1-get-member-profile-by-uuid">[1：查詢會員-基本資料]</a> - [BO-18/BO-12]
+ <a href="#2-upload-file">[2：上傳檔案]</a> - [提供後台CS上傳檔案]
+ <a href="#3-get-file">[3：取得檔案]</a> - [下載檔案使用]
+ <a href="#4-update-member-status">[4：會員-狀態調整]</a> - [BO-17/BO-185]
+ <a href="#5-get-member-status-history">[5：查詢會員-狀態異動紀錄]</a> - [BO-26]
+ <a href="#6-get-member-login-history">[6：查詢會員-登入資料]</a> - [BO-11]
+ <a href="#7-get-member-same-ip-history">[7：查詢會員-關聯資料]</a> - [BO-14]
+ <a href="#8">[8：查詢會員-風控條件]</a> - [BO-16]
+ <a href="#9">[9：查詢會員-交易資料]</a> - [BO-13]


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

# 會員

## 1. Get Member Profile By Uuid
> 後台人員查詢會員資料(不支援模糊查詢) [BO-18]

**HTTP Request** 

```
GET /{brand}/api/v1/member/profile/{uuid}
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
currencyCode                     | string        | 幣別代碼 CNY,..
roleCode                         | string        | 會員對應的角色, MVP目前規劃會員只有一種角色: 直客
phoneNumber                      | string        | 會員phone number 顯示後四碼，不能顯示全部
riskControllLevel                | string        | 風控等級[四種]: A,B,C,D,黑名單(W)
riskControllLevelCreateDate      | timestamp     | 風控等級上次更新時間
amount                           | decimal       | 錢包金額(不包含保險櫃金額) e.g. 12345678.1234
freezeAmount                     | decimal       | 遊戲凍結金額
securityBoxAmount                | decimal       | 保險箱金額
withdrawalLimitAmount            | decimal       | 提款限額
availableWithdrawalLimitAmount   | decimal       | 可提領金額
effectiveBetAmount               | decimal       | 有效流水
effectiveBetAmountCreateDate     | timestamp     | 有效流水上次更新時間
status                           | string        | 會員目前狀態[三種]: 正常, 不可登入(E2), 不可提現(E1)
isBigWin                         | boolean       | 會員是否中大獎
bigWinCreateDate                 | timestamp     | 會員上次中大獎時間
isSettled                        | boolean       | 會員注單是否結算完畢
settleStatus                     | string        | 注單結算狀態[兩種]正常/異常
```

## 2. Upload File
> 上傳檔案 [提供後台CS上傳檔案]

**HTTP Request** 

```
POST /{brand}/api/v1/file
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
fileSize                         | int           | bytes
```

## 3. Get File
> 3：取得檔案 [下載檔案使用]

**HTTP Request** 

```
GET /{brand}/api/v1/file/{fileId}
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
file                             | string        | 檔案base64
```


## 4. Update Member Status
> 調整會員狀態 [BO-17/BO-185]

**HTTP Request** 

```
POST /{brand}/api/v1/member/profile
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
action                           | string        | 設為 [三種]: 正常, 不可登入(E2), 不可提現(E1)
comment                          | string        | 備註
files                            | array         | 上傳檔案，檔案id陣列
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


## 5. Get Member Status History
> 查詢會員-狀態異動紀錄 [BO-26]

**HTTP Request** 

```
GET /{brand}/api/v1/member/status-history/{uuid}
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
action                           | string        | [三種]: 正常, 不可登入(E2), 不可提現(E1)
comment                          | string        | 備註
files                            | array         | 檔案陣列

Files Property                   | Value Type    | Description
-------------------------------- | ------------  |----------------------------------------------------
fileId                           | string        | 檔案流水編號
fileName                         | string        | 檔案名稱(含副檔名)
fileSize                         | int           | bytes
```


## 6. Get Member Login History
> 查詢會員-最近七天登入資料 [BO-11]

**HTTP Request** 

```
GET /{brand}/api/v1/member/login-history/{uuid}
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
-------------------------------- | ------------  |----------------------------
startDate                        | timestamp     | 起始時間
endDate                          | timestamp     | 結束時間
isSuccess                        | boolean       | 是否登入成功
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
iP                               | string        | IP Address
isSuccess                        | boolean       | 是否登入成功
loginType                        | string        | [兩種]: 手機/網頁
```


## 7. Get Member Same Ip History
> 查詢會員-上次登入相同Ip資料 [BO-14]
> 取得與此用戶上次登入相同IP，且在時間區間內登入的其他用戶登入資料

**HTTP Request** 

```
GET /{brand}/api/v1/member/same-ip-history/{uuid}
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
iP                               | string        | IP Address
isSuccess                        | boolean       | 是否登入成功
loginType                        | string        | [兩種]: 手機/網頁
roleCode                         | string        | 會員對應的角色, MVP目前規劃會員只有一種角色: 直客
```

## 8. Get Member Turnover
> 查詢會員-交易資料 [BO-13]
> 取得與此用戶流水相關資料

**HTTP Request** 

```
GET /{brand}/api/v1/member/turnover/{uuid}
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
sevenDayAccumulatedWithdrawalAmount | decimal       | 7日累積 - 充值
sevenDayAccumulatedDepositeAmount   | decimal       | 7日累積 - 提現
sevenDayAccumulatedTurnoverAmount   | decimal       | 7日累積 - 有效流水
```
