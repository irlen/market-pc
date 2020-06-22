const ip_addr = document.location.hostname;

//const host  = 'http://10.0.0.100:8080/updis/'
const host  = 'http://'+ip_addr+':8080/netfirewall/public/'
//const host  = 'http://www.zgcydt.com:996/'

exports.host =  host
exports.singleHost = ip_addr
