#include <ESP8266WiFi.h>
const char* ssid     = "glen";
const char* password = "returned na ako";
const char* host = "192.168.254.102";

void setup() {
  Serial.begin(115200);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("connected");
    delay(500);
  }
}

void loop() {

  boolean isEmpty = false;
  String strID = "no msg";

  

  WiFiClient client;
  const int httpPort = 80;

  if (!client.connect(host, httpPort)) {
    return;
  }
    String url="";
    url = "/despro/rfid-handler.php";
    url += "?rfid=D0:19:1D:7C";

    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Connection: close\r\n\r\n");
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 5000) {
        return;
      }
    }

    while (client.available()) {
      String line = client.readStringUntil('\r');
      if(line.indexOf("okay")!=-1){
          Serial.println(line+"\n");
      }  
    }
    
}

String midString(String str, String start, String finish){
  int locStart = str.indexOf(start);
  if (locStart==-1) return "";
  locStart += start.length();
  int locFinish = str.indexOf(finish, locStart);
  if (locFinish==-1) return "";
  return str.substring(locStart, locFinish);
}



