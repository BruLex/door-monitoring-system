#include "access_control_class.hpp"

AccessControl::AccessControl(ConfigStorage *cfg) : config(cfg) {}

void AccessControl::ChangeColor(bool red, bool green)
{
    analogWrite(RED_PIN, red ? 255 : 0);
    analogWrite(GREEN_PIN, green ? 255 : 0);
}

void AccessControl::Init()
{
    pinMode(LOCK_PIN, OUTPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
    SPI.begin();
    mfrc522.PCD_Init();
}

void AccessControl::Lock()
{
    ChangeColor(false, false);
    digitalWrite(LOCK_PIN, LOW);
}

void AccessControl::Block()
{
    ChangeColor(true, false);
    digitalWrite(LOCK_PIN, LOW);
}


void AccessControl::Unlock()
{
    ChangeColor(false, true);
    digitalWrite(LOCK_PIN, HIGH);
}

void AccessControl::NextCard()
{
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())
    {
        ChangeColor(true, true);
        String uid = "";
        for (byte i = 0; i < mfrc522.uid.size; i++)
        {
            uid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
            uid.concat(String(mfrc522.uid.uidByte[i], HEX));
        }
        mfrc522.PICC_HaltA();
        Serial.println("AccessControl::NextCard: End reading:uid -> " + uid);

        HTTPClient http;
        http.begin("http://" + String(config->controlServerAddress) + check_uuid_request);
        http.addHeader("Content-Type", "application/json");
        int statusCode = http.POST("{\"uuid\": \"" + uid + "\"}");
        String response = http.getString();
        Serial.print("AccessControl::NextCard::response: " + response);
        DynamicJsonDocument doc(1024);
        bool accessGranted = statusCode > 0 &&
                             String(deserializeJson(doc, response).c_str()) == String("Ok") &&
                             String(doc["status"].as<char *>()) == String("success");

        if (accessGranted)
        {
            Serial.print("AccessControl::NextCard: Access granted");
            Unlock();
        }
        else
        {
            Serial.print("AccessControl::NextCard: Access denied");
            ChangeColor(true, false);
        }
        delay(2000);
        Lock();
    }
}