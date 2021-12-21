const HTMLParser = require('node-html-parser');

const parseIE = root => ({
  user: root.querySelector('.col-md-10 > h1:nth-child(1)')?.text.split(' ')[1],
  num_envio: root.querySelector('.col-md-10 > h2:nth-child(2)')?.text.split(' ')[1],
  fecha: root.querySelector('div.form-group:nth-child(2) > div:nth-child(2) > p:nth-child(1)')?.text,
  problem: root.querySelector('div.form-group:nth-child(3) > div:nth-child(2) > p:nth-child(1)')?.text,
  language: root.querySelector('div.form-group:nth-child(5) > div:nth-child(2) > p:nth-child(1)')?.text,
  veredict: root.querySelector('#submissionVerdictLink')?.text.split(' ').at(-1).slice(1, -1),
  time: undefined,
  memory: undefined, 
  position: undefined,
});

const parseNormal = root => ({
  user: root.querySelector('.col-md-10 > h1:nth-child(1)')?.text.split(' ')[1],
  num_envio: root.querySelector('.col-md-10 > h2:nth-child(2)')?.text.split(' ')[1],
  fecha: root.querySelector('.form-horizontal > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)')?.text,
  problem: root.querySelector('div.form-group:nth-child(2) > div:nth-child(2) > p:nth-child(1)')?.text,
  language: root.querySelector('div.form-group:nth-child(4) > div:nth-child(2) > p:nth-child(1)')?.text,
  veredict: root.querySelector('div.form-group:nth-child(5) > div:nth-child(2) > p:nth-child(1) > a:nth-child(1)')?.text.split(' ').at(-1).slice(1, -1),
  time: root.querySelector('div.form-group:nth-child(6) > div:nth-child(2) > p:nth-child(1)')?.text.split(' ')[0],
  memory: root.querySelector('div.form-group:nth-child(7) > div:nth-child(2) > p:nth-child(1)')?.text.split(' ')[0],
  position: root.querySelector('div.form-group:nth-child(8) > div:nth-child(2) > p:nth-child(1)')?.text.split(' ')[0],
});

const parseDate = date => {
  const [year, month, day, hour, minute, second] = [
    date.slice(6, 10), date.slice(3, 5), date.slice(0, 2), date.slice(12, 14), date.slice(15, 17), date.slice(18, 20)];
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  //return new Date(Date.UTC(year, month - 1, day, hour, minute, second)).getTime();
}

const error_codes = {
  'existe': 401,
  'encontrado': 201,
  undefined: 200,
};

const parseEnvio = envio => {
  console.log('Before html');
  const root = HTMLParser.parse(envio);
  console.log('Before error');
  const error_text = root.querySelector('.alert')?.childNodes[4].text.split(' ').at(-1);
  console.log('Before is ie', error_text);
  const is_ie = root.querySelector('#submissionVerdictGroup');
  console.log('Before parsing', is_ie);

  console.log(root.querySelector('.col-md-10 > h1:nth-child(1)')?.text.split(' ')[1]);
  console.log(root.querySelector('.col-md-10 > h2:nth-child(2)')?.text.split(' ')[1]);
  console.log(root.querySelector('.form-horizontal > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)')?.text);
  console.log(root.querySelector('div.form-group:nth-child(2) > div:nth-child(2) > p:nth-child(1)')?.text);
  console.log(root.querySelector('div.form-group:nth-child(4) > div:nth-child(2) > p:nth-child(1)')?.text);
  console.log(root.querySelector('div.form-group:nth-child(5) > div:nth-child(2) > p:nth-child(1) > a:nth-child(1)')?.text.split(' ').at(-1).slice(1, -1));
  console.log(root.querySelector('div.form-group:nth-child(6) > div:nth-child(2) > p:nth-child(1)')?.text.split(' ')[0]);
  console.log(root.querySelector('div.form-group:nth-child(7) > div:nth-child(2) > p:nth-child(1)')?.text.split(' ')[0]);
  console.log(root.querySelector('div.form-group:nth-child(8) > div:nth-child(2) > p:nth-child(1)')?.text.split(' ')[0]);

  const envio_data = is_ie ? parseIE(root) : parseNormal(root);
  console.log('Before returning');
  return {
    data: {
      ...envio_data,
      num_envio: envio_data.num_envio && Number(envio_data.num_envio),
      fecha: envio_data.fecha && parseDate(envio_data.fecha),
      problem: envio_data.problem && Number(envio_data.problem),
      time: envio_data.time && parseFloat(envio_data.time),
      memory: envio_data.memory && Number(envio_data.memory),
      position: envio_data.position && Number(envio_data.position),
    },
    status: error_codes[error_text],
  };
}
 
module.exports = {
  parseEnvio,
};