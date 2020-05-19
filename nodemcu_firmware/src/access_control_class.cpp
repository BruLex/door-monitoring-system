#include "access_control_class.h"

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

void AccessControl::ProcessCardIfPresent()
{
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())
    {
        ChangeColor(true, true);
        String uuid = "";
        for (byte i = 0; i < mfrc522.uid.size; i++)
        {
            uuid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
            uuid.concat(String(mfrc522.uid.uidByte[i], HEX));
        }
        mfrc522.PICC_HaltA();
        Serial.println("AccessControl::NextCard: End reading:uid -> " + uuid);

        bool accessGranted = IsCardHaveAccess(uuid);

        if (accessGranted)
            Unlock();
        else
            ChangeColor(true, false);

        Serial.println("AccessControl::NextCard: Access " + accessGranted ? "granted" : "denied");

        delay(2000);
        Lock();
    }
}

bool AccessControl::IsCardHaveAccess(String uuid)
{

    HTTPClient http;
    http.begin("http://" + String(config->controlServerAddress) + check_uuid_request);
    http.addHeader("Content-Type", "application/json");
    int statusCode = http.POST("{\"uuid\": \"" + uuid + "\"}");
    String response = http.getString();
    Serial.println("AccessControl::NextCard::response: " + response);
    DynamicJsonDocument doc(1024);
    return statusCode > 0 &&
           String(deserializeJson(doc, response).c_str()) == String("Ok") &&
           String(doc["status"].as<char *>()) == String("success");
}

void AccessControl::NextCard()
{
    if (config->lockState == 3)
    {
        ProcessCardIfPresent();
        Lock();
    }
    else if (config->lockState == 1)
        Block();
    else
        Unlock();
    delay(500);
}