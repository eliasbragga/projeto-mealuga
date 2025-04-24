const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const axios = require('axios');
const https = require('https');


async function getDados() {
  console.log('Chamando getDados...');
  const url = 'https://www.olx.com.br/imoveis/aluguel/2-quartos/estado-ce/fortaleza-e-regiao/fortaleza/meireles?sf=1';

  try {
    const browser = await puppeteer.launch({ headless: 'new' }); 
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      request.continue({
        headers: {
          ...request.headers(),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        },
      });
    });

    await page.goto(url, { waitUntil: 'networkidle2' });
    const data = await page.content();
    const $ = cheerio.load(data);
    const anuncios = [];

    $('div.AdCard_content__6tmRg').each((_, el) => {
      const titulo = $(el).find('a.AdCard_link__4c7W6 h2').text().trim();
      const link = $(el).find('a.AdCard_link__4c7W6').attr('href');
      const valorTexto = $(el).find('div.AdCard_mediumbody___f_4r h3').text().trim();
      const atualizado = $(el).find('div.AdCard_locationdate__CaIOt p').text().trim();
      const valorNumerico = parseFloat(valorTexto.replace(/[^\d,]/g, '').replace(',', '.'));

      if (titulo && !isNaN(valorNumerico)) {
        anuncios.push({
          titulo,
          valor: valorTexto,
          valorNumerico,
          atualizado,
          link: link?.startsWith('http') ? link : `https://www.olx.com.br${link}`,
        });
      }
    });

    anuncios.sort((a, b) => a.valorNumerico - b.valorNumerico);
    const maisBarato = anuncios[0];
    console.log('anuncios', anuncios)

    if (!maisBarato) {
      console.log('Nenhum anúncio encontrado.');
      await browser.close();
      return [];
    }

    try {
      await page.goto(maisBarato.link, { waitUntil: 'networkidle2' });
    
      const pageContent = await page.content();
      const $anuncio = cheerio.load(pageContent);
    
      const descricao = $anuncio('span.olx-text.olx-text--body-medium.olx-text--block.olx-text--regular.ad__sc-2mjlki-1.hNWZgC')
        .first()
        .text()
        .trim();
    
      if (descricao) {
        maisBarato.descricao = descricao;
        console.log('📝 Descrição capturada:', descricao);
    
        const contatos = extrairNumerosTelefone(descricao);
    
        maisBarato.contatoAnunciante = contatos;
    
        const descricaoLower = descricao.toLowerCase();
        const whatsAppMatch = contatos.filter(num =>
          descricaoLower.includes(num.slice(-8)) &&
          /(zap|wpp|whatsapp)/.test(descricaoLower)
        );
    
        maisBarato.whatsAppAnunciante = whatsAppMatch;
      } else {
        maisBarato.descricao = 'descrição não encontrada';
        maisBarato.contatoAnunciante = [];
        maisBarato.whatsAppAnunciante = [];
        console.warn('⚠️ Descrição não encontrada na página do anúncio.');
      }
    } catch (msgError) {
      console.warn('❌ Erro ao acessar o anúncio ou capturar a descrição:', msgError.message);
      maisBarato.descricao = 'erro ao verificar';
      maisBarato.contatoAnunciante = [];
      maisBarato.whatsAppAnunciante = [];
    }
    
    
    
    

      async function verificarNumerosNoWhatsapp(numeros, maisBarato) {
        return new Promise((resolve, reject) => {
          if (!numeros || numeros.length === 0) {
            maisBarato.numeroExisteNoWhatsapp = false;
            return resolve(false);
          }

          const instanceId = '3DF98A058A68F029544B8E66062CE0C1';
          const token = '6756CF4439AFCAC13BB7CAB5';
          const clientToken = 'F3ffc274c91024f349b2fb2c0026a0b03S';

          const numerosInternacional = numeros.map(num => {
            const apenasNumeros = num.replace(/\D/g, '');
            return apenasNumeros.length === 11 ? `55${apenasNumeros}` : apenasNumeros;
          });

          const data = JSON.stringify({ phones: numerosInternacional });

          const options = {
            hostname: 'api.z-api.io',
            path: `/instances/${instanceId}/token/${token}/phone-exists-batch`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(data),
              'client-token': clientToken
            }
          };

          const req = https.request(options, res => {
            let chunks = [];

            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
              const body = Buffer.concat(chunks).toString();

              try {
                const resultados = JSON.parse(body);

                const numerosExistentes = resultados
                  .filter(r => r.exists)
                  .map(r => r.inputPhone);

                const existe = numerosExistentes.length > 0;
                maisBarato.numeroExisteNoWhatsapp = existe;

                if (existe) {
                  maisBarato.wppAnunciante = numerosExistentes[0];
                  maisBarato.anuncianteWhatsApp = 'anunciante';
                } else {
                  maisBarato.numerosAnunciante = numerosInternacional;
                }

                console.log('📶 Resultado Z-API - existe no WhatsApp:', existe);
                resolve(existe);
              } catch (e) {
                console.error('❌ Erro ao processar resposta da Z-API:', e.message);
                console.log('Resposta recebida:', body);
                maisBarato.numeroExisteNoWhatsapp = false;
                resolve(false);
              }
            });
          });

          req.on('error', e => {
            console.error('❌ Erro na requisição Z-API:', e.message);
            maisBarato.numeroExisteNoWhatsapp = false;
            resolve(false);
          });

          req.write(data);
          req.end();
        });
      }

    

  function extrairNumerosTelefone(texto) {
  const tokens = texto.split(/\s+/).map(t => t.replace(/[^\d]/g, '')); // limpa os tokens
  const numerosEncontrados = [];

  for (let i = 0; i < tokens.length - 3; i++) {
    const t0 = tokens[i];
    const t1 = tokens[i + 1];
    const t2 = tokens[i + 2];
    const t3 = tokens[i + 3];
    const t4 = tokens[i + 4];

    if (
      (t0.length === 2 || t0.length === 3) &&
      t1 === '9' &&
      t2.length === 4 &&
      t3.length === 4
    ) {
      numerosEncontrados.push(`${t0}${t1}${t2}${t3}`);
    }

    if (
      t0.length === 2 &&
      t1.length === 4 &&
      t2.length === 4
    ) {
      numerosEncontrados.push(`${t0}${t1}${t2}`);
    }

    if (t0.length >= 10 && t0.length <= 13) {
      numerosEncontrados.push(t0);
    }
  }

  const regex = /(\(?\d{2}\)?\s?\d{4,5}[\s.-]?\d{4})/g;
  const matchDireto = texto.match(regex) || [];
  matchDireto.forEach(m => {
    const limpo = m.replace(/[^\d]/g, '');
    if (limpo.length >= 10) {
      numerosEncontrados.push(limpo);
    }
  });

  return [...new Set(numerosEncontrados)];
}

      
    
    
      await verificarNumerosNoWhatsapp(
        [
          ...maisBarato.contatoAnunciante,
          ...maisBarato.whatsAppAnunciante
        ],
        maisBarato
      );

    await enviarEmail(maisBarato);
    console.log('E-mail enviado com sucesso!');
    await browser.close();


    return anuncios;
  } catch (error) {
    console.error('Erro no getDados:', error.message);
    return [];
  }
}

