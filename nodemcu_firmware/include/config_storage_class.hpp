#ifndef CONFIG_STORAGE_CLASS_H_
#define CONFIG_STORAGE_CLASS_H_

#include <Arduino.h>
#include <ArduinoJson.h>
#include <FS.h>

class ConfigStorage
{
private:
    const String config_path = "/config.txt";
    const int default_lock_state = 0;
    const String default_remote_address = "192.168.31.160:3000";
    const String default_auth_hash = "fee275a0-8155-55fe-a071-ce7f580e1eac";

public:
    char authHash[36];
    char controlServerAddress[255];
    byte lockState;

    void Init();
    void Load();
    void Save();
};

#endif // CONFIG_STORAGE_CLASS_H_