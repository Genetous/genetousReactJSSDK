export const domain = process.env.REACT_APP_DOMAIN;
export const organization = {
    applicationId: process.env.REACT_APP_APPLICATION_ID,
    organizationId: process.env.REACT_APP_ORGANIZATION_ID,

}
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const services = {
    authservice: "authservice",
    dataservice: "dataservice",
    osservice: "osservice",

}
const uconfig = {
    onUploadProgress: progressEvent => console.log(progressEvent.loaded)
}
const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: "" },
    body: ""
};
const requestOptionsFile = {
    method: 'POST',
    headers: { Authorization: "" },
    body: null
};
export const Methods = {
    AddCollection: domain + services.dataservice + '/add/collection',
    AddUniqueCollection: domain + services.dataservice + "/add/unique/collection",
    IsUnique: domain + services.dataservice + "/check/unique",
    AddMultiCollection: domain + services.dataservice + '/add/multicollection',
    AddRelation: domain + services.dataservice + '/add/relation',
    UpdateCollection: domain + services.dataservice + '/update/collection',
    GetCollections: domain + services.dataservice + '/get/collections',
    GetRelations: domain + services.dataservice + '/get/relations',
    DeleteCollection: domain + services.dataservice + '/delete/collection',
    CreateSecureLink: domain + services.dataservice + "/create/slink",
    UpdateSecure: domain + services.dataservice + "/update/slink",

    VerifyToken: domain + services.authservice + '/verify',
    KillToken: domain + services.authservice + '/logout',
    CreateClient: domain + services.authservice + '/client',
    Auth: domain + services.authservice + '/auth',

    FileUpload: domain + services.osservice + '/upload',
    GetFileList: domain + services.osservice + '/list/objects',
    DeleteFiles: domain + services.osservice + '/delete'
};

async function setTokenToLocalStorage(token) {
    localStorage.setItem('token', token)
}

