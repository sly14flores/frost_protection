#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

const int buttonPin = 12;
int buttonState = 0;

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
  Serial3.begin(115200);
  pinMode(buttonPin,INPUT);
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
  lcd.setCursor(4,2);
  lcd.print("Please wait.");
  
}


void lcd_search0() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search1() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}

void lcd_search2() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search3() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search4() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search5() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search6() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||||||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search7() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||||||||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search8() {
  lcd.clear();
  lcd.setCursor(0,2);
  lcd.print("||||||||||||||||||");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}
void lcd_search9() {
  lcd.clear();
  lcd.setCursor(0,3);
  lcd.print("||||||||||||||||||||");
  lcd.setCursor(1,0);
  lcd.print("Scanning database.");
  lcd.setCursor(4,1);
  lcd.print("Please wait.");
}


void lcd_show_credit(String x, String y) {
  lcd.clear();
  lcd.setCursor(1,0);
  lcd.print("Hi, " + x +"!");
  lcd.setCursor(1,1);
  lcd.print("Balance: P ");
  lcd.print(y);
  if (y.toFloat()<10){
    lcd.setCursor(1,2);
    lcd.print("Sorry your balance");
    lcd.setCursor(6,3);
    lcd.print("is low.");
    delay(5000);
  }
  else {
    lcd.setCursor(1,2);
    lcd.print("Push the button to");
    lcd.setCursor(1,3);
    lcd.print("start within 5 sec");
    dispense(y.toFloat());
  }
  lcd_homepage();
}

void dispense(float x) {
  int a = 0;
  while(buttonState==0 && a<5000) {
    delay(100);
    buttonState=digitalRead(buttonPin);
    a+=50;
  }
  buttonState=0;
}
void lcd_unknown() {
  lcd.clear();
  lcd.setCursor(4,0);
  lcd.print("UNKNOWN CARD");
  lcd.setCursor(2,1);
  lcd.print("Pls. REGISTER at");  
  lcd.setCursor(2,2);
  lcd.print("Business Office.");  
  lcd.setCursor(5,3);
  lcd.print("Thank you.");
  delay(6000);
  lcd_homepage();
}

void loop() {
  
  String user_info = "";
  if (Serial3.available()) {
    user_info = Serial3.readStringUntil('\n');
    if(user_info != ""){
      if(user_info.indexOf("wait")!=-1){
        lcd_verify();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search0")!=-1){
        lcd_search0();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search1")!=-1){
        lcd_search1();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search2")!=-1){
        lcd_search2();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search3")!=-1){
        lcd_search3();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search4")!=-1){
        lcd_search4();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search5")!=-1){
        lcd_search5();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search6")!=-1){
        lcd_search6();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search7")!=-1){
        lcd_search7();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search8")!=-1){
        lcd_search8();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search9")!=-1){
        lcd_search9();
        Serial.println(user_info);
      }
      if(user_info.indexOf("unknown")!=-1) {
        Serial.println(user_info);
        lcd_unknown(); 
      }
      if(user_info.indexOf("#space")!=-1) {
        Serial.println(user_info);
        lcd_show_credit( midString( user_info, "#start", "#space" ), midString( user_info, "#space", "#end" )); 
      }
    }
    }
}

