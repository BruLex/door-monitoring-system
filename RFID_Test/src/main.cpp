
#include "libs_include.h"
#include "constants.h"
#include "ArduinoJson.h"

#define RST_PIN D3
#define SS_PIN D4
#define RED_PIN D0
#define GREEN_PIN D1
#define BLUE_PIN D2

MFRC522 mfrc522(SS_PIN, RST_PIN); // Instance of the class
ESP8266WebServer espServer(80);      //Server on port 80
WiFiClient wifi;
HttpClient client = HttpClient(wifi, "192.168.1.3", 3000);
IPAddress apiServer(192, 168, 1, 3);

void setColor(int red, int green, int blue)
{
    analogWrite(RED_PIN, red);
    analogWrite(GREEN_PIN, green);
    analogWrite(BLUE_PIN, blue);
}
void setGreenLight()
{
    setColor(0, 255, 0);
}

void setRedLight()
{
    setColor(255, 0, 0);
}

void setYellowLight()
{
    setColor(600, 180, 0);
}
void handlePing()
{
  espServer.send(200, "application/json", "{\"status\": \"success\"}"); //Send web page
}


void check_RFID() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())
  {
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
      Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
      Serial.print(mfrc522.uid.uidByte[i], HEX);
      uid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
      uid.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    Serial.println();

    Serial.println("making GET request");
    #ifdef PROGMEM
    const size_t CAPACITY = ArduinoJson::JSON_OBJECT_SIZE(1);
    ArduinoJson::StaticJsonDocument<CAPACITY> doc;
    ArduinoJson::JsonObject obj = doc.to<ArduinoJson::JsonObject>();
    obj[String("uid")] = serialized(uid);
    #else

    #warning PROGMEM is not supported on this platform

    #endif
    String request;
    serializeJson(doc, request);
    client.post(CHECK_UID_REQUEST,"application/json", request);

    // read the status code and body of the response
    int statusCode = client.responseStatusCode();
    String response = client.responseBody();

    if (statusCode == 200)
    {
      Serial.print("Response: ");
      Serial.println(response.toInt());
      if (response)
      {
        Serial.print("access granted");
      }
      else
      {
        Serial.print("access denied");
      }
    }
    else
    {
      Serial.print("Response: ");
      Serial.println(response);
    }

    mfrc522.PICC_HaltA();
  }
}


void setup()
{ 
  Serial.begin(9600);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  SPI.begin();        // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  WiFiManager wifiManager;
  if (!wifiManager.autoConnect("AutoConnectAP"))
  {
    Serial.println("failed to connect and hit timeout");
    delay(3000);
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(5000);
  }
  Serial.println(String("Connected! IP address: ") + WiFi.localIP().toString());
  espServer.on("/ping", HTTP_POST, handlePing);

  espServer.begin(); //Start server
  Serial.println("HTTP server started");
}


void loop()
{
  espServer.handleClient();
  check_RFID();
}
