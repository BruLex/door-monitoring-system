#include <Arduino.h>
#include <ESPAsyncWiFiManager.h>

#include "access_control_class.hpp"
#include "config_storage_class.hpp"
#include "web_server_class.hpp"

AsyncWebServer server(80);
DNSServer dns;

ConfigStorage config;
WebServer webServer(&config, &server);
AccessControl accessControl(&config);

int currentLockState = 1;

void setup()
{
  // /**
  //  * Init devices
  //  */
  Serial.begin(115200);

  /**
   * Init Wifi module
   */
  AsyncWiFiManager wifiManager(&server, &dns);
  if (!wifiManager.autoConnect("AutoConnectAP"))
  {
    Serial.println("Failed to connect and hit timeout");
    delay(3000);
    //Reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(5000);
  }
  Serial.println(String("Connected, IP address: ") + WiFi.localIP().toString());
  config.Init();
  config.Load();

  accessControl.Init();
  webServer.Init();
  Serial.println("HTTP server started");
}

void loop()
{
  if (config.lockState == 3)
  {
    accessControl.NextCard();
    accessControl.Lock();
  }
  else if (config.lockState == 1)
    accessControl.Block();
  else
    accessControl.Unlock();
  delay(500);
}
