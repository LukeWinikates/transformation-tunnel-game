
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

  let state = {};

  const setNarration = (text, millis) => {
    const {
      narration
    } = state.nodes;
    narration.innerText = text;
    narration.classList.add('visible');
    setTimeout(() => {
      // narration.classList.remove('visible');
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
          stage.appendChild(P('Inspired by the henshin tunnel series by AKIYAMA TADASHI'));
          stage.appendChild(P('Special thanks to CMU Pronouncing Dictionary, PostgreSQL, Array#rotate'));
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
          // clear(buttons);
          let characterButtons = items.map(ItemButton);
          for (let i = 0; i<characterButtons.length ; i++) {
            buttons.appendChild(characterButtons[i]);
          }
          stage.appendChild(Portal())
        }
      }
    },
    approach: (item, button) => {
      setTimeout(()=> setScene(scenes.transforming(item)), 5001);
      return {
        item,
        render: () => {
          const {
            stage,
            buttons
          } = state.nodes;
          button.classList.add('growing');
          [...buttons.children].forEach((b) => {
            if(b !== button) {
              buttons.removeChild(b);
            }
          });
          stage.appendChild(Audio(item.audio));
          setNarration(item.introText, 5000);
        }
      }
    },
    transforming: (item) => {
      return {
        render: () => {
          const {
            narration,
            stage,
          } = state.nodes;
          clear(narration);
          setTimeout(()=> {
            narration.appendChild(ScrollingNarration(item.transitions));
          }, 1);
          stage.querySelector('.portal').classList.add('move-left');
          setTimeout(() => {
            setScene(scenes.reveal(item))
          }, 12000);
        }
      }
    },
    reveal: (item) => {
      return {
        render: () => {
          const {
            buttons,
            narration,
          } = state.nodes;
          clear(narration);
          setNarration(item.finalText, 1000000);
          buttons.append(Button('Return', () => { setScene(scenes.characterSelect()) }));
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
    button.onclick = () => {
      setScene(scenes.approach(item, button));

    };
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

  const ScrollingNarration = (items) => {
    let container = document.createElement('div');
    container.classList.add('scrolling-text');
    items.forEach((item)=> {
      let text = document.createElement('div');
      text.classList.add('scrolling-text-item');
      text.appendChild(document.createTextNode(item));
      container.appendChild(text);
    });
    return container;
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
