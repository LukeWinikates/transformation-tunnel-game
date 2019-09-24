
const init = (rootNode) => {
  const items = [
    {
      id: 'elixir',
      audio: '/audio/elixir.m4a',
      introText: 'a wizard was trying to decipher a recipe for a mysterious ELIXIR',
      initialWord: 'elixir',
      finalWord: 'cyrillic',
      emoji:'🧙‍♂️⚗️',
      transitions: ['elixir','elixir','elixir','xerilic','xerilic','xerillic', 'cyrillic'],
      finalText: 'the recipe is in CYRILLIC!'
    },
    {
      id: 'pasta',
      introText: 'a chef had been making PASTA all day and wanted to cook something different',
      initialWord: 'pasta',
      finalWord: 'tapas',
      emoji:'👨‍🍳🍝🇮🇹',
      finalEmoji:'👨‍🍳🥘🇪🇸',
      transitions: ['pasta','pasta','apast','apast','apast','tapas','tapas','tapas'],
      finalText: 'I can freshen things up by making lots of tasty TAPAS!'

    },
    {
      id: 'engine',
      introText: 'a farmer was having trouble with the ENGINE of their car',  // ninja appears to deliver the package.
      emoji: '👨‍🌾🚚🆘',
      finalEmoji: '😮👤🏯',
      finalWord: 'ninja',
      transitions: ['engine','engine','engin','enjin','njine','ninja','ninja'],
      finalText: "I can hire a NINJA to deliver the crops and nobody will know it wasn't me!"
    }
    // eclipsed -> lipstick
  ];

  let state = {
    titleScreenVisible: true,
    panelVisible: false,
    cameraPosition: {x: 0, y: 0},
  };
  const render = () => {
    return [
      Portal(),
      state.titleScreenVisible && Title(),
      state.panelVisible && ButtonPanel()
    ].filter(i => !!i);
  };

  const ItemButton = (item) => {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(item.emoji.slice(0,5)));
    button.onclick = () => {
      // approach;
      // pan
      // enter
      // can translucency be a gradient?
      // emerge out the far end
      // lots of request animation frame

    };
    return button;
  };

  const ButtonPanel = () => {
    let panel = document.createElement('div');
    panel.classList.add('button-panel');
    let characterButtons = items.map(ItemButton);
    for (let i = 0; i<characterButtons.length ; i++) {
      panel.appendChild(characterButtons[i]);
    }
    return panel;
  };

  const Title = () => {
    let panel = document.createElement('div');
    panel.classList.add('title-panel');
    panel.appendChild(P('A mysterious portal has opened in a quiet village...'));
    panel.appendChild(P('when villagers wander in, they think they\'re talking about one thing, but end up saying something else'));
    panel.appendChild(Button('Start', () => {
      state = {
        ...state,
        titleScreenVisible: false,
        panelVisible: true,
      };
      draw();
    }));
    panel.appendChild(P('Inspired by the henshin tunnel series by AKIYAMA TADASHI'));
    panel.appendChild(P('Special thanks to CMU Pronouncing Dictionary, PostgreSQL, Array#rotate'));
    return panel;
  };

  const Audio = (url) => {
    let node = document.createElement('audio');
    node.src = url;
    node.controls = false;
    node.autoplay = true;
    return node;
  };

  const P = (text) => {
    let p = document.createElement('p');
    p.appendChild(document.createTextNode(text));
    return p;
  };

  const Button = (text, onClick) => {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(text));
    button.onclick = onClick;
    return button;
  };

  const clear = (node) => {
    [...node.childNodes].map(e => node.removeChild(e));
  };

  const Portal = () => {
    let portal = document.createElement('div');
    portal.classList.add('portal');
    const entrance = document.createElement('div');
    entrance.classList.add('portal-entrance');
    const body = document.createElement('div');
    body.classList.add('portal-body');
    const exit = document.createElement('div');
    exit.classList.add('portal-exit');
    portal.appendChild(entrance);
    portal.appendChild(body);
    portal.appendChild(exit);
    return portal;
  };

  state.nodes = {
    stage: rootNode.querySelector('#stage'),
    root: rootNode,
  };

  const draw = () => {
    let nodes = render();
    clear(state.nodes.stage);
    [...nodes].forEach(n => {
      state.nodes.stage.appendChild(n);
    })
  };

  draw();
};
