#include "web_server_class.hpp"

WebServer::WebServer(ConfigStorage *cfg, AsyncWebServer *srv) : config(cfg), server(srv) {}

void WebServer::Init()
{
    // /**
    //  * Bind routing and start HTTP server
    //  */
    server->on("/ping", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (!request->authenticate(config->authHash))
        {
            request->send(403, "application/json", "{\"status\": \"error\", \"message\":\"Access denied\"}");
            return;
        }

        request->send(200, "application/json", "{\"status\": \"success\"}");
    });

    server->on("/update_config", HTTP_POST, [this](AsyncWebServerRequest *request) {
        if (!request->authenticate(config->authHash))
        {
            request->send(403, "application/json", "{\"status\": \"error\", \"message\":\"Access denied\"}");
            return;
        }
        if (request->hasParam("lock_state", true))
        {
            String newParam = String(request->getParam("lock_state", true)->value());
            Serial.println("update_config::param lock_state changed: " + String(config->lockState) + " -> " + newParam);
            config->lockState = newParam.toInt();
        }
        if (request->hasParam("server_ip", true))
        {
            String newParam = String(request->getParam("server_ip", true)->value());
            Serial.println("update_config::param controlServerIp changed: " + String(config->controlServerIp) + " -> " + newParam);
            strlcpy(config->controlServerIp, newParam.c_str(), sizeof(config->controlServerIp));
        }
        // if (request->hasParam("server_port", true))
        // {
        //     String newParam = String(request->getParam("server_port", true)->value());
        //     Serial.println("update_config::param controlServerPort changed: " + String(config->controlServerPort) + " -> " + newParam);
        //     config->controlServerPort = newParam.toInt();
        // }
        if (request->hasParam("token", true))
        {
            String newParam = String(request->getParam("token", true)->value());
            Serial.println("update_config::param authHash changed: " + String(config->authHash) + " -> " + newParam);
            strlcpy(config->authHash, newParam.c_str(), sizeof(config->authHash));
        }

        config->Save();
        request->send(200, "application/json", "{\"status\": \"success\"}");
    });
    server->begin();
}