export var verifyToken = function () {
    return new Promise(async function (resolve, reject) {

        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            const responseCollection = await fetch(
                Methods.VerifyToken,
                {
                    method: 'GET',
                    headers: hd
                }
            )
            resolve(responseCollection.json());
        } catch (err) {
            reject(err)
        }
    });
}
export var killToken = function () {
    return new Promise(async function (resolve, reject) {

        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            hd.append('Authorization', tk)
            const responseCollection = await fetch(
                Methods.KillToken,
                {
                    method: 'POST',
                    headers: hd
                }
            )
            resolve(responseCollection.json());
        } catch (err) {
            reject(err)
        }
    });
}
export var login = function (loginModel, operationStep) {
    return new Promise(async function (resolve, reject) {
        try {
            if (operationStep == 0) {
                Object.keys(organization).forEach(function (key) {
                    if (key === "clientId") {
                        delete organization[key];
                    }
                });
            }
            requestOptions.body = JSON.stringify(organization)
            const responseClient = await fetch(Methods.CreateClient, requestOptions)
            var c = await responseClient.json()
            c.clientSecret = clientSecret
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(Methods.Auth, requestOptions)
            const a = await responseAuth.json()
            if (operationStep === 0) {
                var hd = new Headers();
                var tk = "Bearer " + a.token;
                hd.append('Authorization', tk)
                hd.append("Content-Type", "application/json");

                const responseCollection = await fetch(
                    Methods.GetCollections,
                    {
                        method: 'POST',
                        headers: hd,
                        body: JSON.stringify(loginModel)
                    }
                )
                console.log("aaa");
                const d = await responseCollection.json()
                organization.clientId = d.data[0]._id
                localStorage.setItem('role', d.data[0].content.role)
                await login(organization, 1).then(function (result) {
                    resolve(result);
                }, err => {
                    reject(err);
                });
            } else {
                setTokenToLocalStorage(a.token)
                localStorage.setItem('clientId', organization.clientId)
                localStorage.setItem('organizationId', organization.organizationId)
                localStorage.setItem('applicationId', organization.applicationId)
                resolve(a);
            }
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
export var getGuestToken = function () {
    return new Promise(async function (resolve, reject) {
        try {
            Object.keys(organization).forEach(function (key) {
                if (key === "clientId") {
                    delete organization[key];
                }
            });
            requestOptions.body = JSON.stringify(organization)
            const responseClient = await fetch(Methods.CreateClient, requestOptions)
            var c = await responseClient.json()
            c.clientSecret = clientSecret
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(Methods.Auth, requestOptions)
            const a = await responseAuth.json()
            setTokenToLocalStorage(a.token)
            resolve(a);
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
export var getGuestTokenReturnToken = function () {
    return new Promise(async function (resolve, reject) {
        try {
            Object.keys(organization).forEach(function (key) {
                if (key === "clientId") {
                    delete organization[key];
                }
            });
            requestOptions.body = JSON.stringify(organization)
            const responseClient = await fetch(Methods.CreateClient, requestOptions)
            var c = await responseClient.json()
            c.clientSecret = clientSecret
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(Methods.Auth, requestOptions)
            const a = await responseAuth.json()
            resolve(a.token);
        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}
export var postWithSavedToken = function (model, method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                    body: JSON.stringify(model)
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            if (rdata.status == 401) {
                rdata.message = "Unauthorized"
                reject(rdata);
            }
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var postWithNoToken = function (model, method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            hd.append("Content-Type", "application/json");
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                    body: JSON.stringify(model)
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var postwithAddToken = function (model, method, tk) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            hd.append('Authorization', tk)
            hd.append("Content-Type", "application/json");
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                    body: JSON.stringify(model)
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var fileUpload = function (file, method, config, random) {
    return new Promise(async function (resolve, reject) {
        try {
            var rdata = {
                status: -1,
                message: "",
            }
            try {
                var token = `Bearer ${localStorage.getItem('token')}`
                const data = new FormData()
                data.append('file', file)
                data.append('random', random)

                let request = new XMLHttpRequest();
                request.upload.addEventListener("progress", function (e) {
                    let percent_completed = (e.loaded / e.total) * 100;
                    config(Math.round(percent_completed))
                });
                request.addEventListener("loadend", () => {
                    if (request.readyState === 4 && request.status === 200) {
                        var data = JSON.parse(request.responseText);
                        resolve(data);
                    }
                    if (request.readyState === 4 && request.status !== 200) {
                        rdata.status = request.status;
                        try {
                            var d = JSON.parse(request.responseText);
                            if (rdata.status == 401) {
                                rdata.message = "Unauthorized"
                            } else if (rdata.status == 500) {
                                rdata.message = "Unexpected Error Occured!"
                            } else {
                                rdata.message = d.message
                            }
                        } catch (err) {
                            rdata.message = request.responseText;
                        }
                        reject(rdata)
                    }
                });

                request.open('POST', method);
                request.setRequestHeader('Authorization', token)
                request.send(data);
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var getWithSavedToken = function (method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            var tk = "";
            if (localStorage.getItem('token') != null && localStorage.getItem('token') != "") {
                tk = `Bearer ${localStorage.getItem('token')}`;
            } else {
                reject(401)
                return;
            }
            hd.append('Authorization', tk)
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'GET',
                    headers: hd,
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            if (rdata.status == 401) {
                rdata.message = "Unauthorized"
                reject(rdata);
            }
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var getWithNoToken = function (method) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'GET',
                    headers: hd
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
export var getwithAddToken = function (method, tk) {
    return new Promise(async function (resolve, reject) {
        try {
            var hd = new Headers();
            hd.append('Authorization', tk)
            var rdata = {
                status: -1,
                message: "",
            }
            const responseCollection = await fetch(
                method,
                {
                    method: 'POST',
                    headers: hd,
                }
            )
            var d = null
            rdata.status = responseCollection.status;
            try {
                d = await responseCollection.json()
                if (responseCollection.status != 200) {
                    if (responseCollection.status == 500) {
                        rdata.message = "Unexpected Error Occured!"
                    } else {
                        rdata.message = d.message
                    }
                    reject(rdata)
                } else {
                    resolve(d)
                }
            } catch (err) {
                rdata.message = err.message
                reject(rdata)
            }

        } catch (err) {
            reject(err)
        }
    });
}
