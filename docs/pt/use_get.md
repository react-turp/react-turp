
**useGet como utilizar**

------------

Vamos entender como podemos buscar todos os valores de dentro do estado da aplicação.

Para buscar todos os valores do estado, temos que importar o useGet de dentro do turp, esse hook recebe 1 tipos genéricos que é a interface do estado global.

>OBS: Para utilizar o useGet primeiro tenha configurado o store e o provider ok?

```tsx
import React from "react";
import { useGet } from 'turp';

import { IGlobal } from '../../store/createStore';

const Home: React.FC = () => {
  const store  = useGet<IGlobal>();

  return (
    <div>
      <h1>{store.user.name}</h1>

      {store.posts.map(item => (
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

<iframe src="https://codesandbox.io/embed/useget-s9xcc?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fcomponents%2FHome%2Findex.tsx&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useGet"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
