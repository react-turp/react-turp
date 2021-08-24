
**useDispatch como utilizar**

------------

Fala pessoal vamos falar sobre atualizações de estado de uma forma bem simple e direta, tudo isso utilizando o useDispatch.

Para dar inicio devemos importar o useDispatch de dentro do turp, esse hooks ele retorna uma função onde podemos enviar o que pretendemos atualizar dentro do estado.


>OBS: Para utilizar o useDispatch primeiro tenha configurado o store e o provider ok?

```tsx
import React from "react";
import { useSelect, useDispatch } from "turp";

import { IGlobal, IPosts } from "../../store/createStore";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  const name = useSelect<IGlobal, string>((item) => item.user.name);
  const posts = useSelect<IGlobal, IPosts[]>((item) => item.posts);

  const handleUpdateUser = () => {
    dispatch({
      user: {
        name: "New Turp Store"
      }
    });
  };

  const handleNewPost = () => {
    dispatch({
      posts: [
        ...posts,
        {
          id: 3,
          title: "New Post"
        }
      ]
    });
  };

  return (
    <div>
      <h1>
        {name}{" "}
        <button type="button" onClick={handleUpdateUser}>
          Update name
        </button>
      </h1>

      <button type="button" onClick={handleNewPost}>
        newPost
      </button>
      {posts.map((item) => (
        <div key={item.id}>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

```

Depois da criação do nosso componente Home, devemos fazer a importação desse componente para dentro do nosso App.tsx..

```tsx
import React from "react";
import { TurpProvider } from "turp";
import { store } from "./store/createStore";

import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <TurpProvider store={store}>
      <Home />
    </TurpProvider>
  );
};

export default App;

```


### Exemplo simples

<iframe src="https://codesandbox.io/embed/usedispatch-1nfli?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FHome%2Findex.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useDispatch"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
