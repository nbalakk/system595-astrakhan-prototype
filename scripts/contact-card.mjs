// Fold on UTF-8 character boundaries so phone address books can unfold the card.
function foldLine(line) {
  const lines = [];
  let current = '';
  let bytes = 0;
  for (const character of line) {
    const size = Buffer.byteLength(character);
    if (bytes + size > 75) {
      lines.push(current);
      current = ' ';
      bytes = 1;
    }
    current += character;
    bytes += size;
  }
  lines.push(current);
  return lines.join('\r\n');
}

function textField(value) {
  return value.replaceAll('\\', '\\\\').replace(/\r\n|\r|\n/g, '\\n')
    .replaceAll(';', '\\;').replaceAll(',', '\\,');
}

export function contactCard(centre) {
  const name = textField(centre.name);
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + name,
    'N:' + name + ';;;;',
    'ORG:' + name,
    'X-ABShowAs:COMPANY',
    'TEL;TYPE=WORK,VOICE,PREF:' + centre.phoneHref.slice(4),
    'TEL;TYPE=WORK,VOICE:' + centre.secondaryPhoneHref.slice(4),
    'ADR;TYPE=WORK:;;' + textField(centre.streetAddress) + ';' + textField(centre.city) + ';;;Россия',
    'NOTE:' + textField('Консультант — ' + centre.contact),
    'END:VCARD',
    ''
  ].map(foldLine).join('\r\n');
}
