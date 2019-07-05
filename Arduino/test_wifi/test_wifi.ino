
void setup() {
  // put your setup code here, to run once: 
  Serial.begin(9600);      // PC Arduino Serial Monitor
  Serial1.begin(115200);   // Arduino to ESP01 Communication
  connectWiFi();           // To connect to Wifi
 } 

void loop() { 
 
}

boolean connectWiFi() {               // Connect to Wifi Function
  Serial1.println("AT+CWMODE=1\r\n");
  Serial.println("AT+CWMODE=1\r\n");// Setting Mode = 1 
  delay(100);                         // wait for 100 mSec

  String cmd ="AT+CWJAP=\"glen\",\"returned na ako\"\r\n";   
           
  
  Serial.println(cmd);                // Display Connect Wifi Command on PC
  Serial1.println(cmd);               // send Connect WiFi command to Rx1, Tx1 
  
  delay(10000);                       // wait for 10 sec

  Serial1.println("AT+CWJAP?");       // Verify Connected WiFi

  if(Serial1.find("+CWJAP"))        
  {
    Serial.println("OK, Connected to WiFi.");         // Display Confirmation msg on PC
    return true;
  }
  else
  {
    Serial.println("Can not connect to the WiFi.");   // Display Error msg on PC
    return false;
  }
}

