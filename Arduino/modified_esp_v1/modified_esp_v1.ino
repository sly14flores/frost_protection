#include <ESP8266WiFi.h>
#include <SPI.h>
#include "MFRC522.h"
#define RST_PIN D3
#define SS_PIN  D4
MFRC522 rfid(SS_PIN, RST_PIN);

int esp_status = 0;

const char* ssid     = "Renzybyte";
const char* password = "renzybyte";
const char* host = "192.168.43.61";

String midString(String str, String start, String finish){
  int locStart = str.indexOf(start);
  if (locStart==-1) return "";
  locStart += start.length();
  int locFinish = str.indexOf(finish, locStart);
  if (locFinish==-1) return "";
  return str.substring(locStart, locFinish);
}

void setup() {
  SPI.begin();
  delay(100);
  rfid.PCD_Init();
  Serial.begin(115200);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);

  }
  
  Serial.println(WiFi.localIP());
}

void update_account(String id, String amount, String empty, String dispensedML) {   
    WiFiClient client;
    const int httpPort = 80;
    if (!client.connect(host, httpPort)) {
      return;
    }
    
    String url="";
    url = "/despro/rfid-handler.php";
    url += "?rfid=" + id;
    url += "&stat=" + amount;
    url += "&cont=" + empty;
    url += "&mL=" + dispensedML;
    

    Serial.print(amount);
    
    
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Connection: close\r\n\r\n");
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 5000) {
        return;
      }
    }

    
    while (client.available()) {
      String line = client.readStringUntil('\r');
      if(line.indexOf("updated")!=-1){
       
          Serial.print(line+"\n");
      }
         
    } 
}

void verify_id(){
     Serial.print("wait\n");
     MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
    if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
      piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
      piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
      Serial.println(F("Your tag is not of type MIFARE Classic."));
      return;
    }
  
    String strID = "";
    for (byte i = 0; i < 4; i++) {
      strID +=
      (rfid.uid.uidByte[i] < 0x10 ? "0" : "") +
      String(rfid.uid.uidByte[i], HEX) +
      (i!=3 ? ":" : "");
    }
    strID.toUpperCase();
     
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();

    
    
    WiFiClient client;
    const int httpPort = 80;
    if (!client.connect(host, httpPort)) {
      return;
    }
    
    String url="";
    url = "/despro/rfid-handler.php";
    url += "?rfid=" + strID;
    url += "&stat=initial";

    
    
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Connection: close\r\n\r\n");
    unsigned long timeout = millis() + 5000;
    while (client.available() == 0) {
      if (timeout - millis() < 0) {
        Serial.println("Client Timeout");
        client.stop();
        return;
      }
    }

    int x = 0;
    while (client.available()) {
      Serial.print("search"+String(x)+"\n");
      x++;
      String line = client.readStringUntil('\r');
      if(line.indexOf("#start")!=-1){
          Serial.print(line+"\n");
      }
         
    } 
    
}


void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()){
    String update_info = "";
    if (Serial.available()) {
      update_info = Serial.readStringUntil('\n');
      if(update_info != ""){
        if(update_info.indexOf("update")!=-1){
          update_account(midString( update_info, "update,", "#" ), midString( update_info, "#", "&" ),midString( update_info, "&", "^" ),midString( update_info, "^", "*" ));
        }         
      }
    }
  }else{
  verify_id();
  }
}


