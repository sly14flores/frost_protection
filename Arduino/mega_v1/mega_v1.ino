#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

const int trigPin = 39;
const int echoPin = 41;
const int buttonPin = 12;
const int lowerSolenoid = 10;
const int leftSolenoid = 9;
const int rightSolenoid = 8;
const int levelHigh = 6;
const int levelLow = 5;
int buttonState = 0;
long duration;
int distance;
byte sensorInterrupt = 0;  
byte sensorPin       = 2;
float calibrationFactor = 4.5;
volatile byte pulseCount = 0;  
float flowRate = 0.0;
unsigned int flowMilliLitres = 0;
unsigned long totalMilliLitres = 0;
unsigned long oldTime = 0;

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
  pinMode(lowerSolenoid,OUTPUT);
  pinMode(leftSolenoid,OUTPUT);
  pinMode(rightSolenoid,OUTPUT);
  pinMode(levelHigh,INPUT);
  pinMode(levelLow,INPUT);  
  pinMode(trigPin, OUTPUT); 
  pinMode(echoPin, INPUT);
  Serial.begin(115200);
  Serial3.begin(115200);
  pinMode(buttonPin,INPUT);
  pinMode(sensorPin, INPUT);
  lcd.init();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(1,0);
  lcd_homepage();
  attachInterrupt(sensorInterrupt, pulseCounter, FALLING);
}

void pulseCounter(){
  pulseCount++;
}

void lcd_homepage(){
  checkLevel();
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


void lcd_show_credit(String x, String y, String z) {
  lcd.clear();
  lcd.setCursor(1,0);
  lcd.print("Hi, " + x +"!");
  lcd.setCursor(1,1);
  lcd.print("Balance: P ");
  lcd.print(y);
  if (y.toFloat()<=0){
    lcd.setCursor(1,2);
    lcd.print("Sorry your balance");
    lcd.setCursor(6,3);
    lcd.print("is low.");
    delay(5000);
  }
  else {
    lcd.setCursor(1,2);
    lcd.print("Place a cup please");
    lcd.setCursor(0,3);
    lcd.print("then push the button");
    dispense(x,y.toFloat(),z);
  }
  lcd_homepage();
}
long dist(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  distance= duration*0.034/2;
  return distance;
}
void dispense(String n, float x, String z) {
  int a = 0;
  long proximity = dist();
  while(a<6000) {
    delay(100);
    proximity = dist();
    buttonState=digitalRead(buttonPin);
    if (proximity < 8 && buttonState == 0){
      lcd.setCursor(1,2);
      lcd.print("Waiting for you to");
      lcd.setCursor(0,3);
      lcd.print("then push the button");
    }
    if (proximity > 8 && buttonState == 1){
      lcd.setCursor(1,2);
      lcd.print("Waiting for you to");
      lcd.setCursor(0,3);
      lcd.print("place your container");
    }
    if (proximity < 8 && buttonState == 1){
      break;
    }
    a+=60;
  }
  if (a!=6000){
    lcd.clear();
    lcd.setCursor(1,0);
    lcd.print("Hi, " + n +"!");
    lcd.setCursor(1,1);
    lcd.print("Balance: P ");
    lcd.print(x);
    long maxLitre = x*50;
    lcd.setCursor(1,2);
    lcd.print("Max mL: ");
    lcd.print(maxLitre);
    
    while(buttonState == 1 && proximity < 8 && totalMilliLitres < (maxLitre-50)) {
          
      digitalWrite(lowerSolenoid,HIGH);
      
      buttonState=digitalRead(buttonPin);
      if((millis() - oldTime) > 1000) { 
  
        detachInterrupt(sensorInterrupt);
            
        flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;
        
        oldTime = millis();
        
        flowMilliLitres = (flowRate / 60) * 1000;
        
        totalMilliLitres += flowMilliLitres;
          
        unsigned int frac;
        
        Serial.print("Flow rate: ");
        Serial.print(int(flowRate));  
        Serial.print(".");             
  
        frac = (flowRate - int(flowRate)) * 10;
        Serial.print(frac, DEC) ;      
        Serial.print("L/min");
        
        Serial.print("  Current Liquid Flowing: ");            
        Serial.print(flowMilliLitres);
        Serial.print("mL/Sec");
  
        Serial.print("  Output Liquid Quantity: ");           
        Serial.print(totalMilliLitres);
        Serial.println("mL"); 
  
        pulseCount = 0;
      
        attachInterrupt(sensorInterrupt, pulseCounter, FALLING);
        
      }
      lcd.setCursor(1,3);
      lcd.print("> "); 
      lcd.print(totalMilliLitres);
      lcd.print(" mL, P");
      lcd.print(totalMilliLitres/50);
    }
    digitalWrite(lowerSolenoid,LOW);
    delay(500);
    float expense = totalMilliLitres/50;
    x -= expense;
    if (expense != 0)Serial3.print("update," + z + "#" + x +"&\n");
    Serial.print("update," + z + "#" + x +"\n");
    
    lcd.clear();
    lcd.setCursor(1,0);
    lcd.print("Hi, " + n +"!");
    lcd.setCursor(1,1);
    lcd.print("Expense: P ");
    lcd.print(expense);
    lcd.setCursor(1,2);
    lcd.print("Balance: P ");
    lcd.print(x);
    lcd.setCursor(5,3);
    lcd.print("Thank You");
    delay(7500);
  }
  
  pulseCount        = 0;
  flowRate          = 0.0;
  flowMilliLitres   = 0;
  totalMilliLitres  = 0;
  oldTime           = 0;
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

void checkLevel() {
  int Low = digitalRead(levelLow);
  if (Low == 0) {
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Please wait, we are");  
    lcd.setCursor(0,1);
    lcd.print("filling up the tank.");  
    lcd.setCursor(5,3);
    lcd.print("Thank you.");
    while(digitalRead(levelHigh) == 0){
      digitalWrite(leftSolenoid,HIGH);
      digitalWrite(rightSolenoid,HIGH);
      
    }
    digitalWrite(leftSolenoid,LOW);
    digitalWrite(rightSolenoid,LOW);
    delay(500);
    lcd_homepage();
  }  
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
        lcd_show_credit( midString( user_info, "#start", "#space" ), midString( user_info, "#space", "#plus" ) , midString( user_info, "#plus", "#end" )); 
      }
    }
    }
}

