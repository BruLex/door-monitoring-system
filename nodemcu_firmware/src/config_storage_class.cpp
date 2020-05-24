#include "config_storage_class.h"

void ConfigStorage::Init()
{
  bool mountResult = LittleFS.begin();
  Serial.println(mountResult ? "File system mounted with success" : "Error mounting the file system");
  Load();
}

void ConfigStorage::Load()
{
  // Open file for reading
  File file = LittleFS.open(config_path, "r");
  // Allocate the memory pool on the stack.
  DynamicJsonDocument doc(JSON_OBJECT_SIZE(3) + 360);
  // Parse the root object
  DeserializationError error = deserializeJson(doc, file);
  if (error)
    Serial.println("ConfigStorage::Load: Failed to read, default configuration will be used");
  else
    serializeJson(doc, Serial);
  Serial.println();
  // Copy values from the JsonObject to the Config
  lockState = doc["lockState"] | default_lock_state;
  strlcpy(authHash, doc["authHash"] | default_auth_hash.c_str(), sizeof(authHash));
  strlcpy(controlServerAddress, doc["controlServerAddress"] | default_remote_address.c_str(), sizeof(controlServerAddress));
  file.close();
}

void ConfigStorage::Save()
{
    // Delete existing file, otherwise the configuration is appended to the file
    LittleFS.remove(config_path);
    // Open file for writing
    File file = LittleFS.open(config_path, "w");
    if (!file)
    {
        Serial.println("ConfigStorage::save: File cannot be created");
        return;
    }
    // Create dinamic dict and allocated needed mamory
    DynamicJsonDocument doc(1024);
    // Parse config
    doc["lockState"] = lockState;
    doc["authHash"] = authHash;
    doc["controlServerAddress"] = controlServerAddress;
    // Serialize config as json to file
    if (serializeJson(doc, file) == 0)
    {
        Serial.println(F("ConfigStorage::save: Cannot save file"));
    }
    file.close();
}

// bool CheckUUIDIsAllowedSaved(String uid)
// {
//   File file = SPIFFS.open("uuids", "r");

//   DynamicJsonDocument doc(JSON_ARRAY_SIZE(1000) + 10000);
//   DeserializationError error = deserializeJson(doc, file);
//   if (error)
//   {
//     Serial.println("ConfigStorage::CheckIdWithSaved: Failed to read file with uuids");
//     return false;
//   }
//   JsonArray array = doc.as<JsonArray>();
//   for (JsonVariant v : array)
//   {
//     if (uid == String(v.as<char *>()))
//     {
//       return true;
//     }
//   }
//   file.close();
//   return false;
// }

// void SaveUUIDS(char* uuid)
// {
//   SPIFFS.remove("uuids");
//   File file = SPIFFS.open("uuids", "W");
//   file.write(uuid);
//   file.close();
// }


