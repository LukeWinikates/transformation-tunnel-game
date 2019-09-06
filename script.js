


const scenes = [
  'characterSelect', // intro splash blurb
    // possibly have the little emoji characters milling around
    // tap to focus and then can drag?
  'approach', // item moving onto the stage
    // animation of heading text
    // animation of motion
  'transforming', // some kind of effect
    // particle effects
    // grayscale
    // swirling, rotating motion getting faster
    // invisible inside box, box is rotationg,
    // allow some kind of finger-dragging motion?
    // they pull the character 'up' into the tunnel and as they move them through it the sound effect happens, then they drop into the new space
    // a portal of pure sound - some kind of waveform visualization happens, maybe incorporating the emoji, and they get pulled through it
  'reveal', // they've emerged back into the other side
    // there's an action to return back to the characterSelect by clicking, and this character drops into the starting collection
]

const init = (rootNode) => {


  const items = [
    {
      id: 'elixir',
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
      emoji:'👨‍🍳🍝',
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
      //add overlay to root node
      //show splash text
      // homage to henshin tunnel
      // click to continue
    },
    characterSelect: () => {
      return {
        render: () => {
          const {
            buttons,
            stage
          } = state.nodes;

          let characterButtons = items.map(ItemButton);
          for (let i = 0; i<characterButtons.length ; i++) {
            buttons.appendChild(characterButtons[i]);
          }
          setNarration('A mysterious portal has opened in the village...', 1500);
          setTimeout(() => {
            setNarration('what will happen to the villagers who wander in?', 1500);
          }, 1500);
          stage.appendChild(portal())
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
          setNarration(item.finalWord, 1000);
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

  const portal = () => {
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
    narration: rootNode.querySelector('#narration')
  };

  // TODO: make title screen the first screen
  state.scene = scenes.characterSelect();
  render();
};
