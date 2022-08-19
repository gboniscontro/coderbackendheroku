const socket = io.connect();

function render(data) {
  const html = data
    .map((elem) => {
      return `<div>
      <em style="color:red">${new Date(elem.time).toLocaleString('es-AR')}</em>
            <img width=30px src="/img/avatar.png">
            <strong style="color:blue">${elem.author.id}</strong> 
            
            <em style="color:green">${elem.message}</em>
            
        </div>`;
    })
    .join('');
  document.getElementById('messages').innerHTML = html;
}

socket.on('messages', (data) => {
  console.log('mensaje');
  console.log(data);
  const messages = data; //esto muy importante porque el formato no es como json requerido
  const author = new normalizr.schema.Entity('author');
  const messageSchema = new normalizr.schema.Entity(
    'mensaje',
    {
      author: author,
    },
    { idAttribute: '_id' },
  );
  const post = new normalizr.schema.Entity('post', {
    messages: [messageSchema],
  });
  //const temp = { id: 'mensajes', messages }

  const mensajesData = normalizr.denormalize(messages.result, post, messages.entities);
  //const porc = Math.floor(-100 + (JSON.stringify(data).length * 100) / JSON.stringify(mensajesData.messages).length)

  // document.getElementById('compresion').innerText = porc
  console.log(mensajesData.messages);
  render(mensajesData.messages);
});

function addMessage(e) {
  const mensaje = {
    author: {
      id: document.getElementById('username').value,
      nombre: document.getElementById('nombre').value,
    },
    message: document.getElementById('texto').value,
    time: +new Date(),
  };
  socket.emit('new-message', mensaje);
  document.getElementById('texto').value = '';

  return false;
}
