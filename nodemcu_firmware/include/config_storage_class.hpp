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
    const String default_remote_ip = "192.168.31.160";
    const int default_remote_port = 3000;
    const String default_auth_hash = "YWRtaW46YWRtaW4="; // adminadmin

public:
    char authHash[512];
    char controlServerIp[15];
    int controlServerPort;
    int lockState;

    void Init();
    void Load();
    void Save();
};

#endif // CONFIG_STORAGE_CLASS_H_