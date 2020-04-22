#include "config_storage_class.hpp"

void ConfigStorage::Init(){
  bool mountResult = SPIFFS.begin();
  Serial.println(mountResult ? "File system mounted with success" : "Error mounting the file system");
}
// Loads the configuration from a file
void ConfigStorage::Load()
{
  // Open file for reading
  File file = SPIFFS.open(config_path, "r");
  // Allocate the memory pool on the stack.
  DynamicJsonDocument doc(1024);
  // Parse the root object
  DeserializationError error = deserializeJson(doc, file);
  
  if (error)
    Serial.println("ConfigStorage::load: Failed to read file, using default configuration");
  else
    serializeJson(doc, Serial);
  // Copy values from the JsonObject to the Config
  lockState = doc["lockState"] | default_lock_state;
  strlcpy(authHash, doc["authHash"] | default_auth_hash.c_str(), sizeof(authHash));
  strlcpy(controlServerAddress, doc["controlServerAddress"] | default_remote_address.c_str(), sizeof(controlServerAddress));
  file.close();
}

// Saves the configuration to a file
void ConfigStorage::Save()
{
  // Delete existing file, otherwise the configuration is appended to the file
  SPIFFS.remove(config_path);
  // Open file for writing
  File file = SPIFFS.open(config_path, "w");
  if (!file)
  {
    Serial.println("ConfigStorage::save: Failed to create file");
    return;
  }
  // Allocate the memory pool on the stack
  DynamicJsonDocument doc(1024);
  // Parse the root object
  doc["lockState"] = lockState;
  doc["authHash"] = authHash;
  doc["controlServerAddress"] = controlServerAddress;
  // Serialize JSON to file
  if (serializeJson(doc, file) == 0)
  {
    Serial.println(F("ConfigStorage::save: Failed to write to file"));
  }
  file.close();
}