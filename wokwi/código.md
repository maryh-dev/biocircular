#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <HX711.h>
#include <math.h>

// ==================================================
// 1. CONFIGURACOES WIFI
// ==================================================

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// ==================================================
// 2. CONFIGURACOES FIREBASE
// ==================================================

#define FIREBASE_API_KEY "COLE_AQUI_A_API_KEY_DO_SEU_PROJETO"

#define FIREBASE_DATABASE_URL "URL_DO_REALTIME_DATABASE"

#define FIREBASE_EMAIL "EMAIL_DA_CONTA_DO_DISPOSITIVO"
#define FIREBASE_PASSWORD "SENHA_DA_CONTA_DO_DISPOSITIVO"

#define BOMBONA_ID "BOM-001"

// true = simulacao no Wokwi
// false = ESP32 fisico
#define MODO_SIMULACAO true

// ==================================================
// 3. PINOS ESP32-S2 MINI
// ==================================================
// HC-SR04:  Trig -> GPIO16, Echo -> GPIO17
// HX711:     DT  -> GPIO14, SCK -> GPIO15
// Boia:      GPIO18

#define TRIG_PIN 16
#define ECHO_PIN 17

#define HX711_DT 14
#define HX711_SCK 15

#define BOIA_PIN 18

// ==================================================
// 4. PARAMETROS DA BOMBONA
// ==================================================

const float CAPACIDADE_LITROS = 50.0;
const float DENSIDADE_OLEO = 0.92;

// Distancias de calibracao (HC-SR04)
const float DISTANCIA_VAZIO = 56.0;   // bombona vazia
const float DISTANCIA_CHEIO = 5.0;
const float DISTANCIA_BOIA = 51.0;  // nivel da boia de seguranca

// Wokwi: slider 26 kg liia ~1,73 kg com escala 420 -> ~28
const float FATOR_CALIBRACAO =
  MODO_SIMULACAO ? 27.95f : 420.0f;

// Diferenca maxima entre os sensores
const float TOLERANCIA = 20.0;

const unsigned long INTERVALO_LEITURA = 2000;
const unsigned long INTERVALO_ENVIO = 10000;

// Renovar token antes de 1 hora
const unsigned long INTERVALO_TOKEN = 3000000UL;

// ==================================================
// 5. VARIAVEIS GLOBAIS
// ==================================================

HX711 balanca;

String firebaseToken = "";
String refreshToken = "";

unsigned long ultimoToken = 0;
unsigned long ultimaLeitura = 0;
unsigned long ultimoEnvio = 0;

bool hxPronto = false;

float distancia = -1;
float peso = -1;
float ultimoPesoValido = -1;

float litrosPeso = -1;
float litrosUltrassom = -1;

float nivelPeso = -1;
float nivelUltrassom = -1;
float nivelFinal = -1;

bool boiaAcionada = false;
bool boiaCritica = false;
bool divergencia = false;

String statusBombona = "INICIALIZANDO";
String origemNivel = "nenhuma";

// ==================================================
// 6. EXTRAIR CAMPO STRING DE UMA RESPOSTA JSON
// ==================================================

String extrairJSON(
  const String &json,
  const String &campo
) {
  String chave = "\"" + campo + "\"";

  int pos = json.indexOf(chave);

  if (pos < 0) return "";

  pos = json.indexOf(':', pos);

  if (pos < 0) return "";

  pos = json.indexOf('"', pos);

  if (pos < 0) return "";

  int fim = json.indexOf('"', pos + 1);

  if (fim < 0) return "";

  return json.substring(pos + 1, fim);
}

// ==================================================
// 7. CONEXAO WIFI
// ==================================================

bool conectarWiFi() {

  if (WiFi.status() == WL_CONNECTED) {
    return true;
  }

  Serial.print("Conectando ao WiFi");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long inicio = millis();

  while (
    WiFi.status() != WL_CONNECTED &&
    millis() - inicio < 15000
  ) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("WiFi conectado!");
    Serial.print("Endereco IP: ");
    Serial.println(WiFi.localIP());

    return true;
  }

  Serial.println("Erro: WiFi indisponivel.");

  return false;
}

