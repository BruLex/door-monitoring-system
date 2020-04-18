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
    const String check_uid_request = "/remote/check_uid";
    WiFiClient wifi;
    ConfigStorage *config;
    MFRC522 mfrc522 = MFRC522(SS_PIN, RST_PIN);
    void ChangeColor(bool red, bool green);

public:
    AccessControl(ConfigStorage *cfg);
    void Init();
    void NextCard();
    void Unlock();
    void Lock();

};

#endif // ACCESS_CONTROL_CLASS_H_