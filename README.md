# Backend Zwallet With PostgreSQL

Cara instalasi sebagai berikut:

- Clone repository ini

```cli
git clone https://github.com/roufurrohim/zwallet-BE
```

- Instalasi depedensi :

```cli
npm install
```

## API DOCUMENTATION

**Standard Status Response**

| Status Code | Description                             |
| :---------- | :-------------------------------------- |
| 200         | `Get all success`                       |
| 201         | `Created data success`                  |
| 400         | `Error on client side (input false)`    |
| 404         | `Data not found`                        |
| 502         | `Invalid response from another request` |


**Standard API**

[click me](https://github.com/roufurrohim/zwallet-BE/blob/master/zwallet.postman_collection.json)


**.env example**
```
DB_USERNAME =
DB_PASSWORD =
JWT_SECRET =
DB_HOST
DB_NAME
```