async function enviarEmail(anuncio) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eliasbragga44@gmail.com',
      pass: 'zrrl qsew zarq groy', 
    },
  });

  const contatos = anuncio.contatoAnunciante?.length
    ? anuncio.contatoAnunciante.map(num => `<li>${num}</li>`).join('')
    : '<li>Nenhum contato encontrado</li>';

  let whatsapps;

  if (anuncio.wppAnunciante) {
    whatsapps = `<li>${anuncio.wppAnunciante}</li>`;
  } else if (anuncio.contatoAnunciante?.length) {
    whatsapps = anuncio.contatoAnunciante.map(num => `<li>${num}</li>`).join('');
  } else {
    whatsapps = '<li>Nenhum número com WhatsApp identificado</li>';
  }

  const html = `
    <h2>Anúncio mais barato encontrado</h2>
    <p><strong>Título:</strong> ${anuncio.titulo}</p>
    <p><strong>Valor:</strong> ${anuncio.valor}</p>
    <p><strong>Descrição:</strong> ${anuncio.descricao}</p>
    <p><strong>Atualizado em:</strong> ${anuncio.atualizado}</p>
    <p><strong>Link:</strong> <a href="${anuncio.link}" target="_blank">${anuncio.link}</a></p>
    <hr />
    <h3>📞 Contatos do Anunciante:</h3>
    <ul>${contatos}</ul>
    <h3>💬 WhatsApp do Anunciante:</h3>
    <ul>${whatsapps}</ul>
  `;

  const mailOptions = {
    from: '"OLX Bot 🤖" <eliasbragga44@gmail.com>',
    to: 'eliasbragga44@gmail.com',
    subject: '🏠 Anúncio mais barato encontrado na OLX!',
    html,
  };

  await transporter.sendMail(mailOptions);
}



async function enviarWhatsApp(anuncio) {
  const instanceId = '3DF98A058A68F029544B8E66062CE0C1'; 
  const token = '6756CF4439AFCAC13BB7CAB5';              
  const numero = '5585994446751';                        
  const clientToken = 'F3ffc274c91024f349b2fb2c0026a0b03S'; 

  const mensagem = 
    `🏠 *Anúncio mais barato encontrado na OLX!*\n\n` +
    `*Título:* ${anuncio.titulo}\n` +
    `*Valor:* ${anuncio.valor}\n` +
    `*Atualizado em:* ${anuncio.atualizado}\n` +
    `*Link:* ${anuncio.link}`;

  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        phone: numero,
        message: mensagem,
      },
      {
        headers: {
          'client-token': clientToken,
        },
      }
    );

    console.log('✅ Mensagem enviada para WhatsApp com sucesso!');
    console.log('Resposta da Z-API:', response.data);
  } catch (err) {
    console.error('❌ Erro ao enviar WhatsApp:', err.response?.data || err.message);
  }
}


module.exports = { getDados };