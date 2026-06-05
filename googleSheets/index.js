function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([new Date(), data.temperatura, data.umidade]);

  return ContentService.createTextOutput("OK");
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dados = sheet.getDataRange().getValues();

  var dataFiltro = e.parameter.data;
  var minHour = e.parameter.minHour || "00:00";
  var maxHour = e.parameter.maxHour || "23:59";
  var resultado = [];

  for (var i = 1; i < dados.length; i++) {
    var dataLinha = new Date(dados[i][0]);
    if (isNaN(dataLinha.getTime())) continue;

    var ano = dataLinha.getFullYear();
    var mes = ("0" + (dataLinha.getMonth() + 1)).slice(-2);
    var dia = ("0" + dataLinha.getDate()).slice(-2);
    var dataFormatada = ano + "-" + mes + "-" + dia;

    var horas = ("0" + dataLinha.getHours()).slice(-2);
    var minutos = ("0" + dataLinha.getMinutes()).slice(-2);
    var horaFormatada = horas + ":" + minutos;

    if (
      dataFormatada === dataFiltro &&
      horaFormatada >= minHour &&
      horaFormatada <= maxHour
    ) {
      resultado.push({
        data: dados[i][0],
        temperatura: dados[i][1],
        umidade: dados[i][2],
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify(resultado)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
