#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <Arduino.h>

#define DHTTYPE DHT11 // DHT 11

const char *ssid = "aaaaaaaaaaaaaaaaaaaaaaaa";  // Enter SSID here
const char *password = "bogdan1234"; // Enter Password here
#define SERVER_IP "192.168.96.186"       // IP of the server where you want to send data to

// DHT Sensor
uint8_t DHTPin = D7;
// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE);

float Temperature;
float Humidity;

void setup()
{
  Serial.begin(115200);
  delay(100);

  pinMode(DHTPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  dht.begin();

  Serial.println("Connecting to ");
  Serial.println(ssid);

  // connect to your local wi-fi network
  WiFi.begin(ssid, password);

  // check wi-fi is connected to wi-fi network
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");
  Serial.println(WiFi.localIP());
}
void loop()
{
  // if connected to wifi
  if ((WiFi.status() == WL_CONNECTED))
  {
    Temperature = dht.readTemperature();
    Humidity = dht.readHumidity();

    // blink LED to indicate activity
    digitalWrite(LED_BUILTIN, LOW);
    delay(10);
    digitalWrite(LED_BUILTIN, HIGH);

    WiFiClient client;
    HTTPClient http;
    http.begin(client, "http://" SERVER_IP ":3000/");
    http.addHeader("Content-Type", "application/json");
    if (isnan(Temperature) || isnan(Humidity))
    {
      Serial.println("Failed to read from DHT sensor!");
      delay(30 * 1000);
      return;
    }
    String json = "{\"temp\": " + String(Temperature) + ", \"humidity\": " + String(Humidity) + "}";
    int httpResponseCode = http.POST(json);
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
  // wait for 10 seconds
  delay(5 * 1000);
}