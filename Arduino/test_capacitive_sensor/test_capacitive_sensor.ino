

int l = 11;
int s = 8;
int r = 9;
int a = 0;
void setup() {
  pinMode(l,OUTPUT);
  pinMode(s,OUTPUT);
  pinMode(r,INPUT);
  Serial.begin(9600);
}

void loop() {

  digitalWrite(s,HIGH);
  a = analogRead(r);

  analogWrite(l,a);
  Serial.println(a);
}
