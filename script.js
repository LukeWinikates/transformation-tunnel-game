const init = (rootNode) => {
  const items = [
    {
      id: 'elixir',
      audio: '/audio/elixir.m4a',
      introText: 'a wizard was trying to decipher a recipe for a mysterious ELIXIR',
      initialWord: 'elixir',
      finalWord: 'cyrillic',
      characterEmoji: '🧙‍♂',
      emoji: '🧙‍♂️⚗️',
      transitions: ['elixir', 'elixir', 'elixir', 'xerilic', 'xerilic', 'xerillic', 'cyrillic'],
      finalText: '"Of course! The recipe is in CYRILLIC!"'
    },
    {
      id: 'pasta',
      introText: 'a chef had been making PASTA all day and wanted to cook something different',
      initialWord: 'pasta',
      finalWord: 'tapas',
      characterEmoji: '👨‍🍳',
      emoji: '👨‍🍳🍝🇮🇹',
      finalEmoji: '👨‍🍳🥘🇪🇸',
      transitions: ['pasta', 'pasta', 'apast', 'apast', 'apast', 'tapas', 'tapas', 'tapas'],
      finalText: '"I can freshen things up by making lots of tasty TAPAS!"'

    },
    {
      id: 'engine',
      introText: 'a farmer was having trouble with the ENGINE of their car',  // ninja appears to deliver the package.
      characterEmoji: '👨‍🌾',
      emoji: '👨‍🌾🚚🆘',
      finalEmoji: '😮👤🏯',
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
    svg, circle, ellipse, rect
  } = svgElementBuilders(['svg', 'circle', 'ellipse', 'rect']);

  const text = (content, opts) => svgElement('text', opts, [document.createTextNode(content)]);

  let state = {
    titleScreenVisible: true,
    panelVisible: false,
    world: []
  };

  const panViewBox = (i) => {
    const svg = document.querySelector('svg');
    effects(repeat(500).map(i => {
      return [
        (i + 1) * 5,
        () => {
          let oldViewBox = svg.getAttribute('viewBox');
          [x, y, w, h] = oldViewBox.split(' ');
          let newViewBox = [i, y, w, h].join(' ');
          svg.setAttribute('viewBox', newViewBox);
        }
      ]
    }));
    effects([
      [2500, () => {
        restoreCharacter();
        moveCharacter(0);
      }]
    ]);
  };

  const flashLighting = color => {
    const lighting = document.querySelector('.lighting-effect');
    lighting.setAttribute('fill', color);
  };

  const strobeTunnel = () => {
    const tunnel = document.querySelectorAll('.tunnel');
    effects(repeat(4).map(i => {
      return [
        (i+1)*500, () => {
          [...tunnel].forEach(e => {
            e.setAttribute('fill', e.getAttribute('fill') === '#e2ac22' ? '#e96214' : '#e2ac22')
          })
        }
      ]
    }));
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

  const enterCharacter = () => {
    const character = document.querySelector('.character');
    effects(repeat(295).map(i=> {
      return [(i+1)*10, ()=> {
        character.setAttribute('x', +character.getAttribute('x') + 1);
        if (i % 30 === 0) {
          dropDot({x: +character.getAttribute('x') + 1, y: +character.getAttribute('y')})
        }
      }];
    }));
    effects([
      [2950, ()=> {
        character.remove();
        panViewBox(0);
        strobeTunnel();
        const svg = document.querySelector('svg');
        const startingPosition = 230;
        effects([
          [200, () => {
            svg.appendChild(text(state.character.transitions[0], {'font-size': 12, y: 240, x: startingPosition}))
          }],
          [400, () => {
            svg.appendChild(text(state.character.transitions[1], {'font-size': 12, y: 240, x: startingPosition + 60}))
          }],
          [600, () => {
            svg.appendChild(text(state.character.transitions[2], {'font-size': 12, y: 240, x: startingPosition + 120}))
          }],
          [800, () => {
            svg.appendChild(text(state.character.transitions[3], {'font-size': 12, y: 240, x: startingPosition + 180}))
          }],
          [1000, () => {
            svg.appendChild(text(state.character.transitions[4], {'font-size': 12, y: 240, x: startingPosition + 240}))
          }],
          [1200, () => {
            svg.appendChild(text(state.character.transitions[5], {'font-size': 12, y: 240, x: startingPosition + 300}))
          }],
          [1400, () => {
            svg.appendChild(text(state.character.transitions[6], {'font-size': 12, y: 240, x: startingPosition + 360}))
          }],
          [1600, () => {
            svg.appendChild(text(state.character.transitions[7], {'font-size': 12, y: 240, x: startingPosition + 420}))
          }],
        ]);
        effects([
          [500, () => flashLighting('e96214')],
          [600, () => flashLighting('transparent')],
          [1000, () => flashLighting('e2ac22')],
          [1100, () => flashLighting('transparent')],
          [1500, () => flashLighting('e96214')],
          [1600, () => flashLighting('transparent')],
          [2000, () => flashLighting('e2ac22')],
          [2100, () => flashLighting('transparent')],
          [2500, () => flashLighting('e96214')],
          [2600, () => flashLighting('transparent')],
          // [3000, () => flashLighting('e96214')],
          // [3100, () => flashLighting('transparent')],
        ]);
      }]
    ]);
  };

  const moveCharacter = () => {
    const character = document.querySelector('.character');
    let moves = repeat(50).map(i => {
      return [
        (i+1) *5,
        () => {
          character.setAttribute('x', +character.getAttribute('x') + 1);
          if (i % 30 === 0) {
            dropDot({x: +character.getAttribute('x') + 1, y: +character.getAttribute('y')})
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

  const restoreCharacter = () => {
    const svg = document.querySelector('svg');
    let character = text(state.character.characterEmoji, {x: 635, y: 265, classList: ['character'], 'font-size': '36px'});
    svg.appendChild(character);
  };

  const render = () => {
    return [
      div({id: 'narration', classList: ['fade']}),
      World(),
      state.titleScreenVisible && Title({visible: state.titleScreenVisible}),
      ButtonPanel({visible: state.panelVisible})
    ].filter(i => !!i);
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
    effectsList.map(([timing, f]) => {
      setTimeout(f, timing);
    });
  };

  const ItemButton = (item) => {
    return Button(item.emoji.slice(0, 5), () => {
      state = {
        ...state,
        panelVisible: false,
        character: item,
      };
      draw();
      enterCharacter(0);
      effects([
        [1500, () => narrationText(item.introText)],
        [5000, fadeNarration],
        [7000, () => narrationText(item.finalText)],
        [10000, fadeNarration],
      ])
      // can translucency be a gradient?
    });
  };

  const ButtonPanel = ({visible}) => {
    return div({
      classList: ['button-panel', visible && 'visible'].filter(i => !!i)
    }, items.map(ItemButton));
  };

  const scrollViewBoxBack = () => {
    const svg = document.querySelector('svg');
    setTimeout(() => {
      let oldViewBox = svg.getAttribute('viewBox');
      [x, y, w, h] = oldViewBox.split(' ');
      let newViewBox = [x - 2, y, w, h].join(' ');
      svg.setAttribute('viewBox', newViewBox);
      if (+x > 0) {
        scrollViewBoxBack();
      } else {
        state = {
          ...state,
          titleScreenVisible: false,
          panelVisible: true,
          character: null,
        };
        draw();
      }
    }, 1);
  };

  const ReturnPrompt = () => {
    return div({classList: ['title-panel']}, [
      Button('Return', () => {
        scrollViewBoxBack();
      })
    ]);
  };

  const Title = ({visible}) => {
    return div({classList: ['title-panel']}, [
      P('A mysterious portal has opened in a quiet village...'),
      P('when villagers wander in, they think they\'re talking about one thing, but end up saying something else'),
      Button('Start', () => {
        state = {
          ...state,
          titleScreenVisible: false,
          panelVisible: true,
        };
        draw();
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

  const World = () => {
    return svg({height: "500", width: "500", viewBox: '0 0 300 500'}, [
      rect({
        classList: ['tunnel'],
        x: 250,
        y: 210,
        height: 80,
        width: 400,
        fill: '#e96214',
        // stroke: '#4e493c',
        // 'stroke-width': '2',
      }),
      ellipse({
        classList: ['tunnel'],
        cx: "250",
        cy: "250",
        ry: "38",
        rx: '15',
        fill: '#e96214',
        stroke: '#4e493c',
        'stroke-width': '2',
      }),
      ellipse({
        classList: ['tunnel'],
        cx: "650",
        cy: "250",
        ry: "38",
        rx: '15',
        fill: '#e96214',
        stroke: '#4e493c',
        'stroke-width': '2',
      }),
      state.character && text(state.character.characterEmoji, {x: -50, y: 265, classList: ['character'], 'font-size': '36px'}),
      rect({classList: ['lighting-effect'], x:-40, y:0, height: 500, width:1500, fill: 'transparent'}),
    ].filter(i => !!i));
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
