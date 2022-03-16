![Genetous](logo.png "Genetous")

# **Genetous Android SDK**

**Genetous ReactJS SDK** is integrated with Genetous Low Code Platform.

**Genetous ReactJS SDK** allows you to exchange data with services without the need for another tool.

## **Genetous ReactJS SDK installation**

### **In terminal**

```js
npm i genetous_react
```

### **.env File in your project folder**

```js
REACT_APP_DOMAIN=your server ip
REACT_APP_APPLICATIONID=your applicationId
REACT_APP_ORGANIZATIONID=your organizationId
```

### **Usage sample**

```js
import {Methods,post} from "genetous_react"

await post(collection, Methods.{AddCollection}).then(function (result) {
   //result as JSON
}, err => {
   //error result
});
```

Contact us for issues with this SDK!

<http://www.genetous.com>

<info@genetous.com>

### All rights of this SDK reseverd to **Genetous BaaS Platform.**