// ==================================================
// 8. LOGIN FIREBASE COM EMAIL E SENHA
// ==================================================

bool autenticarFirebase() {

  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  WiFiClientSecure client;

  // Somente para a simulacao.
  // Na producao, validar certificado TLS.
  client.setInsecure();

  HTTPClient http;

  String url =
    "https://identitytoolkit.googleapis.com/v1/"
    "accounts:signInWithPassword?key=" +
    String(FIREBASE_API_KEY);

  if (!http.begin(client, url)) {
    Serial.println("Falha ao iniciar login HTTPS.");
    return false;
  }

  http.setTimeout(10000);

  http.addHeader(
    "Content-Type",
    "application/json"
  );

  String dados = "{";

  dados += "\"email\":\"";
  dados += FIREBASE_EMAIL;
  dados += "\",";

  dados += "\"password\":\"";
  dados += FIREBASE_PASSWORD;
  dados += "\",";

  dados += "\"returnSecureToken\":true";

  dados += "}";

  Serial.println("Autenticando no Firebase...");

  int codigo = http.POST(dados);

  String resposta = http.getString();

  http.end();

  if (codigo != 200) {

    Serial.printf(
      "Erro de autenticacao HTTP: %d\n",
      codigo
    );

    Serial.println(resposta);

    return false;
  }

  firebaseToken = extrairJSON(
    resposta,
    "idToken"
  );

  refreshToken = extrairJSON(
    resposta,
    "refreshToken"
  );

  if (firebaseToken.length() == 0) {

    Serial.println("Token nao encontrado.");

    return false;
  }

  ultimoToken = millis();

  Serial.println("Firebase autenticado com sucesso!");

  return true;
}

// ==================================================
// 9. RENOVAR TOKEN FIREBASE
// ==================================================

