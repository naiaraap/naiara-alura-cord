import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZ3hvaWRwcXZjcGRkb3VuY2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU1NTY3NDUsImV4cCI6MTk2MTEzMjc0NX0.LP30glytPM3SyS9ptWk3VpekWHghQRGvSsff043paGU';
const SUPABASE_URL = 'https://dqgxoidpqvcpddouncbb.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
  .from('mensagens')
  .on('INSERT', (respostaLive) => {
    adicionaMensagem(respostaLive.new);
  })
  .subscribe();
}

export default function ChatPage() {
  /* 
  // Usuário
  - Usuário digita no campo texto área
  - Aperta enter para enviar

  //Dev
  - [x] Campo criado
  - [ ] Vamos usar o onChange, usa o useState (ter if pra pra quando 
    o enter é pra limpar a variável)
  - [ ] Lista de mensagens
  */
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  

    // fetch('${SUPABASE_URL}/rest/v1/mensagens?select=+', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'apikey': SUPABASE_ANON_KEY,
    //     'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    //   }
    // })
    // .then((res) => {
    //   returnres.json();
    // })
    // .then((response) => {
    //   console.log(response);
    // });

    // function to deal with non-standard flow (non-standard functions)
    React.useEffect(() => {
      supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', {ascending: false})
      .then(({ data }) => {
        // console.log('Dados do supabase: ', data);
        setListaDeMensagens(data);
      });
      escutaMensagensEmTempoReal((novaMensagem) => {
        setListaDeMensagens((valorAtualDaLista) => {
          return [
            novaMensagem,
             ...valorAtualDaLista,
           ]
        });
      });
    }, []);
  

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de:usuarioLogado,
      texto: novaMensagem,

    };

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {
        // console.log('Criando mensagem: ', data);
        
      });
      
    setMensagem('');
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList mensagens={listaDeMensagens} />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                // console.log(event);
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}

              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            {/* Call back */}
            <ButtonSendSticker 
            onStickerClick={(sticker) => {
              // console.log('usando o componente: ', sticker);
              handleNovaMensagem(':sticker: ' + sticker);
            }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  // console.log(props.listaDeMensagens);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {
        props.mensagens.map((mensagem) => {
          return(
            <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {mensagem.texto.startsWith(":sticker:")
            ? (
              <Image 
              styleSheet={{
                maxWidth: '120px',
                // height: '60px',
                // borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
              }}
              src={mensagem.texto.replace(':sticker:','')} />
            )
            : (mensagem.texto)}
            {/* {mensagem.texto} */}
          </Text>
          )
        })
      }
      {/* {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {mensagem.texto}
          </Text>
        );
      })} */}
    </Box>
  )
}
