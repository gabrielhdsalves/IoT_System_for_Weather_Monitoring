#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "DHT.h"

// WIFI
const char* ssid = "";
const char* password = "";

// GOOGLE SCRIPT
const char* serverName = "";

// DHT
#define DHTPIN 5
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// TIMER
unsigned long ultimoEnvio = 0;
const unsigned long intervalo = 60000;

void setup() {
  Serial.begin(115200);

  dht.begin();
  delay(2000);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  Serial.println("\nWiFi conectado!");
}

void loop() {

  if (millis() - ultimoEnvio >= intervalo) {

    ultimoEnvio = millis();

    // LEITURA
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
      return;
    }
    // ENVIO
    if (WiFi.status() == WL_CONNECTED) {

      WiFiClientSecure client;
      client.setInsecure();

      HTTPClient http;

      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");

      String json =
        "{\"temperatura\":" + String(t) +
        ",\"umidade\":" + String(h) + "}";

      http.POST(json);

      http.end();
    }
  }
}