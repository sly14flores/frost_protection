int reader = A3;

void setup() {
  pinMode(reader,INPUT);
  Serial.begin(9600);
}

void loop() {
   Serial.println(analogRead(reader));
   delay(500);
}
