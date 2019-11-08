const init = (rootNode) => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const items = [
    {
      id: 'elixir',
      audio: '/audio/elixir.m4a',
      introText: 'a wizard had been trying to decipher a mysterious tome',
      postIntroText: '"I must discover the secret of the ELIXIR!, but what is this strange WRITING!?"',
      initialWord: 'elixir',
      finalWord: 'cyrillic',
      characterEmoji: '🧙‍♂',
      initialThoughtEmoji: '⚗️📕',
      finalThoughtEmoji: '',
      transitions: ['elixir', 'elixir', 'elikzir', 'zerilic', 'xerilic?', 'xerillic', 'cyrillic', 'cyrillic'],
      finalText: '"Of course! The recipe is in CYRILLIC!"'
    },
    {
      id: 'pasta',
      introText: 'a chef was feeling down about always making the same dishes',
      postIntroText: '"I just feel like all I make these days is PASTA!"',
      initialWord: 'pasta',
      finalWord: 'tapas',
      characterEmoji: '👨‍🍳',
      initialThoughtEmoji: '🍝🇮🇹',
      finalThoughtEmoji: '🥘🇪🇸',
      transitions: ['pasta', 'pasta', 'apast', 'apast', 'apast', 'tapas', 'tapas', 'tapas'],
      finalText: '"I can freshen things up by making lots of tasty TAPAS!"'

    },
    {
      id: 'engine',
      introText: 'a farmer was having trouble with the ENGINE of their car',  // ninja appears to deliver the package.
      postIntroText: '"I need to get these veggies to market, but this darn ENGINE!"',
      characterEmoji: '👨‍🌾',
      initialThoughtEmoji: '🚚🆘',
      finalThoughtEmoji: '👤🏯',
      finalWord: 'ninja',
      transitions: ['engine', 'engine', 'engin', 'enjin', 'njine', 'ninja', 'ninja', 'ninja'],
      finalText: '"I can hire a NINJA to deliver the crops and nobody will know it wasn\'t me!"'
    }
    // eclipsed -> lipstick
  ];

  const element = (tag, {classList = [], key, ...rest}, children = []) => {
    let e = document.createElement(tag);
    classList.forEach(c => {
      e.classList.add(c);
    });
    children.forEach(c => {
      e.appendChild(c);
    });
    Object.entries(rest).forEach(([attr, val]) => {
      e.setAttribute(attr, val);
    });
    return e;
  };

  const svgElement = (tag, {classList = [], key, svgAttrs = {}, ...rest}, children = []) => {
    let e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    children.forEach(c => {
      e.appendChild(c);
    });
    classList.forEach(c => {
      e.classList.add(c);
    });

    Object.entries(svgAttrs).forEach(([attr, val]) => {
      e.setAttributeNS('http://www.w3.org/1999/xlink', attr, val);
    });
    Object.entries(rest).forEach(([attr, val]) => {
      e.setAttribute(attr, val);
    });
    return e;
  };

  const elementBuilders = (tagNames) => {
    return tagNames.reduce((acc, tagName) => {
      return {
        ...acc,
        [tagName]: (...args) => element.apply(null, [tagName, ...args])
      }
    }, {});
  };

  const svgElementBuilders = (tagNames) => {
    return tagNames.reduce((acc, tagName) => {
      return {
        ...acc,
        [tagName]: (...args) => svgElement.apply(null, [tagName, ...args])
      }
    }, {});
  };

  const {
    div, p, button
  } = elementBuilders(['div', 'p', 'button']);
  const {
    svg, circle, ellipse, rect, g
  } = svgElementBuilders(['svg', 'circle', 'ellipse', 'rect', 'g']);

  const text = (content, opts) => svgElement('text', opts, [document.createTextNode(content)]);

  let positions = {
    characterEntryPoint: {
      x: -50,
      y: 265
    },
    characterPauseLocation: {
      x: 100,
      y: 265
    },
    endOfTunnel: {
      x: 635,
      y: 265
    },
    initialViewBox: [50, 200, 300, 400],
    wordPositions: repeat(8).map(i => {
        return {
          x: 230 + (i * 60),
          y: 240
        }
      }
    )
  };

  let state = {
    titleScreenVisible: true,
    panelVisible: false,
    viewBox: positions.initialViewBox,
    activeStory: null,
    tunnelFillColor: '#e96214',
    character: {
      ...positions.characterEntryPoint
    },
  };

  const panViewBox = () => {
    effects(repeat(650).map(i => {
      return [
        (i + 1) * 5,
        () => {
          [x, y, w, h] = state.viewBox;
          let newViewBox = [i, y, w, h];
          state = {
            ...state,
            viewBox: newViewBox
          };
        }
      ]
    }));
  };

  const flashLighting = color => {
    const lighting = document.querySelector('.lighting-effect');
    lighting.setAttribute('fill', color);
  };

  const strobeTunnel = () => {
    const tunnel = document.querySelectorAll('.tunnel');
    effects(repeat(4).map(i => {
      const base = (i + 1) * 500;
      return [
        [base, () => {
          const newColor = state.tunnelFillColor === '#e2ac22' ? '#e96214' : '#e2ac22';
          state = {
            ...state,
            tunnelFillColor: newColor
          };
          [...tunnel].forEach(e => {
            e.setAttribute('fill', newColor)
          });
          flashLighting(newColor);
        }],
        [base + 100, () => {
          flashLighting('transparent')
        }]
      ]
    }).flat());
  };

  const dropDot = ({x, y}) => {
    let svg = document.querySelector('svg');
    let dot = circle({cx: x, cy: y + 1, r: 3, fill: '#4e493c', classList: ['dropdot']});
    svg.appendChild(dot);
    effects([
      [250, () => dot.setAttribute('r', 2)],
      [500, () => dot.setAttribute('fill', 'transparent')],
      [1000, () => dot.remove()]
    ]);
  };

  function repeat(times) {
    return [...Array(times).keys()];
  }

  const after = (waitTime, steps) => {
    return effects(steps.map(([t, f]) => {
      return [t + waitTime, f]
    }));
  };

  const startScene = () => {
    let showNarration = effects([
      [0, () => narrationText(state.activeStory.introText)],
    ]);

    let moveCharacterIntoScene = after(showNarration + 1500, repeat(165).map(i => {
      return [(i + 1) * 10, () => {
        let character = state.character;
        character.x = character.x + 1;
        state = {
          ...state,
          character
        };
        if (i % 30 === 0) {
          dropDot({x: character.x + 1, y: character.y})
        }
      }];
    }));

    let hideNarration = after(moveCharacterIntoScene, [[0, fadeNarration]]);

    let moveToTunnel = after(hideNarration + 1500, repeat(130).map(i => {
      return [((i + 1) * 10), () => {
        let character = state.character;
        character.x = character.x + 1;
        state = {
          character,
          ...state
        };
        if (i % 30 === 0) {
          dropDot({x: character.x, y: character.y});
        }
      }];
    }));

    let panTheTunnelToEnd = after(moveToTunnel, [[0, () => {
      panViewBox();
      strobeTunnel();
    }]]);

    const svg = document.querySelector('svg');

    let showTheStoryTransitions = after(moveToTunnel,
      repeat(8).map(i => {
        return [(i + 1) * 200, () => {
          svg.appendChild(text(state.activeStory.transitions[i], {'font-size': 12, ...positions.wordPositions[i]}));
        }]
      })
    );

    after(panTheTunnelToEnd, [
      [2500, () => {
        moveCharacterToEndOfTunnel();
        characterExitTunnel();
      }]
    ]);
  };

  const characterExitTunnel = () => {
    let moves = repeat(100).map(i => {
      return [
        (i + 1) * 5,
        () => {
          state = {
            ...state,
            character: {
              ...state.character,
              x: state.character.x + 1
            }
          };
          if (i % 30 === 0) {
            dropDot({x: state.character.x, y: state.character.y})
          }
        }
      ]
    });
    effects([
      ...moves,
      [250, showReturnButton]
    ]);
  };

  const showReturnButton = () => {
    state.nodes.stage.appendChild(ReturnPrompt());
  };

  const moveCharacterToEndOfTunnel = () => {
    state = {
      ...state,
      character: {
        ...state.character,
        ...positions.endOfTunnel
      }
    };
  };

  const render = () => {
    return [
      div({id: 'narration', classList: ['fade']}),
      World(),
      Title({visible: state.titleScreenVisible}),
      ButtonPanel({visible: state.panelVisible})
    ];
  };

  const narrationText = (text) => {
    const narration = state.nodes.stage.querySelector('#narration');
    narration.classList.remove('fade');
    clear(narration);
    narration.appendChild(document.createTextNode(text));
  };

  const fadeNarration = () => {
    const narration = state.nodes.stage.querySelector('#narration');
    narration.classList.add('fade');
  };

  const effects = (effectsList) => {
    return effectsList.map(([timing, f]) => {
      setTimeout(f, timing);
      return {
        time: timing,
      }
    }).reverse()[0].time;
  };

  const ItemButton = (item) => {
    return Button(item.characterEmoji, () => {
      state = {
        ...state,
        panelVisible: false,
        activeStory: item,
      };
      startScene();
    });
  };

  const ButtonPanel = () => {
    return div({
      classList: ['button-panel'].filter(i => !!i)
    }, items.map(ItemButton));
  };

  function reinitialize() {
    state = {
      ...state,
      titleScreenVisible: false,
      panelVisible: true,
      character: positions.characterEntryPoint,
      activeStory: null,
    };
    draw();
  }

  const scrollViewBoxBack = () => {
    let [x, y, w, h] = state.viewBox;
    state = {
      ...state,
      viewBox: [x - 2, y, w, h]
    };

    if (+x > 0) {
      scrollViewBoxBack();
    } else {
      reinitialize();
    }
  };

  const ReturnPrompt = () => {
    return div({classList: ['title-panel']}, [
      Button('Return', () => {
        scrollViewBoxBack();
      })
    ]);
  };

  const zoomViewBoxOut = () => {
    effects(repeat(100).map(i => {
      return [i * 5, () => {
        state = {
          ...state,
          viewBox: [state.viewBox[0], state.viewBox[1] - 1, state.viewBox[2] - 1, state.viewBox[3] + 1]
        };
      }];
    }));
  };

  const Title = () => {
    return div({classList: ['title-panel', 'visible']}, [
      P('A mysterious portal has opened in a quiet village...'),
      P('when villagers wander in, they think they\'re talking about one thing, but end up saying something else'),
      Button('Start', () => {
        state = {
          ...state,
          titleScreenVisible: false,
          panelVisible: true,
        };
        zoomViewBoxOut();
      }),
      P('Inspired by the henshin tunnel series by AKIYAMA TADASHI'),
      P('Special thanks to CMU Pronouncing Dictionary, PostgreSQL, Array#rotate')
    ]);
  };

  const Audio = (url) => {
    let node = document.createElement('audio');
    node.src = url;
    node.controls = false;
    node.autoplay = true;
    return node;
  };

  const P = (text) => {
    return (p({}, [document.createTextNode(text)]));
  };

  const Button = (text, onClick) => {
    let b = button({}, [document.createTextNode(text)]);
    b.onclick = onClick;
    return b;
  };

  const clear = (node) => {
    [...node.childNodes].map(e => node.removeChild(e));
  };

  const viewBoxAttribute = (a) => {
    return a.join(' ');
  };

  const World = () => {
    return svg({height: "500", width: "500", viewBox: viewBoxAttribute(state.viewBox)}, [
      rect({
        classList: ['tunnel'],
        x: 250,
        y: 210,
        height: 80,
        width: 400,
        fill: '#e96214',
      }),
      ellipse({
        classList: ['tunnel'],
        cx: "250",
        cy: "250",
        ry: "39",
        rx: '15',
        fill: '#e96214',
        stroke: '#4e493c',
        'stroke-width': '2',
      }),
      ellipse({
        classList: ['tunnel'],
        cx: "650",
        cy: "250",
        ry: "39",
        rx: '15',
        fill: '#e96214',
        stroke: '#4e493c',
        'stroke-width': '2',
      }),
      text('', {x: state.character.x, y: state.character.y, classList: ['character'], 'font-size': '36px'}),
      rect({classList: ['lighting-effect'], x: -40, y: 0, height: 500, width: 1500, fill: 'transparent'}),
    ].filter(i => !!i));
  };

  state.nodes = {
    stage: rootNode.querySelector('#stage'),
    root: rootNode,
  };

  const updateButtonPanel = visible => {
    let panel = state.nodes.root.querySelector('.button-panel');
    panel.classList[visible ? 'add' : 'remove']('visible');
  };

  const updateTitleScreen = visible => {
    let panel = state.nodes.root.querySelector('.title-panel');
    panel.classList[!visible ? 'add' : 'remove']('hidden');
  };

  const updateCharacter = character => {
    let characterNode = state.nodes.root.querySelector('.character');
    if (state.activeStory) {
      characterNode.textContent = state.activeStory.characterEmoji;
    }
    characterNode.setAttribute('x', character.x);
    characterNode.setAttribute('y', character.y);
  };

  const updateViewBox = viewBox => {
    let svg = state.nodes.root.querySelector('svg');
    if (viewBox.join(' ') === svg.getAttribute('viewBox')) {
      return;
    }
    svg.setAttribute('viewBox', viewBox.join(' '));
  };

  const animate = (timestamp) => {
    state.currentTime = timestamp;
    state.terminated = state.currentTime > state.clockStart + (60 * 1000);
    updateButtonPanel(state.panelVisible);
    updateTitleScreen(state.titleScreenVisible);
    updateViewBox(state.viewBox);
    state.character && updateCharacter(state.character);
    state.terminated || requestAnimationFrame(animate);
  };

  const draw = () => {
    let nodes = render();
    clear(state.nodes.stage);
    [...nodes].forEach(n => {
      state.nodes.stage.appendChild(n);
    });
    requestAnimationFrame(timeStamp => {
      state.clockStart = timeStamp;
      requestAnimationFrame(animate);
    });
  };

  draw();
};
