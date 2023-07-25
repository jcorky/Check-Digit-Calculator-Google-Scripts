function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index.html');
}

function calculateCheckDigit(containers) {
  var results = [];

  for (var j = 0; j < containers.length; j++) {
    var container = containers[j].toUpperCase();

    // Container layout check
    let layout = /^([A-Z]{4})([0-9]{6,7})$/;
    let match = container.match(layout);

    if (!match) {
      results.push(`Error: Container number "${container}" doesn't match the correct format: 4 alpha characters followed by 6-7 numerical characters.`);
      continue;
    }

    let prefix = match[1];
    let numPart = match[2];

    // 4th letter check
    if (prefix[3] === 'Z' || prefix[3] === 'J') {
      results.push(`Error: Invalid fourth letter in container number "${container}". "Z" and "J" are not allowed.`);
      continue;
    }

    // Calculate check digit
    let contLessDigit = prefix + numPart.substring(0, 6); // Use first 6 digits of the numerical part
    var sum = 0;
    for (let i = 0; i < 10; i++) {
      // Map letters to numbers
      let n = contLessDigit.charCodeAt(i);
      n -= n < 58 ? 48 : 55;

      // Numbers 11, 22, 33 are omitted
      n += (n - 1) / 10;

      // Sum of all numbers multiplied by weighting
      sum += n << i;
    }
    let checkDigit = sum % 11 % 10;

    results.push(`${container.substring(0,10)}${checkDigit}`);
  }

  return results;
}
