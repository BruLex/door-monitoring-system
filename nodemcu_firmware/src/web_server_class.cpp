#include "web_server_class.h"

WebServer::WebServer(ConfigStorage *cfg, AsyncWebServer *srv) : config(cfg), server(srv) {}

void WebServer::Init()
{
    // /**
    //  * Bind routing and start HTTP server
    //  */
    server->on("/ping", HTTP_POST, [this](AsyncWebServerRequest *request) {
        Serial.println("WebServer::on(/ping): handled");
        if (!request->hasHeader("TOKEN") || request->getHeader("TOKEN")->value() != String(config->authHash))
        {
            Serial.println("WebServer::on(/ping): Access denied");
            request->send(403, "application/json", "{\"status\": \"error\", \"message\":\"Access denied\"}");
            return;
        }
        request->send(200, "application/json", "{\"status\": \"success\"}");
    });

    server->on("/update_config", HTTP_POST, [this](AsyncWebServerRequest *request) {
        Serial.println("WebServer::on(/update_config): handled");
        if (!request->hasHeader("TOKEN") || request->getHeader("TOKEN")->value() != String(config->authHash))
        {
            Serial.println("WebServer::on(/update_config): Access denied");
            request->send(403, "application/json", "{\"status\": \"error\", \"message\":\"Access denied\"}");
            return;
        }
        if (request->hasParam("mode", true))
        {
            String newParam = String(request->getParam("mode", true)->value());
            Serial.println("WebServer::on(/update_config): param lockState changed: " + String(config->lockState) + " -> " + newParam);
            config->lockState = newParam == "LOCKED" ? 1 : newParam == "UNLOCKED" ? 2 : 3;
            Serial.println("WebServer::on(/update_config): param lockState new state: " + String(config->lockState));
        }
        if (request->hasParam("server_address", true))
        {
            String newParam = String(request->getParam("server_address", true)->value());
            Serial.println("WebServer::on(/update_config): param controlServerAddress changed: " + String(config->controlServerAddress) + " -> " + newParam);
            strlcpy(config->controlServerAddress, newParam.c_str(), sizeof(config->controlServerAddress));
        }
        if (request->hasParam("token", true))
        {
            String newParam = String(request->getParam("token", true)->value());
            Serial.println("WebServer::on(/update_config): param authHash changed: " + String(config->authHash) + " -> " + newParam);
            strlcpy(config->authHash, newParam.c_str(), sizeof(config->authHash));
        }

        config->Save();
        request->send(200, "application/json", "{\"status\": \"success\"}");
    });
    server->begin();
}
