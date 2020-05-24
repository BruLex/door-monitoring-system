#include <Arduino.h>
#include <ESPAsyncWiFiManager.h>

#include "access_control_class.h"
#include "config_storage_class.h"
#include "web_server_class.h"

class Main {
private:
    AsyncWebServer server = AsyncWebServer(80);
    DNSServer dns = DNSServer();

    ConfigStorage config = ConfigStorage();
    WebServer webServer = WebServer(&config, &server);
public:
    AccessControl accessControl = AccessControl(&config);


    void Init() {
        /**
         * Init devices
         */
        Serial.begin(115200);

        /**
         * Init Wifi module
         */
        AsyncWiFiManager wifiManager(&server, &dns);
        if (!wifiManager.autoConnect(String("AccessControlDevice-" + WiFi.macAddress()).c_str())) {
            Serial.println("Failed to connect and hit timeout");
            delay(3000);
            /**
             * Reset and try again, or maybe put it to deep sleep
             */
            ESP.reset();
            delay(5000);
        }
        Serial.println(String("Connected, IP address: ") + WiFi.localIP().toString());
        config.Init();

        accessControl.Init();
        webServer.Init();
    }

    void Loop() {
        accessControl.NextCard();
    }
};

Main main;

void setup() {
    main.Init();
}

void loop() {
    main.Loop();
}
