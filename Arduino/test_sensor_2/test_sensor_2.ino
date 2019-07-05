int led = 13;
int reader = A4;

void setup() {
  pinMode(13,OUTPUT);
  pinMode(reader,INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println(analogRead(A4));

  if(analogRead(reader)>500) digitalWrite(led,HIGH);
  else digitalWrite(led,LOW);

}
