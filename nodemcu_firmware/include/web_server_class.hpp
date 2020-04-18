#ifndef WEB_SERVER_H_
#define WEB_SERVER_H_

#include <Arduino.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "config_storage_class.hpp"

class WebServer
{
private:
    ConfigStorage *config;
    AsyncWebServer *server;

public:
    WebServer(ConfigStorage *cfg, AsyncWebServer *srv);
    void Init();
};

#endif // WEB_SERVER_H_