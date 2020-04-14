#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <FS.h>
#include <WiFiManager.h>
#include <SPI.h>
#include <MFRC522.h>
#include "ArduinoJson.h"

#include "constants.hpp"
#include "main_site.hpp"

#define RST_PIN D3
#define SS_PIN D4
#define LOCK_PIN D0
#define RED_PIN D1
#define GREEN_PIN D2

MFRC522 mfrc522(SS_PIN, RST_PIN);
ESP8266WebServer server(80);

/**
 * 1 - locked always (red)
 * 2 - unlocked always (greeb)
 * 3 - guard (unvisible)
 * 4 - test state - waiting responce (yellow)
 */
int LOCK_STATE = 0;

char *www_username = "admin";
char *www_password = "admin";
String serverIPAddress = "192.168.31.160:3000";
String logs = "";

void changeColor(bool red, bool green)
{
  analogWrite(RED_PIN, red ? 255 : 0);
  analogWrite(GREEN_PIN, green ? 255 : 0);
}

void handleMain()
{
  Serial.println('handleMain');
  server.send(200, "text/html", getMainHtml(serverIPAddress, LOCK_STATE));
}
void handlePing()
{
  Serial.println('handlePing');
  server.send(200, "application/json", "{\"status\": \"success\"}");
}
void lastCardUUID()
{
  if (!server.authenticate(www_username, www_password))
  {
    return server.requestAuthentication();
  }
  File f = SPIFFS.open("/data.txt", "r");
  if (!f)
  {
    server.send(500, "application/json", "{\"status\": \"error\" , \"message\": \"File open failed\"}");
  }
  else
  {
    server.send(200, "application/json", "{\"status\": \"success\" , \"data\":  " + f.readString() + "}");
    f.close();
  }
}

void registerDevice()
{ 
  String request = "{\"mac\": \"" + WiFi.macAddress() + "\"}";
  String url = "http://" + serverIPAddress + REGISTER_DEVICE_REQUEST;
  Serial.println("registerDevice::request:: " + request);
  Serial.println("registerDevice::sendRequestTo:: " + url);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.POST(request);
  String payload = http.getString();
  Serial.println("registerDevice::responce:: " + payload);

  server.send(200, "application/json", http.getString());
}

void updateConfig()
{
  for (int i = 0; i < server.args(); i++)
  {
    logs = logs + "\n arg:" + server.argName(i) + "value: " + server.arg(i);
    if (server.argName(i) == "lock")
    {
      LOCK_STATE = server.arg(i).toInt();
    }
    else if (server.argName(i) == "ip")
    {
      serverIPAddress = server.arg(i);
    }
  }

  server.send(200, "application/json", "{\"status\": \"success\"}");
}

void check_RFID()
{
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())
  {
    changeColor(true, true);
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
      uid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
      uid.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    mfrc522.PICC_HaltA();
    Serial.println("check_RFID::End reading::uid -> " + uid);

    String request = "{\"uid\": \"" + uid + "\"}";

    File f = SPIFFS.open("/data.txt", "w");
    if (f)
    {
      f.flush();
      f.println(request);
      f.close();
    }
    else
    {
      Serial.println("File open failed");
    }

    HTTPClient http;
    http.begin("http://" + serverIPAddress + CHECK_UID_REQUEST);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(request);
    String payload = http.getString();
    if (httpCode > 0)
    {
      Serial.print("Response: ");
      Serial.println(payload.toInt());
      if (payload.toInt() == 1)
      {
        Serial.print("Access granted");
        changeColor(false, true);
      }
      else
      {
        Serial.print("Access denied");
        changeColor(true, false);
      }
      delay(2000);
      changeColor(false, false);
    }
  }
}

void setup()
{
  // /**
  //  * Init devices
  //  */

  pinMode(LOCK_PIN, OUTPUT);  // D0
  pinMode(RED_PIN, OUTPUT);   //D1
  pinMode(GREEN_PIN, OUTPUT); //D2

  Serial.begin(115200);
  // bool mountResult = SPIFFS.begin();
  // Serial.println(mountResult ? "File system mounted with success" : "Error mounting the file system");
  // SPI.begin();        // Init SPI bus
  // mfrc522.PCD_Init(); // Init MFRC522

  /**
   * Init Wifi module
   */
  WiFiManager wifiManager;
  
  if (!wifiManager.autoConnect("AutoConnectAP"))
  {
    Serial.println("Failed to connect and hit timeout");
    delay(3000);
    //Reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(5000);
  }
  Serial.println(String("Connected, IP address: ") + WiFi.localIP().toString());
  /**
   * Bind routing and start HTTP server
   */
  server.on("/ping", HTTP_ANY, handlePing);
  server.on("/last_uuid", HTTP_ANY, lastCardUUID);
  server.on("/update_config", HTTP_ANY, updateConfig);
  server.on("/begin_registration", HTTP_ANY, registerDevice);
  server.on("/", HTTP_ANY, handleMain);
  server.begin();
  Serial.println("HTTP server started");
  Serial.println(WiFi.macAddress());
}

void loop()
{
  server.handleClient();
  // check_RFID();
  // delay(3000);
  // digitalWrite(LOCK_PIN, HIGH);
  // changeColor(false, true);
  // delay(3000);
  // digitalWrite(LOCK_PIN, LOW);
  // changeColor(true, false);
  }
