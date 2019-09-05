


const scenes = [
  'start', // intro splash blurb
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
    // there's an action to return back to the start by clicking, and this character drops into the starting collection
]

const init = (rootNode) => {
  const items = [
    {
      id: 'elixir',
      introText: 'a wizard was trying to decipher a recipe for a mysterious ELIXIR',
      emoji:'🧙‍♂️⚗️'
    },
    {
      id: 'pasta',
      introText: 'a chef had been making PASTA all day and wanted to cook something different',
      emoji:'👨‍🍳🍝',
    }
    // engine -> ninja
    // eclipsed -> lipstick
  ];

  let state = {};

  const scenes = {
    start: () => {
      return {
        render: () => {
          const {
            narration,
            buttons,
            stage
          } = state.nodes;

          let characterButtons = items.map(ItemButton);
          for (let i = 0; i<characterButtons.length ; i++) {
            buttons.appendChild(characterButtons[i]);
          }
          narration.classList.add('expanded');
          narration.innerText = 'A mysterious portal has opened in the village...' +
            'what will happen to the villagers who wander in?';

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
            narration,
            buttons
          } = state.nodes;

          narration.innerHTML = item.introText;
          narration.classList.add('expanded');
          stage.classList.add('expanded');
          buttons.classList.add('collapsed');
        }
      }
    },
    transforming: (item) => {
      return {
        render: () => {
          const {
            stage,
            narration
          } = state.nodes;
          narration.innerHTML = "TRANSFORMING";
          stage.querySelector('.portal').classList.add('move-left');
        }
      }
    },
    reveal: () => {
      return {
        render: () => {
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
  state.scene = scenes.start();
  render();
};
