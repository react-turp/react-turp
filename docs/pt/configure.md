
**Primeiros passos**

------------

Vamos dar inicio as configurações do nosso store e em seguida adicionando nossas configurações do store em nosso Provider.
</br>

### Configurando Store

Abaixo fazemos a importação do *createStore* de dentro do turp,  podemos passar a tipagem do estado global para dentro da nossa função.

Nosso *createStore* recebe como parâmetro da **função** um objeto contendo 3 valores que são "stateInitial, deps, develop", bom agora vamos falar do **stateInitial** que recebe um objeto que vai ser nosso estado inicial da aplicação.

> Por padrão temos alguns valores no estado que são pré configurado como "loading" etc

```ts
import { createStore } from "turp";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IPosts {
  id: number;
  title: string;
}

export interface IGlobal {
  user: IUser;
  posts: IPosts[];
}

const store = createStore<IGlobal>({
  stateInitial: {
    user: {
      name: "Turp Store",
      email: "turp@test.com",
      password: "34343tssd4r"
    },
    posts: [
      {
        id: 1,
        title: "Create Store"
      },
      {
        id: 2,
        title: "Create Store 2"
      }
    ]
  }
});

export { store };


```

### Configurando Provider

Bom acima configuramos o nosso store, para integrar essa configuração a nossa aplicação temos que adicionar o Provider em nossa aplicação.

```tsx
import React from "react";
import { TurpProvider } from "turp/provider";
import { store } from "./store/createStore";

const App: React.FC = () => {
  return (
    <TurpProvider store={store}>
      <h1>Simple Create Store</h1>
    </TurpProvider>
  );
};

export default App;

```

### Configurar devTools

Para configurar o devTools temos que adicionar algumas propriedades dentro do createStore.

```ts
const store = createStore<IGlobal>({
  stateInitial: {
    user: {
      name: 'Turp Store',
      email: 'turp@test.com',
      password: '34343tssd4r'
    },
    posts: [
      {
        id: 1,
        title: 'Create Store'
      },
      {
        id: 2,
        title: 'Create Store 2'
      }
    ]
  },

  // Abaixo nosso devTools está habilitado.
  develop: {
    //Nome que vai aparecer no devTools
    nameDev: 'TurpTest',
    // Ativar ou desativar a depuração
    active: true,
  },
});
```

>Abaixo está uma implementação simples do **createStore** junto com **TurpProvider**.

<iframe src="https://codesandbox.io/embed/createstore-jidgy?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fstore%2FcreateStore.ts&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="createStore"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
