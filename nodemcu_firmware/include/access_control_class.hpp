#ifndef ACCESS_CONTROL_CLASS_H_
#define ACCESS_CONTROL_CLASS_H_

#include <Arduino.h>
#include <MFRC522.h>
#include <SPI.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include "config_storage_class.hpp"

#define RST_PIN D3
#define SS_PIN D4
#define LOCK_PIN D8
#define RED_PIN D1
#define GREEN_PIN D2

class AccessControl
{
private:
    const String check_uuid_request = "/access_control/check_card";
    WiFiClient wifi;
    ConfigStorage *config;
    MFRC522 mfrc522 = MFRC522(SS_PIN, RST_PIN);
    void ChangeColor(bool red, bool green);
    void ProcessCardIfExists();
    void Unlock();
    void Lock();
    void Block();
    bool IsCardHaveAccess(String uuid);
    void ProcessCardIfPresent();

public:
    AccessControl(ConfigStorage *cfg);
    void Init();
    void NextCard();
};

#endif // ACCESS_CONTROL_CLASS_H_