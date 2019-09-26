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
      transitions: ['engine', 'engine', 'engin', 'enjin', 'njine', 'ninja', 'ninja'],
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
    setTimeout(() => {
      let oldViewBox = svg.getAttribute('viewBox');
      [x, y, w, h] = oldViewBox.split(' ');
      let newViewBox = [i, y, w, h].join(' ');
      svg.setAttribute('viewBox', newViewBox);
      if (i < 500) {
        panViewBox(i + 1);
      } else {
        restoreCharacter();
        moveCharacter(0);
      }
    }, 5);
  };

  const strobeTunnel = (i) => {
    const tunnel = document.querySelectorAll('.tunnel');
    setTimeout(() => {
      [...tunnel].forEach(e => {
        e.setAttribute('fill', e.getAttribute('fill') === '#e2ac22' ? '#e96214' : '#e2ac22')
      });
      if (i < 5) {
        strobeTunnel(i + 1);
      }
    }, 500);
  };

  const dropDot = ({x, y}) => {
    let svg = document.querySelector('svg');
    let dot = circle({cx: x, cy: y + 1, r: 3, fill: '#4e493c', classList: ['dropdot']});
    svg.appendChild(dot);
    setTimeout(() => {
      dot.setAttribute('r', 2);
      setTimeout(() => {
        dot.setAttribute('fill', 'transparent');
        setTimeout(() => {
          dot.remove();
        }, 1000);
      }, 500);
    }, 250);

  };

  const enterCharacter = (i) => {
    const character = document.querySelector('.character');
    setTimeout(() => {
      character.setAttribute('x', +character.getAttribute('x') + 1);
      if (i < 295) {
        enterCharacter(i + 1);
        if (i % 30 === 0) {
          dropDot({x: +character.getAttribute('x') + 1, y: +character.getAttribute('y')})
        }
      } else {
        character.remove();
        panViewBox(0);
        strobeTunnel(0);
      }
    }, 10);
  };

  const moveCharacter = (i) => {
    const character = document.querySelector('.character');
    setTimeout(() => {
      character.setAttribute('x', +character.getAttribute('x') + 1);
      if (i < 60) {
        moveCharacter(i + 1);
        if (i % 30 === 0) {
          dropDot({x: +character.getAttribute('x') + 1, y: +character.getAttribute('y')})
        }
      } else {
        showReturnButton();
      }
    }, 5);
  };

  const showReturnButton = () => {
    state.nodes.stage.appendChild(ReturnPrompt());
  };

  const restoreCharacter = () => {
    const svg = document.querySelector('svg');
    let character = text(state.character, {x: 635, y: 265, classList: ['character'], 'font-size': '36px'});
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

  const narrations = (narrationsList) => {
    narrationsList.map(([timing, f]) => {
      setTimeout(f, timing);
    });
  };

  const ItemButton = (item) => {
    return Button(item.emoji.slice(0, 5), () => {
      state = {
        ...state,
        panelVisible: false,
        character: item.characterEmoji,
      };
      draw();
      enterCharacter(0);
      narrations([
        [1500, () => narrationText(item.introText)],
        [5000, fadeNarration],
        [7000, () => narrationText(item.finalText)],
        [10000, fadeNarration],
      ])
      // approach;
      // pan
      // enter
      // can translucency be a gradient?
      // emerge out the far end
      // lots of request animation frame
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
      let newViewBox = [x - 1, y, w, h].join(' ');
      svg.setAttribute('viewBox', newViewBox);
      if (+x > 0) {
        scrollViewBoxBack();
      } else {
        setTimeout(() => {
          state = {
            ...state,
            titleScreenVisible: false,
            panelVisible: true,
            character: null,
          };
          draw();
        }, 200);
      }
    }, 5);
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
      state.character && text(state.character, {x: -50, y: 265, classList: ['character'], 'font-size': '36px'}),
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
