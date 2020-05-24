#!/bin/bash
SOME_EXECUTED=0
MAIN_FOLDER=$(dirname $(readlink -f $0))

if [ "$(node -v >/dev/null 2>&1 || echo "false")" == "false" ]; then
  echo -e "\e[01;31mError: Please install NodeJS, before using this script\e[0m" >&2
  exit 0
fi

if [ "$(python3 --version >/dev/null 2>&1 || echo "false")" == "false" ]; then
  echo -e "\e[01;31mError: Please install Python 3, before using this script\e[0m" >&2
  exit 0
fi

check_command() {
  for var in $1; do
    if [ "$var" == "$3" ] || [ "$var" == "$4" ]; then
      SOME_EXECUTED=1
      eval "$2"
    fi
  done
}

install_server_deps() {
  cd "$MAIN_FOLDER/server"
  npm install
  cd "$MAIN_FOLDER/ui"
  npm install
}

install_firmware() {
  cd "$MAIN_FOLDER/nodemcu_firmware"
  python3 -m pip3 install --upgrade pip3
  pip3 install platformio
  python3 -m platformio lib install
}

install() {
  install_server_deps
  install_firmware

}

build_firmware() {
  cd "$MAIN_FOLDER/nodemcu_firmware"
  python3 -m platformio run
}

upload_firmware() {
  cd "$MAIN_FOLDER/nodemcu_firmware"
  python3 -m platformio run --target erase
  python3 -m platformio run --target upload
}

build_ui() {
  cd "$MAIN_FOLDER/ui"
  npm run build
  cp -R ./dist/door-system-monitoring ../server/dist/ui_dist
}

build_server() {
  cd "$MAIN_FOLDER/server"
  npm run build
  cp ./src/config.json ./dist/config.json
  cp -R "$MAIN_FOLDER/ui/dist/door-system-monitoring" ./dist/ui_dist
}

build_all() {
  build_server
  build_ui
}

deploy() {
  cd "$MAIN_FOLDER/server/dist"
  node app.js
}

create_database() {
  echo "Execute next script with your credentials or execute manually all query from create_database.sql:"
  echo "mysql -u<your_login> -p<your_password> -h<database_address> < ./create_database.sql"
}

help_info() {
  echo "Usage: ./app-control [OPTIONS...]"
  echo "Options:"
  echo " -i, --install-libs       install lib dependency app"
  echo " -b[=ui|server|all], --build[=ui|server|all]"
  echo "                          build app, default all, ui and server will be build"
  echo " -d, --deploy             start server"
  echo " -c, --compile-firmware   compile firmware"
  echo " -u, --upload-firmware    upload firmware"
  echo " --create-database        create all database instances"
}

if [ $# -eq 0 ]; then
  help_info
  exit
fi

OPTIONS="$@"
check_command "$OPTIONS" install "-i" "--install-libs"
check_command "$OPTIONS" build_firmware "-c" "--compile-firmware"
check_command "$OPTIONS" build_all "-b" "-b=all" "--build" "--build=all"
check_command "$OPTIONS" build_ui "-b=ui" "--build=ui"
check_command "$OPTIONS" build_server "-b=server" "--build=server"
check_command "$OPTIONS" upload_firmware "-u" "--upload-firmware"
check_command "$OPTIONS" deploy "-d" "--deploy"
check_command "$OPTIONS" help_info "-h" "--create-database"
check_command "$OPTIONS" create_database "--create-database"

if [ $SOME_EXECUTED -eq 0 ]; then
  help_info
  exit
fi
