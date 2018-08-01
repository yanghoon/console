const express = require("express");
const os = require("os");
const app = express();



var fs = require('fs')
var K8s = require('k8s')
/*
var kubeapi = K8s.api({
    endpoint: "https://169.56.69.242:23078",
    version: '/api/v1',
    auth: {
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ6Y3Atc3lzdGVtIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InpjcC1hZG1pbi0wMS10b2tlbi05cWNmYyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJ6Y3AtYWRtaW4tMDEiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI1MzViYmVjNy01ZTZmLTExZTgtYjc2YS0zNmI4ZTI4OTZjYzQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6emNwLXN5c3RlbTp6Y3AtYWRtaW4tMDEifQ.kYkPQoYhkWWRVfDQYp8-AhC513j_xImYF9BtZrv9UiU-VqiZQg8Gg0MEPLdMY35ivMIKpKeuKrQummvGS5G3mnY5PW5NNHQ5_KfWokFmrSysi2ogKYoFmQgmwcK0Vmh0tJlSAp4v5z_r01xb0ZaqOe_RKn957aAS4shDrP_L9Q3YgCcooUpqCpjQX6WWDyfleLnQZbOZ-td__NSkvfxAjaxLTZY7ygaIdTdaF4KiM06S2RrUVMBXJdYiIPj2Fl2pGV0s8fqSuKa5-1b33MtvWSnpAgxbGsrM9YhmEN_ZS6aC8XVH08TakAv1vHID1FjoLcMbeqLyfwpHzjl3tWxb05QZN2Vzg5kwJQQix1jrajsqErXClEXUefA7F8ysU_gAdFes1f7mFE7HKRdNZf3qQPdQkhDT_PZxrER4SqLBUX8wyLZf7oAPUk9Csff67ig8-ibO0cb584e82fb6DGu2q5BWrQukOjmWvIjMRjc3FaOf0JlkB_DFVsLqxD-X42tcok2IbnlSJvVo_fLHcQxXAhAWo4q5WiM3nmqyIlaMNJO_Ryb6sI4IjIEx4Jufg7ZeUFTPTm5TUk3gsaiXVG7OMA7wx_BVzmCuGwCFZBcdLaw3dvqkCIg5Iq4-OZbvBeZn3j9inEWHKirxlYZw3fWkOpyDkNebTxlGl5yKNbf_97g"
    },
    auth2: {
      "clientKey": `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEArVgxG1IB/HOF0oGLEiDGtMzAw41JmjK1zmtinkGUD5U6WpL8
D7NvEgBrZxUzENsoPJkmJZOrI3JFKMzdVGc2E8atimc78qDitn7iozne1DHN/3vg
Kn3rImc2vwSITflim+iJGpQNrodseXJItj3U0thsnExThgCCMzZUQa6eDqK/YJyb
ZA5P1JTzbrgB2rwZjn8T7udaJVuumnY942fSHRFn2NTDbpj9iPxDHCkI/WMtK2Kg
1ByYIir8JWko7v0ScAsqIu6R9SJm+gRxu6REBdaFhPLi9kcZkzadqhWOxeAqi7Xh
u17dAP20UrTxfqt9w0ia4JYNjmOMVZV4goYhqQIDAQABAoIBAFgN46wYJXAjEsiT
C50izy2KkSUFAW118wqvXAI+F8Mur9zQq4AiSvqfAe/0QeN/IFpgBZOzBo1T/7Ox
FYFJiJvVIdSbikU+2suPevsla37o6datC3sqSaZJPfMcj0zksOW34uWAbc7Jdh3f
IvaIRDLyw4FF+GuqmHkBUR2oYRvXVBrfxq1Q/02sLjQLmPNX1nevYWNBnQTHoLwD
6AqacYr+64u9LHmOOvuYbH2esqxwRhtfO3xyIMB4ctm0B6AYvppgV3tgcn6rdrU0
TRpsWWHZXQRtm0toLaEyGWuK4mKK3FhgOWbS7h/9gX1p2XiPd8mTM7XfsiLTJFYI
FvlhijECgYEA3D5cUkcY9JPPPCkFwN5k3/nUethY7j8z6vBfFc4pW2exFeSji6mo
eXUKX3iL7/c2YDjakVCD2EO7XVeXt2QwbNwkRw3ZTOUF6ZL4n0bHVKbDDYgPdASz
9WSyaHFwtl8+T7uXxtRLnlie0Y1LFC7gHPttEseJVpPAq4mNzIF7EE0CgYEAyXyj
Nc+j7Lz9NMpifuGPE8AxD4lPikc9yKpeu4PTqM/HgzuGUZ/Wsn6jIz2nUqhqAcVn
w8HHcqqurn9kIYd5ffGaJO6WsnzGk66tIMF88fgQ3t7ule4/yLONLVeN8CTEe4zh
sDTudwooE8FteM2lR8ALeaIAU5O+uq1v0nEMZM0CgYEAinMxOg+zolwglCL9mOa0
5w94ANlr3ikhC/ma7GwzF2Cxs5+NJ8i5PdDTenyfC3SOXCKhU2QX3aWGbQEZQJHc
1zH0JC6SgYIfG1vmqsmlmJNUXnc/r6EdN4/bj0hwoFRzKVA18ymVd68h930oy0FE
ZTOwt3Nz5FbxcWQBHaPvpqkCgYB7tSjIKzqsacTVGsWqvXaJW+FDdrz9W4xVnjUX
0HKuHRSUQIHRr9+0LAih5ILNP1YGzFtPV7TLdHxX6yNharpvV12a+1pPMEkD96WY
jPPX5MUG8b1vFJ7Y7VTq1+zv2sNAUFlpRLZ9JCFDL+m02B54lTL2dT7aEcZy+3XC
sWI4qQKBgAXiFjbEvvoarqmjpqLuiQSjRJ1EKQ8L2lbjbtuANVL0K5jN6ZpBV+Om
Hfkkv4xsjMtfG5VLncoyncaxm1Lo7WIURU6FpnPV1B+sUEQ2/xQWtv7sUHpCnJH7
USyMXhT5gizAaiWNlO1Vs5KCSKlpBczuns/OcQ0Xij8q6CuELn3r
-----END RSA PRIVATE KEY-----
`,
      "clientCert": `
-----BEGIN CERTIFICATE-----
MIIDADCCAeigAwIBAgIBAjANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwptaW5p
a3ViZUNBMB4XDTE4MDcyMzA3MjQwNFoXDTE5MDcyNDA3MjQwNFowMTEXMBUGA1UE
ChMOc3lzdGVtOm1hc3RlcnMxFjAUBgNVBAMTDW1pbmlrdWJlLXVzZXIwggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCtWDEbUgH8c4XSgYsSIMa0zMDDjUma
MrXOa2KeQZQPlTpakvwPs28SAGtnFTMQ2yg8mSYlk6sjckUozN1UZzYTxq2KZzvy
oOK2fuKjOd7UMc3/e+AqfesiZza/BIhN+WKb6IkalA2uh2x5cki2PdTS2GycTFOG
AIIzNlRBrp4Oor9gnJtkDk/UlPNuuAHavBmOfxPu51olW66adj3jZ9IdEWfY1MNu
mP2I/EMcKQj9Yy0rYqDUHJgiKvwlaSju/RJwCyoi7pH1Imb6BHG7pEQF1oWE8uL2
RxmTNp2qFY7F4CqLteG7Xt0A/bRStPF+q33DSJrglg2OY4xVlXiChiGpAgMBAAGj
PzA9MA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUH
AwIwDAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAQEAjKc7k8IFr/FhvQuC
tZKP4QjW92hHg5TKvJYx68HqIkqZo43ETokZozvT6z9ij5UnIjb68HUcXOnJj3+4
ENwdKuSJM/gLw3iTRTg1A4ZCosNf2b0fuUE/inZBq8X7zDTE9FUuoYsyEu9j4VDO
XQzLL0IGKifM9d4jmvR0jwxOgomSbvcgFVWea/hbbGjKYgD0qr7JmBkkeB6XgElu
HZ3TwpcFCRh1p9B1lu2HabcXOCnjLj9OZRAox/5YZaeX05iH5be9EWcXrZXJG6iK
7rXHqHFGmDkUARMeK3/Fc8vgsXzmWTWCsHfPqVBohruLMO1OJkEyR90G3QM+sbpG
2cF0Bw==
-----END CERTIFICATE-----
`,
      "caCert": `
-----BEGIN CERTIFICATE-----
MIIC5zCCAc+gAwIBAgIBATANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwptaW5p
a3ViZUNBMB4XDTE4MDcxOTAyMTIxMVoXDTI4MDcxNzAyMTIxMVowFTETMBEGA1UE
AxMKbWluaWt1YmVDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMmI
gZFamgJTHdBiiv/j7Gqaff5o2G7qQNJ6bp/mRISmFz3jLA36LUjX+T+3tpIBwbXf
YkjSOKdwTvUrOowfVrbR8NjraVFbQRXp9JOUz3ycix2u9Wn1asXNkJEAiR3rZjHM
Dji+QxnAKw3bDdyS+j3pEiqRPLSpJNjozdJZPFbYzG60x5rh9otXHFeFUaSuoBCq
xOEsBQeRM5jGi3Yn2/n/CNXb9iGMVtJ0Hhq9bMKE7g3Yr2afsCgMvs6HqTO8FnRP
921ZJSimJjRp5yPhfHFY4pDlKX+Aa2z9yWPuA65VFLNMjgVF/Dhq/+xdIR7UBchV
9NhDatJumpYtMaTYa0sCAwEAAaNCMEAwDgYDVR0PAQH/BAQDAgKkMB0GA1UdJQQW
MBQGCCsGAQUFBwMCBggrBgEFBQcDATAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3
DQEBCwUAA4IBAQBmCbLu6DjrZQd6gmAvQ81+OC85Khslx2p2d9/RgV1R8T5dSJpZ
i1qbfo76wiEQSWwuAz3pSCztuJ9OqB9mMi4qbbHbEDrTmFdOQBXmzzZ4zioEvp2k
JXeaabgPD+5lf9gE/yN0iF0N7L/yIJu1XHk31c3KuKq0S0tUaKYadcgtHbtLxy2n
AX29dpagLXXGeDNgmdvlheNnekx0GR/Kqvd+o9a1koiN7CzKiS+aWTiVQV3CeIxw
UGE7zgJPKSuSALrWZREQdaI+Wmcp38aIrpEbZCCgeQhG3KPAV1WcFqQ2OLuWkN4R
dwKHcXdK93R9tjQAJVZ/8K/XUAotldTKd/El
-----END CERTIFICATE-----
`
    }
})

kubeapi
  .get('namespaces/default/replicationcontrollers')
  .then(function(data){
    console.log(data)
  })
*/

var kubectl = K8s.kubectl({
    binary: 'kubectl'
})

app.use(express.static("dist"));
app.get("/api/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username, xxx: 111 })
)

app.get("/api/:resource", (req, res) => {
  var kind = kubectl[req.params.resource]
  if(!kind){
  	//ERR!!
  	console.log(req.params)
  	res.send({err:"There is no Kubernetes resource."})
  }

  kind.list().then(function(items){
  	console.log(req.url, req.params)
  	res.send(items)
  })
})

app.get("/api/:resource/:name", (req, res) => {
  cmd = `get ${req.params.resource} ${req.params.name} --output=${req.query.type || 'json'}`

  kubectl.command(cmd).then(function(pod){
  	console.log(req.url, req.params)
  	res.send(pod)
  })
})

app.listen(3001, () => console.log("Listening on port 3001!"));