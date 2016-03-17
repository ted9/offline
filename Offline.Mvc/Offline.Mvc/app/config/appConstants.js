define(['config/routes/about'], function () {
    var config = {
        title: 'Offline',
        master: 'layout/index',
        apiUrl: window.Api_Url,
        sessionId: window.Session_Id,
        timeout: 60000,
        serviceUrl: 'service/api/offline/menu'
    }
    return config;
});