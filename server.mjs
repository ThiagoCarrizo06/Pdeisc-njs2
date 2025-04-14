import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { parse } from 'node:url';
import { hoy } from './fecha.mjs';
import { sumar, multiplicar } from './calculo.mjs';
import { saludar } from './saludo.mjs';
import { upperCase } from 'upper-case';

const server = createServer((req, res) => {
  const url = parse(req.url, true);
  const path = url.pathname;

  // Ejercicio 1: 
  if (path === '/') {
    const nombre = 'Lucas';
    const html = `
      <h1>Ejercicio 1: Módulos Propios</h1>
      <p>${saludar(nombre)}</p>
      <p>Fecha actual: ${hoy()}</p>
      <p>5 + 3 = ${sumar(5, 3)}</p>
      <p>5 * 3 = ${multiplicar(5, 3)}</p>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  // Ejercicio 2: 
  else if (path === '/dinamico') {
    readFile('./plantilla.html', 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error al leer el archivo');
        return;
      }

      const contenido = data
        .replace('{{SALUDO}}', saludar('Thiago'))
        .replace('{{FECHA}}', hoy())
        .replace('{{SUMA}}', sumar(5, 3));

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(contenido);
    });
  }

  // Ejercicio 3: 
  else if (path === '/url') {
    const query = url.query;
    const nombre = query.nombre || 'Invitado';

    const html = `
      <h1>Ejercicio 3: Módulo URL</h1>
      <p><strong>Host:</strong> ${req.headers.host}</p>
      <p><strong>Pathname:</strong> ${url.pathname}</p>
      <p><strong>Query:</strong> ${JSON.stringify(query)}</p>
      <p><strong>Parámetro nombre:</strong> ${nombre}</p>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  // Ejercicio 4: 
  else if (path === '/mayusculas') {
    const textos = ['Hola mundo', 'aguante node.js', 'buenos dias'];
    const textosMayus = textos.map(texto => upperCase(texto));

    const html = `
      <h1>Ejercicio 4: upper-case</h1>
      <ul>
        ${textos.map((texto, index) => `
          <li><strong>Texto original:</strong> ${texto} | <strong>Mayúsculas:</strong> ${textosMayus[index]}</li>
        `).join('')}
      </ul>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no válida. Probá con /, /dinamico, /url?nombre=Thiago o /mayusculas');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Servidor corriendo en http://127.0.0.1:3000');
});