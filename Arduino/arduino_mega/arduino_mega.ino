#include "SPI.h"
#include "MFRC522.h"
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

#define SS_PIN 53
#define RST_PIN 48
#define SP_PIN 8
MFRC522 rfid(SS_PIN, RST_PIN);

MFRC522::MIFARE_Key key;
LiquidCrystal_I2C lcd(0x27,20,4);

String midString(String str, String start, String finish){
  int locStart = str.indexOf(start);
  if (locStart==-1) return "";
  locStart += start.length();
  int locFinish = str.indexOf(finish, locStart);
  if (locFinish==-1) return "";
  return str.substring(locStart, locFinish);
}


void setup() {
  Serial.begin(115200);
  Serial1.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  lcd.init();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(1,0);
  lcd_homepage();
}

void lcd_homepage(){
  lcd.clear();
  lcd.setCursor(1,0);
  lcd.print("RFID - Based WATER");
  lcd.setCursor(0,1);
  lcd.print("DISPENSER by COE - V");
  lcd.setCursor(5,2);
  lcd.print("----------");
  lcd.setCursor(2,3);
  lcd.print("Tap ID to begin.");
}

void lcd_verify() {
  lcd.clear();
  lcd.setCursor(1,1);
  lcd.print("Verifying ID ....");
  lcd.setCursor(1,2);
  lcd.print("Please wait.");
  
}

void lcd_show_credit(String x, String y) {
  lcd.clear();
  lcd.setCursor(1,1);
  lcd.print("Hi, " + x +"!");
  lcd.setCursor(1,2);
  lcd.print("Credit: P ");
  lcd.print(y);
  delay(5000);
  lcd_homepage();
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()){
    boolean isEmpty = true;
    String user_info = "no msg";
    if (Serial1.available()) {
    user_info = Serial1.readStringUntil('\n');
    isEmpty = false;
    if(user_info != ""){
      Serial.println(user_info);
      lcd_show_credit( midString( user_info, "#start", "#space" ), midString( user_info, "#space", "#end" ));
    }
    }
    return;
  }
  lcd_verify();
  
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

  Serial.print("Tap card key: ");
  Serial.print(strID);
  Serial1.println(strID+"\n");
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
 
}

