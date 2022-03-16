"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promise = exports.post = exports.organization = exports.login = exports.fileUpload = exports.fileDownload = exports.domain = exports.Methods = void 0;
exports.verify = verify;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.json.stringify.js");

const domain = process.env.domain;
exports.domain = domain;
const organization = {
  application_id: process.env.application_id,
  organization_id: process.env.organization_id
};
exports.organization = organization;
const uconfig = {
  onUploadProgress: progressEvent => console.log(progressEvent.loaded)
};
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: ""
  },
  body: ""
};
const requestOptionsFile = {
  method: 'POST',
  headers: {
    Authorization: ""
  },
  body: null
};
const Methods = {
  AddCollection: domain + ':5004/add/collection',
  AddUniqueCollection: domain + ':5004/add/unique/collection',
  AddMultiCollection: domain + ':5004/add/multicollection',
  AddRelation: domain + ':5004/add/relation',
  AddNestedRelation: domain + ':5004/add/nested_relation',
  UpdateCollection: domain + ':5004/update/collection',
  GetCollection: domain + ':5004/get/collection',
  GetCollections: domain + ':5004/get/collections',
  GetRelations: domain + ':5004/get/relations',
  RemoveRelation: domain + ':5004/remove/relation',
  DeleteRelation: domain + ':5004/delete/relation',
  DeleteCollection: domain + ':5004/delete/collection',
  SelectRelation: domain + ':5004/select/relation',
  Search: domain + ':5004/search',
  FileUpload: domain + ':5002/upload/file',
  DeleteFile: domain + ':5002/delete',
  GetFileList: domain + ':5002/get/list',
  StreamFileUpload: domain + ':5002/upload/videostream',
  DownloadFile: domain + ':5002/'
};
exports.Methods = Methods;

async function setTokenToLocalStorage(token) {
  localStorage.setItem('token', token);
}

async function verify() {
  try {
    requestOptions.headers.Authorization = "Bearer ".concat(localStorage.getItem('token'));
    const verifyd = await fetch(domain + ':5008/verify', requestOptions);
    const d = await verifyd.json();

    if ('success' in d) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
}

var promise = new Promise((resolve, reject) => {
  let name = 'Dave';

  if (name === 'Dave') {
    resolve("Promise resolved successfully");
  } else {
    reject(Error("Promise rejected"));
  }
});
exports.promise = promise;

var login = function login(loginModel, operationStep) {
  return new Promise(async function (resolve, reject) {
    try {
      requestOptions.body = JSON.stringify(organization);
      var hata = "";
      const responseClient = await fetch(domain + ':5008/client', requestOptions);
      const c = await responseClient.json();
      requestOptions.body = JSON.stringify(c);
      const responseAuth = await fetch(domain + ':5008/auth', requestOptions);
      const a = await responseAuth.json();

      if (operationStep === 0) {
        requestOptions.headers.Authorization = "Bearer ".concat(a.token);
        requestOptions.body = JSON.stringify(loginModel);
        const responseCollection = await fetch(domain + ':5004/get/collection', requestOptions);
        const d = await responseCollection.json();
        organization.client_id = d.id;
        localStorage.setItem('role', d.content.role);
        await login(organization, 1).then(function (result) {
          resolve(responseCollection.json());
        }, err => {
          reject(err);
        });
      } else {
        setTokenToLocalStorage(a.token);
        localStorage.setItem('client_id', organization.client_id);
        localStorage.setItem('organization_id', organization.organization_id);
        localStorage.setItem('application_id', organization.application_id);
        resolve(true);
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.login = login;

var post = function post(model, method) {
  return new Promise(async function (resolve, reject) {
    try {
      requestOptions.headers.Authorization = "Bearer ".concat(localStorage.getItem('token'));
      requestOptions.body = JSON.stringify(model);
      var rdata = null;
      const responseCollection = await fetch(method, requestOptions);
      var d = null;

      try {
        d = await responseCollection.json();
        resolve(d);
      } catch (err) {
        if (responseCollection.status === 200) {
          resolve("success");
        } else if (responseCollection.status === 400) {
          reject("Not Found");
        } else if (responseCollection.status === 403) {
          reject("Session Timeout");
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.post = post;

var fileUpload = function fileUpload(file, method, config) {
  return new Promise(async function (resolve, reject) {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('bucket', organization.application_id);
      requestOptionsFile.headers.Authorization = "Bearer ".concat(localStorage.getItem('token'));
      requestOptionsFile.body = data;
      const responseCollection = await fetch(method, requestOptionsFile);
      const d = await responseCollection.text();
      resolve(d);
    } catch (err) {
      reject(err);
    }
  });
};

exports.fileUpload = fileUpload;

var fileDownload = function fileDownload(file, method) {
  return new Promise(async function (resolve, reject) {
    try {
      requestOptionsFile.headers.Authorization = "Bearer ".concat(localStorage.getItem('token'));
      const responseCollection = await fetch(method + file, requestOptionsFile);
      resolve(responseCollection.data);
    } catch (err) {
      reject(err);
    }
  });
};

exports.fileDownload = fileDownload;