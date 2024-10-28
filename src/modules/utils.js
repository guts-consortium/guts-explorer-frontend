/*************/
// Functions //
/*************/

export async function checkFileExists(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export function downloadArrayAsFormat(arr, format = 'json', filename){
  var dataStr;
  if (format == 'json') {
    dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arr));
  }
  if (format == 'csv') {
    dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(getCSVfromArray(arr));
  }
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename + "." + format);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function makeReadable(input) {
  input = input.toString()
  // capitalize first letter
  var output = input.charAt(0).toUpperCase() + input.slice(1)
  // Replace underscores and dashes with space
  output = output.replace(/_/g,' ');
  output = output.replace(/-/g,' ');
  return output
}

export function addAlphaToHex(hexcode, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return hexcode + _opacity.toString(16).toUpperCase();
}

export function getCSVfromArray(arr) {
  const replacer = (key, value) => value === null ? '' : value
  for (var i=0; i<arr.length; i++) {
    row = arr[i]
    delete row['respondents'];
    delete row['cohorts'];
    delete row['ecc_waves'];
    delete row['mcc_waves'];
    if (row.keywords) { row['keywords'] = row['keywords'].join(';')}
    if (row.doi) { row['doi'] = row['doi'].join(';')}
  }
  const header = Object.keys(arr[0])
  const csv = [
    header.join(','),
    ...arr.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')
  return csv
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}