bool renovarToken() {

  if (refreshToken.length() == 0) {
    return autenticarFirebase();
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;

  String url =
    "https://securetoken.googleapis.com/v1/"
    "token?key=" +
    String(FIREBASE_API_KEY);

  if (!http.begin(client, url)) {
    return false;
  }

  http.setTimeout(10000);

  http.addHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  String dados =
    "grant_type=refresh_token&refresh_token=" +
    refreshToken;

  int codigo = http.POST(dados);

  String resposta = http.getString();

  http.end();

  if (codigo != 200) {

    Serial.printf(
      "Falha ao renovar token: %d\n",
      codigo
    );

    firebaseToken = "";
    refreshToken = "";

    return false;
  }

  firebaseToken = extrairJSON(
    resposta,
    "access_token"
  );

  String novoRefresh = extrairJSON(
    resposta,
    "refresh_token"
  );

  if (novoRefresh.length() > 0) {
    refreshToken = novoRefresh;
  }

  ultimoToken = millis();

  Serial.println("Token Firebase renovado.");

  return firebaseToken.length() > 0;
}

// ==================================================
// 10. VERIFICAR AUTENTICACAO
// ==================================================

bool verificarFirebase() {

  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  if (
    firebaseToken.length() == 0 ||
    millis() - ultimoToken >= INTERVALO_TOKEN
  ) {
    return renovarToken();
  }

  return true;
}

// ==================================================
// 11. LEITURA HC-SR04
// ==================================================

float lerDistancia() {

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  unsigned long tempo =
    pulseIn(ECHO_PIN, HIGH, 30000);

  if (tempo == 0) {
    return -1;
  }

  float distanciaCM =
    tempo * 0.0343 / 2.0;

  if (
    distanciaCM > DISTANCIA_VAZIO + 2.0f ||
    distanciaCM < DISTANCIA_CHEIO - 1.0f
  ) {
    return -1;
  }

  return distanciaCM;
}

// ==================================================
// 12. CALCULAR NIVEL PELO ULTRASSOM
// ==================================================

float calcularNivelUltrassom(float d) {

  if (d < 0) {
    return -1;
  }

  if (d > DISTANCIA_VAZIO + 1.0f) {
    return -1;
  }

  float alturaUtil =
    DISTANCIA_VAZIO - DISTANCIA_CHEIO;

  if (alturaUtil <= 0) {
    return -1;
  }

  float percentual =
    ((DISTANCIA_VAZIO - d) / alturaUtil)
    * 100.0;

  return constrain(
    percentual,
    0.0,
    100.0
  );
}

// ==================================================
// 13. LEITURA HX711 - SENSOR PRINCIPAL
// ==================================================

float lerPeso() {

  if (!hxPronto) {
    return -1;
  }

  for (int t = 0; t < 10; t++) {
    if (!balanca.wait_ready_timeout(900)) {
      delay(50);
      continue;
    }

    float valor = balanca.get_units(5);

    if (!isfinite(valor)) {
      continue;
    }

    if (valor < 0 && valor > -0.5f) {
      valor = 0;
    }

    if (valor < 0) {
      continue;
    }

    return valor;
  }

  return -1;
}

// ==================================================
// 14. LEITURA BOIA
// ==================================================

bool lerBoia() {

  // INPUT_PULLUP:
  // LOW  = contato fechado = boia acionada
  // HIGH = contato aberto = nivel nao atingido

  return digitalRead(BOIA_PIN) == LOW;
}

// ==================================================
// 15. CLASSIFICACAO DE STATUS
// ==================================================

String classificarStatus() {

  if (boiaCritica) {
    return "CRITICO_BOIA";
  }

  if (nivelFinal < 0) {
    return "ERRO_SENSOR";
  }

  if (nivelFinal >= 90) {
    return "CRITICO";
  }

  if (nivelFinal >= 75) {
    return "ATENCAO";
  }

  return "NORMAL";
}

// ==================================================
// 16. REALIZAR LEITURAS
// ==================================================

void realizarLeituras() {

  // SENSOR SECUNDARIO: HC-SR04
  distancia = lerDistancia();

  nivelUltrassom =
    calcularNivelUltrassom(distancia);

  litrosUltrassom = -1;

  if (nivelUltrassom >= 0) {

    litrosUltrassom =
      CAPACIDADE_LITROS *
      nivelUltrassom / 100.0;
  }

  // SENSOR PRINCIPAL: HX711
  peso = lerPeso();

  litrosPeso = -1;
  nivelPeso = -1;

  if (peso >= 0) {

    ultimoPesoValido = peso;

    litrosPeso =
      peso / DENSIDADE_OLEO;

    nivelPeso = constrain(
      litrosPeso / CAPACIDADE_LITROS * 100.0,
      0.0,
      100.0
    );
  }

  // Boia: interruptor (GPIO18) OU ultrassom <= 51 cm (oleo atingiu a boia)
  bool boiaHardware = lerBoia();
  bool boiaPorDistancia =
    distancia >= 0 && distancia <= DISTANCIA_BOIA;

  boiaAcionada = boiaHardware || boiaPorDistancia;

  // Status critico por boia: HW sempre; por distancia so com nivel alto (evita falso maximo)
  boiaCritica =
    boiaHardware ||
    (boiaPorDistancia && nivelUltrassom >= 90.0f);

  // PESO TEM PRIORIDADE
  nivelFinal = nivelPeso;
  origemNivel = "hx711";

  // SE PESO FALHAR, USAR ULTRASSOM
  if (nivelFinal < 0) {

    nivelFinal = nivelUltrassom;
    origemNivel = "ultrassom";
  }

  if (nivelFinal < 0) {
    origemNivel = "nenhuma";
  }

  // VERIFICAR DIVERGENCIA ENTRE SENSORES
  divergencia = false;

  if (
    nivelPeso >= 0 &&
    nivelUltrassom >= 0
  ) {

    float diferenca =
      fabs(nivelPeso - nivelUltrassom);

    divergencia =
      diferenca > TOLERANCIA;
  }

  statusBombona = classificarStatus();
}

// ==================================================
// 17. EXIBIR LEITURAS NO MONITOR SERIAL
// ==================================================

void mostrarLeituras() {

  Serial.println();
  Serial.println("=================================");
  Serial.println("      MAV - BOM-001");
  Serial.println("=================================");

  Serial.println("[HX711 - SENSOR PRINCIPAL]");

  if (peso >= 0) {

    Serial.printf(
      "Peso: %.2f kg\n",
      peso
    );

    Serial.printf(
      "Volume: %.2f litros\n",
      litrosPeso
    );

    Serial.printf(
      "Ocupacao: %.1f %%\n",
      nivelPeso
    );

  } else {

    Serial.println(
      "Sensor de peso indisponivel."
    );
  }

  Serial.println();
  Serial.println("[HC-SR04 - SENSOR SECUNDARIO]");

  if (distancia >= 0) {

    Serial.printf(
      "Distancia: %.2f cm\n",
      distancia
    );

    Serial.printf(
      "Volume estimado: %.2f litros\n",
      litrosUltrassom
    );

    Serial.printf(
      "Ocupacao: %.1f %%\n",
      nivelUltrassom
    );

  } else {

    Serial.println(
      "Sensor ultrassonico indisponivel."
    );

    if (MODO_SIMULACAO) {
      Serial.println(
        "Wokwi: ajuste o HC-SR04 entre 5 e 56 cm (vazio=56)."
      );
    }
  }

  Serial.println();
  Serial.println("[BOIA - SEGURANCA]");

  if (!boiaAcionada) {
    Serial.println("NIVEL ABAIXO DO LIMITE");
  } else if (boiaCritica) {
    Serial.println("LIMITE MAXIMO ATINGIDO (critico)");
  } else {
    Serial.println(
      "Boia por distancia (<= 51 cm) — monitorar"
    );
  }

  Serial.println();
  Serial.println("[RESULTADO FINAL]");

  Serial.printf(
    "Nivel final: %.1f %%\n",
    nivelFinal
  );

  Serial.print("Origem: ");
  Serial.println(origemNivel);

  Serial.print("Status: ");
  Serial.println(statusBombona);

  if (divergencia) {

    Serial.println(
      "ALERTA: Divergencia entre sensores!"
    );
  }

  if (boiaAcionada) {

    Serial.println(
      "ALERTA: BOIA ACIONADA!"
    );
  }

  Serial.println("=================================");
}

// ==================================================
// 18. MONTAR JSON
// ==================================================

String montarJSON() {

  float pesoEnvio = peso;

  if (pesoEnvio < 0 && ultimoPesoValido >= 0) {
    pesoEnvio = ultimoPesoValido;
  }

  float litrosEnvio = litrosPeso;
  float nivelPesoEnvio = nivelPeso;
  float nivelFinalEnvio = nivelFinal;
  String origemEnvio = origemNivel;

  if (pesoEnvio >= 0 && peso < 0) {
    litrosEnvio = pesoEnvio / DENSIDADE_OLEO;
    nivelPesoEnvio = constrain(
      litrosEnvio / CAPACIDADE_LITROS * 100.0f,
      0.0f,
      100.0f
    );
    nivelFinalEnvio = nivelPesoEnvio;
    origemEnvio = "hx711";
  }

  String json = "{";

  json += "\"id\":\"";
  json += BOMBONA_ID;
  json += "\",";

  json += "\"capacidade_litros\":";
  json += String(CAPACIDADE_LITROS, 1);
  json += ",";

  if (pesoEnvio >= 0) {
    json += "\"peso_kg\":";
    json += String(pesoEnvio, 2);
    json += ",";

    json += "\"litros_peso\":";
    json += String(litrosEnvio, 2);
    json += ",";

    json += "\"nivel_peso\":";
    json += String(nivelPesoEnvio, 1);
    json += ",";
  }

  json += "\"distancia_cm\":";
  json += String(distancia, 2);
  json += ",";

  json += "\"litros_ultrassom\":";
  json += String(litrosUltrassom, 2);
  json += ",";

  json += "\"nivel_ultrassom\":";
  json += String(nivelUltrassom, 1);
  json += ",";

  if (nivelFinalEnvio >= 0) {
    json += "\"nivel_final\":";
    json += String(nivelFinalEnvio, 1);
    json += ",";

    json += "\"origem_nivel\":\"";
    json += origemEnvio;
    json += "\",";
  }

  json += "\"boia_acionada\":";
  json += boiaAcionada ? "true," : "false,";

  json += "\"divergencia\":";
  json += divergencia ? "true," : "false,";

  json += "\"status\":\"";
  json += statusBombona;
  json += "\",";

  json += "\"simulado\":";
  json += MODO_SIMULACAO ? "true," : "false,";

  // Timestamp gerado pelo Firebase
  json += "\"ultima_atualizacao\":";
  json += "{\".sv\":\"timestamp\"}";

  json += "}";

  return json;
}

// ==================================================
// 19. ENVIAR FIREBASE POR REST API
// ==================================================

void enviarFirebase() {

  // HX711 e sensivel: ler ANTES de HTTPS/WiFi ocupar o radio
  realizarLeituras();

  if (!conectarWiFi()) {

    Serial.println(
      "Envio cancelado: sem WiFi."
    );

    return;
  }

  if (!verificarFirebase()) {

    Serial.println(
      "Envio cancelado: sem autenticacao."
    );

    return;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;

  String url =
    String(FIREBASE_DATABASE_URL) +
    "/bombonas/" +
    String(BOMBONA_ID) +
    ".json?auth=" +
    firebaseToken;

  if (!http.begin(client, url)) {

    Serial.println(
      "Erro ao iniciar HTTP."
    );

    return;
  }

  http.setTimeout(10000);

  http.addHeader(
    "Content-Type",
    "application/json"
  );

  String json = montarJSON();

  Serial.println();
  Serial.println("Enviando dados ao Firebase...");

  if (peso < 0 && ultimoPesoValido < 0) {
    Serial.println(
      "Aviso: peso indisponivel neste envio (HX711)."
    );
  }

  int codigo = http.PATCH(json);

  if (codigo == 200 || codigo == 204) {

    Serial.println(
      "Firebase atualizado com sucesso!"
    );

  } else {

    Serial.printf(
      "Erro Firebase HTTP: %d\n",
      codigo
    );

    Serial.println(http.getString());

    if (codigo == 401) {
      firebaseToken = "";
    }
  }

  http.end();
}

// ==================================================
// 20. SETUP
// ==================================================

void setup() {

  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("=================================");
  Serial.println(" MAV - MONITORAMENTO DE OLEO");
  Serial.println(" ESP32-S2 MINI");
  Serial.println(" BOMBONA BOM-001");
  Serial.println("=================================");

  // CONFIGURAR HC-SR04
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  digitalWrite(TRIG_PIN, LOW);

  // CONFIGURAR BOIA
  pinMode(BOIA_PIN, INPUT_PULLUP);

  // CONFIGURAR HX711
  balanca.begin(
    HX711_DT,
    HX711_SCK
  );

  if (balanca.wait_ready_timeout(3000)) {

    hxPronto = true;

    // Tara com escala neutra; calibracao depois da tara.
    balanca.set_scale(1.0f);
    balanca.tare(15);
    delay(300);
    balanca.set_scale(FATOR_CALIBRACAO);

    Serial.println(
      "HX711 inicializado."
    );

  } else {

    Serial.println(
      "Falha ao inicializar HX711."
    );
  }

  // CONECTAR A INTERNET
  if (conectarWiFi()) {
    autenticarFirebase();
  }

  // PRIMEIRA LEITURA
  realizarLeituras();
  mostrarLeituras();

  // PRIMEIRO ENVIO
  enviarFirebase();

  ultimaLeitura = millis();
  ultimoEnvio = millis();

  Serial.println("Sistema iniciado!");
}

// ==================================================
// 21. LOOP PRINCIPAL
// ==================================================

void loop() {

  unsigned long agora = millis();

  // LER SENSORES A CADA 2 SEGUNDOS
  if (
    agora - ultimaLeitura >=
    INTERVALO_LEITURA
  ) {

    ultimaLeitura = agora;

    realizarLeituras();
    mostrarLeituras();
  }

  // ATUALIZAR FIREBASE A CADA 10 SEGUNDOS
  if (
    agora - ultimoEnvio >=
    INTERVALO_ENVIO
  ) {

    ultimoEnvio = agora;

    enviarFirebase();
  }

  delay(20);
}
