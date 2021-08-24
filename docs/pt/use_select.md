
**useSelect como utilizar**

------------

Agora vamos entender como podemos selecionar valores de dentro do estado da aplicação de uma forma muito simples.

Para selecionar valores do estado, temos que importar o useSelect de dentro do turp, essa hook recebe 2 tipos genéricos, " o primeiro é nossa interface do estado global, já o segundo tipo pode ser uma interface ou apenas um tipo simples, esse segundo tipo é o retorno de dados que esperamos receber", veja abaixo como funciona.

>OBS: Para utilizar o useSelect primeiro tenha configurado o store e o provider ok?

```tsx
import React from "react";
import { useSelect } from 'turp';

import { IGlobal, IPosts } from '../../store/createStore';

const Home: React.FC = () => {
  const name  = useSelect<IGlobal, string>((item) => item.user.name);

  const posts  = useSelect<IGlobal, IPosts[]>((item) => item.posts);


  return (
    <div>
      <h1>{name}</h1>

      {posts.map(item => (
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

<iframe src="https://codesandbox.io/embed/useselect-zlqby?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FHome%2Findex.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useSelect"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
