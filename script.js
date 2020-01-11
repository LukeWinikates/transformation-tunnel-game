const init = (rootNode) => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  window.onerror = (message, source, lineno, colno, error) => {
    console.log("unexpected error");
    console.log(message, source, lineno, colno, error);
    rootNode.appendChild(document.createTextNode(`${message} ${source} ${lineno} ${colno} ${error}`));
  };

  const items = (() => {
    const randomGender = () => {
      return ['👨', '👩'][Math.floor(Math.random() * 2)];
    };

    const randomGenderModifier = () => {
      return ['', '‍♂'][Math.floor(Math.random() * 2)];
    };

    const randomSkinTone = () => {
      return ['🏻', '🏼', '🏽', '🏾', '🏿'][Math.floor(Math.random() * 5)];
    };

    return [
      {
        id: 'elixir',
        audio: '/audio/elixir.m4a',
        introText: 'a wizard had been trying to decipher a mysterious formula',
        postIntroText: '"I must discover the secret of the ELIXIR!, but I can\'t make heads or tails of this strange writing"',
        initialWord: 'elixir',
        characterEmoji: '🧙' + randomSkinTone() + randomGenderModifier(),
        initialThoughtEmoji: ['⚗️', '📕'],
        finalThoughtEmoji: ["Ого!", 'Вот это да!'],
        transitions: [['elix', 'ir'], ['elix', 'ir'], ['elix', 'ir'], ['illic...?', ''], ['cyr', 'illic'], ['cyr', 'illic'], ['cyr', 'illic'], ['cyr', 'illic']],
        finalText: '"Of course! The recipe is in CYRILLIC!"'
      },
      {
        id: 'pasta',
        introText: 'a chef was feeling down about always making the same dishes',
        postIntroText: '"I just feel like all I make these days is PASTA!"',
        initialWord: 'pasta',
        characterEmoji: randomGender() + randomSkinTone() + '‍🍳',
        initialThoughtEmoji: ['🍝', '🇮🇹'],
        finalThoughtEmoji: ['🥘', '🇪🇸'],
        transitions: [['pas', 'ta'], ['pas', 'ta'], ['pas', 'ta'], ['pas', ''], ['ta', 'pas'], ['ta', 'pas'], ['ta', 'pas']],
        finalText: '"I can freshen things up by making lots of tasty TAPAS!"'

      },
      {
        id: 'engine',
        introText: 'a farmer was having trouble with their old truck',
        postIntroText: '"I need to get these veggies to market, but this darn ENGINE is giving me fits"',
        characterEmoji: randomGender() + randomSkinTone() + '‍🌾',
        initialThoughtEmoji: ['🚚', '🆘'],
        finalThoughtEmoji: ['👤', '🏯'],
        transitions: [['en', 'gine'], ['en', 'gine'], ['en', 'gine'], ['nin', 'ja'], ['nin', 'ja'], ['nin', 'ja']],
        finalText: '"I can hire a NINJA to deliver the crops and nobody will know it wasn\'t me!"'
      },
      {
        id: 'lipstick',
        introText: 'a brand strategist was struggling with a name for a new product line',
        postIntroText: '"We need something great to capture the spirit of this monochrome LIPSTICK"',
        characterEmoji: randomGender() + randomSkinTone() + '‍💼',
        initialThoughtEmoji: ['💄', '📊'],
        finalThoughtEmoji: ['🌘', '🖤'],
        transitions: [['lip', 'stick'], ['lip', 'stick'], ['lip', 'stick'], ['lip', 'sed...?'], ['ec', 'lipsed'], ['ec', 'lipsed'], ['ec', 'lipsed!']],
        finalText: '"The matte black is just like when the moon is fully ECLIPSED!"'
      }
    ]
  })();

  const domElements = (() => {
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

    const {
      div, p, button, span, br
    } = elementBuilders(['div', 'p', 'button', 'span', 'br']);
    const {
      svg, circle, ellipse, rect, g, path
    } = svgElementBuilders(['svg', 'circle', 'ellipse', 'rect', 'g', 'path']);
    const text = (content, opts) => svgElement('text', opts, [document.createTextNode(content)]);

    return {
      div, p, button, span, br,
      svg, circle, ellipse, rect, g, path,
      text
    }
  })();

  let positions = {
    characterEntryPoint: {
      x: -100,
      y: 265
    },
    characterPauseLocation: {
      x: 140,
      y: 265
    },
    tunnelEntrance: {
      x: 265,
      y: 265
    },
    endOfTunnel: {
      x: 1035,
      y: 265
    },
    tunnelExitPauseLocation: {
      x: 1115,
      y: 265
    },
    initialViewBox: [80, 200, 300, 400]
  };

  let state = {
    titleScreenVisible: true,
    panelVisible: false,
    viewBox: positions.initialViewBox,
    activeStory: null,
    tunnelFillColor: '#e96214',
    narrationButtonVisible: false,
    character: {
      ...positions.characterEntryPoint
    },
    nextStep: () => {
    },
    nodes: {
      stage: rootNode.querySelector('#stage'),
      root: rootNode,
    }
  };

  const repeat = times => [...Array(times).keys()];

  const reinitialize = () => {
    state = {
      ...state,
      titleScreenVisible: false,
      panelVisible: true,
      character: positions.characterEntryPoint,
      activeStory: null,
    };
    draw();
  };

  const startScene = (() => {
    const panViewBox = () => {
      effects(repeat(900).map(i => {
        return [
          (i + 1) * 7,
          () => {
            [x, y, w, h] = state.viewBox;
            let newViewBox = [x + 1, y, w, h];
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
      effects(repeat(10).map(i => {
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
      let dotLayer = document.querySelector('.dot-layer');
      let dot = domElements.circle({cx: x, cy: y + 1, r: 3, fill: '#4e493c', classList: ['dropdot']});
      dotLayer.appendChild(dot);
      effects([
        [250, () => dot.setAttribute('r', 2)],
        [500, () => dot.setAttribute('fill', 'transparent')],
        [1000, () => dot.remove()]
      ]);
    };

    const after = (waitTime, steps, done = () => {
    }) => {
      return effects(steps.map(([t, f]) => {
        return [t + waitTime, f]
      }), done);
    };

    const dropEmoji = (emoji) => {
      let dotLayer = document.querySelector('.dot-layer');
      let emojiElement = domElements.text(emoji, {x: state.character.x + 10, y: state.character.y - 40});
      dotLayer.appendChild(emojiElement);
      effects([
        [500, () => emojiElement.setAttribute('color', 'transparent')],
        [1000, () => emojiElement.remove()],
      ]);
    };

    const swirlEmojiAroundCharacter = (thoughtEmoji) => {
      effects([
        [0, () => dropEmoji(thoughtEmoji[0])],
        [2000, () => dropEmoji(thoughtEmoji[1])]
      ]);
    };

    const showNarrationButton = () => {
      state = {
        ...state,
        narrationButtonVisible: true
      }
    };

    const hideNarrationButton = () => {
      state = {
        ...state,
        narrationButtonVisible: false
      }
    };

    const moveTo = (f, start, dest, speed) => {
      let distance = (Math.sqrt(Math.pow(Math.abs(dest.x - start.x), 2) + Math.pow(Math.abs(dest.y - start.y), 2)));
      let changeX = (dest.x - start.x) / distance;
      let changeY = (dest.y - start.y) / distance;
      return repeat(distance).map(i => {
          const tickCount = i + 1;
          const animationTime = tickCount * speed;
          const newX = start.x + (tickCount * changeX);
          const newY = start.y + (tickCount * changeY);
          return [animationTime, () => f({
            x: newX,
            y: newY,
            i
          })
          ]
        }
      );
    };

    const moveCharacter = ({x, y, i}) => {
      state = {
        ...state,
        character: {x, y}
      };
      if (i % 30 === 0) {
        dropDot({x, y})
      }
    };

    const narrationText = (text) => {
      const narration = state.nodes.stage.querySelector('#narration');
      narration.classList.remove('fade');
      clear(narration.querySelector('#narration-text'));
      narration.querySelector('#narration-text').appendChild(document.createTextNode(text));
    };

    const fadeNarration = () => {
      const narration = state.nodes.stage.querySelector('#narration');
      narration.classList.add('fade');
    };

    const scrollViewBoxBack = () => {
      let [x, y, w, h] = state.viewBox;
      state = {
        ...state,
        viewBox: [x - 2, y, w, h]
      };

      if (+x > 80) {
        scrollViewBoxBack();
      } else {
        reinitialize();
      }
    };

    return () => {
      state = {
        ...state,
        character: {
          ...positions.characterEntryPoint
        }
      };

      let characterSpeed = 10; // 10px per s

      let step1 = () => {
        hideNarrationButton();
        let showNarration = effects([
          [0, () => narrationText(state.activeStory.introText)],
        ]);
        after(showNarration + 1500, moveTo(moveCharacter, positions.characterEntryPoint, positions.characterPauseLocation, characterSpeed), showNarrationButton);
        state.nextStep = step2;
      };

      // step 1

      let step2 = () => {
        hideNarrationButton();
        after(0, [
          [0, fadeNarration],
          [1000, () => narrationText(state.activeStory.postIntroText)],
          [1500, () => swirlEmojiAroundCharacter(state.activeStory.initialThoughtEmoji)]
        ], showNarrationButton);
        state.nextStep = step3;
      };

      let step3 = () => {
        hideNarrationButton();
        fadeNarration();
        let moveToTunnel = after(1500, moveTo(moveCharacter, positions.characterPauseLocation, positions.tunnelEntrance, characterSpeed));
        let characterExitsTunnel = after(moveToTunnel, moveTo(moveCharacter, positions.tunnelEntrance, positions.tunnelExitPauseLocation, characterSpeed));

        after(moveToTunnel - 500, [[0, () => {
          panViewBox();
          strobeTunnel();
        }]]);

        const topText = state.nodes.root.querySelector('.top-text');
        // const lowerText = state.nodes.root.querySelector('.lower-text');
        let removeClasses = () => {
          [...topText.querySelectorAll('span')].map(el => {
            el.classList.remove('latest-syllable');
          })
        };

        let textAnimations = after(moveToTunnel,
          state.activeStory.transitions.map(([first, second], i) => {
            let baseTime = (i + 1) * 1200;
            let target = topText;
            return [
              [baseTime, () => {
                removeClasses();
                target.appendChild(
                  domElements.span({classList: ["latest-syllable"]},
                    [document.createTextNode(first)]
                  )
                );
              }],
              [baseTime + 400, () => {
                removeClasses();
                target.appendChild(
                  domElements.span({classList: ["latest-syllable"]},
                    [document.createTextNode(second + " ")]
                  )
                );
                if (((i + 1) % 2) === 0) {
                  target.appendChild(domElements.br({}));
                }
              }]
            ]
          }).flat()
        );
        after(textAnimations, [[400, removeClasses]]);

        after(characterExitsTunnel, [
          [1000, () => narrationText(state.activeStory.finalText)],
          [1000, () => swirlEmojiAroundCharacter(state.activeStory.finalThoughtEmoji)],
          [5000, () => {
          }]
        ], showNarrationButton);
        state.nextStep = scrollViewBoxBack;
      };

      step1();
    };
  })();

  const render = (() => {
    function Narration() {
      return domElements.div({id: 'narration', classList: ['fade']}, [
        domElements.span({id: 'narration-text'}),
        Button('next...', () => {
          state.nextStep();
        }, {classList: ['narration-button']})
      ]);
    }

    function TopText() {
      return domElements.div({classList: ['top-text']});
    }

    function LowerText() {
      return domElements.div({classList: ['lower-text']});
    }

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
      return domElements.div({
        classList: ['button-panel'].filter(i => !!i)
      }, items.map(ItemButton));
    };

    const Title = () => {
      return domElements.div({classList: ['title-panel', 'visible']}, [
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
        P('Special thanks to CMU Pronouncing Dictionary, PostgreSQL, Array#rotate, and to my son\'s バーバ  for the play mat that inspired the color palette')
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
      return (domElements.p({}, [document.createTextNode(text)]));
    };

    const Button = (text, onClick, options = {}) => {
      let b = domElements.button(options, [document.createTextNode(text)]);
      b.onclick = onClick;
      return b;
    };

    const World = () => {
      return domElements.svg({viewBox: viewBoxAttribute(state.viewBox)}, [
        domElements.ellipse({
          classList: ['tunnel'],
          cx: "250",
          cy: "250",
          ry: "39",
          rx: '15',
          fill: '#e96214',
          stroke: '#4e493c',
          'stroke-width': '2',
        }),
        domElements.ellipse({
          classList: ['tunnel'],
          cx: "1050",
          cy: "250",
          ry: "39",
          rx: '15',
          fill: '#e96214',
          stroke: '#4e493c',
          'stroke-width': '2',
        }),
        domElements.text('', {
          x: state.character.x,
          y: state.character.y,
          classList: ['character'],
          'font-size': '36px'
        }),
        domElements.g({classList: ['dot-layer']}),
        domElements.path({
          classList: ['tunnel'],
          d: `M 250,211
            A 15,39 0,0,1 250,289
            L 1050,289
            A 15,39 0,0,1 1050,211
            z`,
          fill: '#e96214',
          stroke: '#4e493c',
          'stroke-width': '2'
        }),
        domElements.rect({
          classList: ['lighting-effect'],
          x: -40,
          y: 0,
          height: 1500,
          width: 2000,
          fill: 'transparent'
        }),
      ].filter(i => !!i));
    };

    const viewBoxAttribute = (a) => {
      return a.join(' ');
    };

    const ReturnPrompt = () => {
      return domElements.div({classList: ['title-panel']}, [
        Button('Return', () => {
          scrollViewBoxBack();
        })
      ]);
    };

    return () => {
      return [
        Narration(),
        TopText(),
        World(),
        LowerText(),
        Title({visible: state.titleScreenVisible}),
        ButtonPanel({visible: state.panelVisible})
      ];
    };
  })();

  const effects = (effectsList, done = () => {
  }) => {
    let last = effectsList.reverse()[0];
    return [...effectsList, [last[0], done]].map(([timing, f]) => {
      setTimeout(f, timing);
      return {
        time: timing,
      }
    }).reverse()[0].time;
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

  const clear = (node) => {
    [...node.childNodes].map(e => node.removeChild(e));
  };

  const animate = (() => {
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

    const updateNarrationButton = visible => {
      const button = state.nodes.root.querySelector('.narration-button');
      button.classList[visible ? 'add' : 'remove']('visible');
    };

    const updateViewBox = viewBox => {
      let svg = state.nodes.root.querySelector('svg');
      if (viewBox.join(' ') === svg.getAttribute('viewBox')) {
        return;
      }
      svg.setAttribute('viewBox', viewBox.join(' '));
    };

    return (timestamp) => {
      state.currentTime = timestamp;
      state.terminated = state.currentTime > state.clockStart + (60 * 1000);
      updateButtonPanel(state.panelVisible);
      updateTitleScreen(state.titleScreenVisible);
      updateViewBox(state.viewBox);
      updateNarrationButton(state.narrationButtonVisible);
      state.character && updateCharacter(state.character);
      state.terminated || requestAnimationFrame(animate);
    };
  })();

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
