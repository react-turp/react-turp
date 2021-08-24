
**createInterceptor como utilizar**

------------

Vamos ver um exemplo muito simples de utilização dos interceptors e entender como ele pode nos ajudar em alguns momentos.

Com o createInterceptor podemos interceptar algumas ações de atualização de estado, para fazermos alguma alteração ou até mesmo salvar dados específicos dentro de um storage.



> "type" seria o tipo ("state" executa a cada atualização e quando o app está sendo montado), ("interceptor" é executado somente nas atualizações de estado).

> "field" é o nome do estado a ser intercetado nesse caso "posts"

> "core" é onde temos uma função de atualização (dispatch), temos o "state" que é o estado referente ao "field", e temos o newData que é o valor enviado pelo "useDispatch" ou pelo "useSend" ou através dos "createActions".

> "action" recebe uma função onde haverá a lógica do interceptor, vc deve retornar o novo estado modificado ou apenas o estado atual. Como retorno podera ser "boolean | object | Promise<any>"


> "revalidate" é utilizado apenas quando você retorna para a action um valor boolean " true | false ", isso servira caso vc queira fazer alguma verificação antes de atualizar o estado. 10 será o numero de tentativas até que a action retorne o valor "true", true é o sinal de que está tudo certo.

```tsx
// Aqui é nosso arquivo index dentro do store/interceptors/index.ts

import {createInterceptor} from 'turp/interceptor';

const interceptPost = createInterceptor<IGlobalStore>({
  type: 'interceptor',

  field: 'posts',

  core: ({ state, newData, dispatch }) => ({
    action: storage(newData),

    // No exemplo acima o revalidate não terá nenhum efeito.
    revalidate: 10,
  }),
});

export {interceptPost}
```

Abaixo será a função "storage" utilizada dentro do interceptor, ela recebe o newData como parâmetro.

```tsx
// nosso arquivo storage está dentro do store/interceptors/storage/index.ts

const storage = (newData: object) => {
  localStorage.setItem('posts', JSON.stringify({ ...newData }));
  return newData;
};

export {storage}
```

Para finalizar vamos configurar o interceptor dentro do **createStore**.

```tsx
import { createStore } from 'turp';
import { interceptPost } from './interceptors';

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

  // abaixo adicionamos nosso interceptor dentro de um array deps.
  deps: [interceptPost]
});

export { store };

```

### Exemplo em breve
<!--
<iframe src="https://stackblitz.com/edit/react-ts-fmv7qg?embed=1&file=src/store/actions/posts.ts"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useSelect"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe> -->
