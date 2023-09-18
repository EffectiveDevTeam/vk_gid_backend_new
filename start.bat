start cmd "C:\Program Files\Docker\Docker\Docker Desktop.exe"
cd "D:\MyProjects\vk_gid_backend_new"
start cmd /k "yarn start:dev"
start cmd /k "ngrok http 4000"
choice /c YN /m "Did you post a link in frontend env file?"
IF ERRORLEVEL 1 GOTO yes
IF ERRORLEVEL 2 GOTO no
:yes
cd "D:\MyProjects\vk_gid_frontend"
start cmd /k "yarn start"
start cmd /k "ngrok http --host-header=rewrite https://localhost:18300 --config=ngconf.yml"