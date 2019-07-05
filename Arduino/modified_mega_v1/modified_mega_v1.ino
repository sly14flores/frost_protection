#include <Wire.h> 
#include <LiquidCrystal_I2C.h>


float calibrationFactor = 2.52;

const int trigPin = 39;
const int echoPin = 41;
const int trigPin2 = 27;
const int echoPin2 = 26;
const int buttonPin = 12;
const int lowerSolenoid = 10;
const int leftSolenoid = 9;
const int rightSolenoid = 8;
const int levelHigh = 6;
const int levelLow = 5;
const int levelLeft = 4;
const int levelRight = 3;

int informed = 0;
int buttonState = 0;
long duration;
int distance;
long duration2;
int distance2;
byte sensorInterrupt = 0;  
byte sensorPin       = 2;
int prevContainer = 2;

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
  
  pinMode(trigPin2, OUTPUT); 
  pinMode(echoPin2, INPUT);
  
  Serial.begin(115200);
  Serial3.begin(115200);
  pinMode(buttonPin,INPUT);
  pinMode(sensorPin, INPUT);
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
  lcd.clear();
  lcd.setCursor(7,0);
//  Serial3.print("donetransaction\n");
//  Serial.print("donetransaction\n");
  lcd.print("SMART");
  lcd.setCursor(2,1);
  lcd.print("WATER  DISPENSER");
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
long dist(){  // calculates the distance of the container
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
long dist2(){  // calculates the distance of the container
  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin2, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration2 = pulseIn(echoPin2, HIGH);
  // Calculating the distance
  distance2= duration2*0.034/2;
  return distance2;
}
void dispense(String n, float x, String z) {
//  Serial3.print("ongoing\n");
//  Serial.print("ongoing\n");
  int a = 0;
  long proximity = dist(); 
  long proximity2 = dist2(); // computes the distance of the container
  while(a<6000) {
    delay(100);
    proximity = dist();
    proximity2 = dist2();
    Serial.print("lower: ");
    Serial.println(proximity);
    
    Serial.print("upper: ");
    Serial.println(proximity2);
    
    buttonState=digitalRead(buttonPin);
    if ((proximity < 8 && buttonState == 0)||(proximity2 < 8 && buttonState == 0)){
      lcd.setCursor(1,2);
      lcd.print("Waiting for you to");
      lcd.setCursor(0,3);
      lcd.print("then push the button");
    }
    else if ((proximity > 8 && proximity2 > 8) && buttonState == 1){
      lcd.setCursor(1,2);
      lcd.print("Waiting for you to");
      lcd.setCursor(0,3);
      lcd.print("place your container");
    }
    else if ((proximity < 8 || proximity2 < 8) && buttonState == 1){
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
    long maxLitre = x*175;
    
    while(buttonState == 1 && (proximity < 8 || proximity2 < 8) && totalMilliLitres < (maxLitre-175)) { // to ensure that the water being dispensed will not exceed his balance
          
      digitalWrite(lowerSolenoid,HIGH);
      
      buttonState=digitalRead(buttonPin);
      if((millis() - oldTime) > 1000) { 
  
        detachInterrupt(sensorInterrupt);
            
        flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;
        
        oldTime = millis();
        
        flowMilliLitres = (flowRate / 60) * 1000;
        
        totalMilliLitres += flowMilliLitres;
          
        unsigned int frac;
        
        Serial.print("Flow rate: ");                  // code to check the reading, for calibration only
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
      lcd.print(totalMilliLitres/175);
    }
    digitalWrite(lowerSolenoid,LOW);
    delay(500);
    float expense = totalMilliLitres/175;
    x -= expense;
    int statLeft = digitalRead(levelLeft);
    int statRight = digitalRead(levelRight);
    int totalEmpty = statLeft + statRight;
    if (expense != 0)Serial3.print("update," + z + "#" + x + "&" + totalEmpty + "^" + totalMilliLitres + "*\n");
    Serial.print("update," + z + "#" + x + "&" + totalEmpty + "*\n");
    
    lcd.clear();
    lcd.setCursor(1,0);
    lcd.print("Hi, " + n +"!");
    lcd.setCursor(1,1);
    lcd.print("Expense: P ");
    lcd.print(expense);
    lcd.setCursor(1,2);
    lcd.print("Total mL: ");
    lcd.print(totalMilliLitres);
    lcd.print("mL");
    lcd.setCursor(1,3);
    lcd.print("Account Logged Out");
    delay(7500);
  }
  
  pulseCount        = 0;
  flowRate          = 0.0;
  flowMilliLitres   = 0;
  totalMilliLitres  = 0;
  oldTime           = 0;
  buttonState=0;
//  Serial3.print("donetransaction\n");
//  Serial.print("donetransaction\n");
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
//  Serial3.print("ongoing\n");
//  Serial.print("ongoing\n");
  delay(6000);
//  Serial3.print("donetransaction\n");
//  Serial.print("donetransaction\n");
  lcd_homepage();
  
}

void timeout() {
  lcd.clear();
  lcd.setCursor(2,1);
  lcd.print("Connection timeout");  
  lcd.setCursor(2,3);
  lcd.print("Pls. Try again");  
  lcd.setCursor(5,3);
  lcd.print("Thank you.");
  delay(6000);
  lcd_homepage();
}

void checkLevel() {                                 // checks the level of water in the reservoir
  int Low = digitalRead(levelLow);
  int High = digitalRead(levelHigh);
  int statLeft = digitalRead(levelLeft);
  int statRight = digitalRead(levelRight);
  int totalEmpty = statLeft + statRight;
  if (totalEmpty==1 && informed ==0) {
    Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    informed = 1;
    prevContainer = totalEmpty;
    lcd_homepage();
  }
  if (totalEmpty==0 && informed == 1 && prevContainer == 1) {
    Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    informed = 1;
    prevContainer = totalEmpty;
//    Serial3.print("ongoing\n");
//    Serial.print("ongoing\n");
    while (statLeft == 0 && statRight == 0){
      delay(200);
      statLeft = digitalRead(levelLeft);
      statRight = digitalRead(levelRight);
      totalEmpty = statRight + statLeft;
    lcd.setCursor(0,0);
    lcd.print("Sorry, the system is");  
    lcd.setCursor(0,1);
    lcd.print("unavailable for now.");  
    lcd.setCursor(5,3);
    lcd.print("Thank you.");
    }
    Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    
//    Serial3.print("donetransaction\n");
//    Serial.print("donetransaction\n");
    informed = 0;
    lcd_homepage();
    
  }
  if (totalEmpty==0 && prevContainer == 2) {
    Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    informed = 1;
    prevContainer = totalEmpty;
//    Serial3.print("ongoing\n");
//    Serial.print("ongoing\n");
    lcd.clear();
    while (statLeft == 0 && statRight == 0){
      delay(200);
      statLeft = digitalRead(levelLeft);
      statRight = digitalRead(levelRight);
      totalEmpty = statRight + statLeft;
    lcd.setCursor(0,0);
    lcd.print("Sorry, the system is");  
    lcd.setCursor(0,1);
    lcd.print("unavailable for now.");  
    lcd.setCursor(5,3);
    lcd.print("Thank you.");
    }
    Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
//    Serial3.print("donetransaction\n");
//    Serial.print("donetransaction\n");
    lcd_homepage();
    
    prevContainer = totalEmpty;
    informed = 0;
    
  }
  if (totalEmpty==2 && informed == 1){
    Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
    informed = 0;
  }
  if (Low == 0 && High == 0) {
    if (statLeft == 1 || statRight == 1) {
//      Serial3.print("ongoing\n");
//      Serial.print("ongoing\n");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Please wait, we are");  
      lcd.setCursor(0,1);
      lcd.print("filling up the tank.");  
      lcd.setCursor(5,3);
      lcd.print("Thank you.");
      while(digitalRead(levelHigh) == 0){
        statLeft = digitalRead(levelLeft);
        statRight = digitalRead(levelRight);
        if (statLeft == 1){
          digitalWrite(leftSolenoid,HIGH);
        }
        if (statRight == 1){
          digitalWrite(rightSolenoid,HIGH);
        }
      }
      digitalWrite(leftSolenoid,LOW);
      digitalWrite(rightSolenoid,LOW);
      delay(500);
      lcd_homepage();
//      Serial3.print("donetransaction\n");
//      Serial.print("donetransaction\n");
      
    }else{
      totalEmpty = statLeft + statRight;
      Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
      Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
      while (statLeft == 0 && statRight == 0){
        statLeft = digitalRead(levelLeft);
        statRight = digitalRead(levelRight);
        totalEmpty = statLeft + statRight;
      lcd.setCursor(0,0);
      lcd.print("Sorry, the system is");  
      lcd.setCursor(0,1);
      lcd.print("unavailable for now.");  
      lcd.setCursor(5,3);
      lcd.print("Thank you.");
  }
  Serial3.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
  Serial.print("update,SYSTEM#0&" + String(totalEmpty) + "^0*\n");
//  Serial3.print("donetransaction\n");
//  Serial.print("donetransaction\n");
  lcd_homepage();
    }
  
} 
}

void loop() {
  checkLevel();
  String user_info = "";
  if (Serial3.available()) {                        //checks whether NODeMCU sent info about the card from the server
    user_info = Serial3.readStringUntil('\n');
    if(user_info != ""){
      if(user_info.indexOf("wait")!=-1){
        lcd_verify();
        Serial.println(user_info);
      }
      if(user_info.indexOf("search0")!=-1){         // displays the loading part
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
      if(user_info.indexOf("Timeout")!=-1){
        timeout();
        Serial.println(user_info);
      }
      if(user_info.indexOf("Unknown")!=-1) {
        lcd_unknown(); 
        Serial.println(user_info);
      }
      if(user_info.indexOf("#space")!=-1) {         //asks the user to dispense water
        Serial.println(user_info);
        lcd_show_credit( midString( user_info, "#start", "#space" ), midString( user_info, "#space", "#plus" ) , midString( user_info, "#plus", "#end" )); 
      }
    }
    }
}

