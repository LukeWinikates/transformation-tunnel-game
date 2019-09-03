const items = [
  {
    id: 'elixir',
    introText: 'a wizard was trying to decipher a mysterious ELIXIR',
    emoji:'🧙‍♂️⚗️'
  },
  {
    id: 'pasta',
    introText: 'a chef had been making PASTA all day and wanted to cook something different',
    emoji:'👨‍🍳🍝',
  }
];

const init = (node) => {
  let state = {};

  const setScene =(item) => {
    state.scene = {
      item: item
    };
    render();
  };

  const render = () => {
    node.querySelector('.stage').innerHTML = state.scene.item.introText;
  };

  const ItemButton = (item) => {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(item.emoji));
    button.onclick = () => setScene(item);
    return button;
  };

  const start = () => {
    let buttons = items.map(ItemButton);
    for (let i = 0; i<buttons.length ; i++) {
      node.querySelector('.buttons').appendChild(buttons[i]);
    }
  };

  start();
};
