
const init = (rootNode) => {
  const items = [
    {
      id: 'elixir',
      audio: '/audio/elixir.m4a',
      introText: 'a wizard was trying to decipher a recipe for a mysterious ELIXIR',
      initialWord: 'elixir',
      finalWord: 'cyrillic',
      emoji:'🧙‍♂️⚗️'
    },
    {
      id: 'pasta',
      introText: 'a chef had been making PASTA all day and wanted to cook something different',
      initialWord: 'pasta',
      finalWord: 'tapas',
      emoji:'👨‍🍳🍝🇮🇹',
      finalEmoji:'👨‍🍳🥘🇪🇸',
    },
    {
      id: 'engine',
      introText: 'a driver was having trouble with the ENGINE of their car',
      emoji: '🚗🤔🆘',
      finalEmoji: '😮👤🏯'
    }
    // engine -> ninja
    // eclipsed -> lipstick
  ];


  let state = {};

  const setNarration = (text, millis) => {
    const {
      narration
    } = state.nodes;
    narration.innerText = text;
    narration.classList.add('visible');
    setTimeout(() => {
      narration.classList.remove('visible');
      narration.innerText = null;
    }, millis)
  };

  const scenes = {
    titleScreen: () => {
      return {
        render: () => {
          const {
            stage,
          } = state.nodes;
          stage.appendChild(Portal());
          stage.appendChild(P('A mysterious portal has opened in the village...'));
          stage.appendChild(P('when villagers wander in, they think they\'re talking about one thing, but end up saying something else'));
          stage.appendChild(Button('Start', () => setScene(scenes.characterSelect())));
        }
      }

    },
    characterSelect: () => {
      return {
        render: () => {
          const {
            buttons,
            stage
          } = state.nodes;
          clear(stage);
          clear(buttons);
          let characterButtons = items.map(ItemButton);
          for (let i = 0; i<characterButtons.length ; i++) {
            buttons.appendChild(characterButtons[i]);
          }
          stage.appendChild(Portal())
        }
      }
    },
    approach: (item) => {
      setTimeout(()=> setScene(scenes.transforming(item)), 2500);
      return {
        item,
        render: () => {
          const {
            stage,
            buttons
          } = state.nodes;
          clear(buttons);
          stage.appendChild(Audio(item.audio));
          setNarration(item.introText, 5000);
        }
      }
    },
    transforming: (item) => {
      return {
        render: () => {
          const {
            stage,
          } = state.nodes;
          setNarration(item.initialWord, 1000);
          stage.querySelector('.portal').classList.add('move-left');
          setTimeout(() => {
            setScene(scenes.reveal(item))
          }, 7000);
        }
      }
    },
    reveal: (item) => {
      return {
        render: () => {
          const {
            buttons,
          } = state.nodes;
          setNarration(item.finalWord, 1000);
          buttons.append(Button('Return', () => { setScene(scenes.characterSelect()) }));
          // add a 'restart' button
        }
      }
    }
  };

  const setScene = scene => {
    state.scene = scene;
    render();
  };

  const render = () => {
    state.scene.render();
  };

  const ItemButton = (item) => {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(item.emoji));
    button.onclick = () => setScene(scenes.approach(item));
    return button;
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
    buttons: rootNode.querySelector('#buttons'),
    narration: rootNode.querySelector('#narration'),
    root: rootNode,
  };

  state.scene = scenes.titleScreen();
  render();
};
