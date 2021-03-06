const commands = {
  '/say': require('./commands/say'),
  '/approve': require('./commands/approve')
};

function isCommand(message) {
  if (!message.entities) {
    return false;
  }

  return message.entities.some((entity) => {
    return entity.type === 'bot_command'
  });
}

function parseMessage(message) {
  const entity = message.entities[0];
  const text = message.text.split('');
  message.command = text.splice(entity.offset, entity.offset + entity.length).join('');
  if (message.command.indexOf('@') >= 0) {
    message.command = message.command.split('').splice(entity.offset, message.command.indexOf('@')).join('');
  }
  text.shift();
  message.text = text.join('');
  return message;
}

function handler(req, res, done) {
  if (!isCommand(req.body.message)) {
    return done();
  }

  const message = parseMessage(req.body.message);

  console.log(message);

  if (!commands[message.command]) {
    return done();
  }

  const promise = commands[message.command](message);

  promise
    .then(done)
    .catch(console.error);
}

module.exports = handler;
