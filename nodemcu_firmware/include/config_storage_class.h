#ifndef CONFIG_STORAGE_CLASS_H_
#define CONFIG_STORAGE_CLASS_H_

#include <Arduino.h>
#include <ArduinoJson.h>
#include <FS.h>
#include "LittleFS.h"

class ConfigStorage
{
private:
    const String config_path = "/config.json";
    const int default_lock_state = 0;
    const String default_remote_address = "192.168.1.2:3000";
    const String default_auth_hash = "00000000-0000-0000-0000-000000000000";

public:
    char authHash[37];
    char controlServerAddress[255];
    byte lockState;

    void Init();
    void Load();
    void Save();
};
#endif // CONFIG_STORAGE_CLASS_H_
