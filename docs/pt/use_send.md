
**useSend como utilizar**

------------

Fala pessoal vamos falar sobre atualizações de estado novamente, e dessa vez de uma forma mais completa e bem simple, tudo isso utilizando o useSend.

Para dar inicio devemos importar o useSend de dentro do turp, esse hook ele retorna uma função onde podemos enviar o que pretendemos atualizar dentro do estado.

Nosso hook useSend recebe um tipo genérico do estado global da aplicação, já a função retornada pelo hook também recebe um tipo genérico como parâmetro que vai identificar o tipo do valor que você está buscando..

No exemplo abaixo também foi utilizado a biblioteca *immer* para um exemplo de utilização.

>OBS: Para utilizar o useSend primeiro tenha configurado o store e o provider ok?

```tsx
import React from "react";
import { useSelect, useSend } from "turp";
import produce from "immer";
import { IGlobal, IPosts, IUser } from "../../store/createStore";

const Home: React.FC = () => {
  const send = useSend<IGlobal>();

  const name = useSelect<IGlobal, string>((item) => item.user.name);
  const posts = useSelect<IGlobal, IPosts[]>((item) => item.posts);

  const handleUpdateUser = () => {
    const updateUser = {
      name: "Turp useSend",
      email: "turp@send.com",
      password: "turp@#"
    };

    send<IUser>(() => updateUser, "user");
  };

  const handleNewPostAndUpdate = () => {
    const id = Math.random();

    send<IPosts[]>((items) => {
      return [
        ...items,
        {
          id: id,
          title: `New Post ${id.toFixed(2)}`
        }
      ];
    }, "posts");

    send<IPosts[]>((item) => {
      return produce(item, (draft) => {
        draft.map((p) => {
          if (p.id === 1) {
            p.title = "Turp Store One Update";
          }
          return p;
        });
        return draft;
      });
    }, "posts");
  };

  return (
    <div>
      <h1>
        {name}{" "}
        <button type="button" onClick={handleUpdateUser}>
          Update name
        </button>
      </h1>

      <button type="button" onClick={handleNewPostAndUpdate}>
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


### Exemplo

<iframe src="https://codesandbox.io/embed/usesend-fq5ks?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FHome%2Findex.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useSend"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
