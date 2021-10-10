
**createActions como utilizar**

------------

Fala pessoal agora vamos conhecer e entender como podemos utilizar o createActions em nossos projeto.

Com o createActions podemos criar funções que podem fazer alterações em nosso estado, tudo isso de uma forma muito simples e eficaz.

Vamos entender isso agora, essa função recebe 2 tipos genéricos sendo o primeiro o estado global, já o segundo tipo seria o tipo de dado a ser trabalhado em suas ações.

Agora como parâmetro da função createActions temos que passar um objeto contendo 2 chaves, a primeira chave é "field" que vai ser o nome do campo a ser trabalhado, a segunda chave é "actions" que são nossas funções de ações pré definidas.


```txt
  O filed é o nome do campo a ser selecionado de dentro do estado global.
  field: string;

  Nossas actions é uma função que retorna 2 funções de dentro dela, no exemplo abaixo
  "fieldData" é uma função que retorna o estado baseado na "field", já o dispatch é uma função de atualização.
  actions: (fieldData, dispatch) => ....
```

>OBS: Para utilizar o createActions primeiro tenha configurado o store e o provider ok?


```tsx
import { createActions } from 'turp/action';

import { IGlobal, IPosts } from '../createStore';

const actionsPost = createActions<IGlobal, IPosts[]>({
  field: 'posts',
  actions: (fieldData, dispatch) => ({
    addNewPosts: item => {
      const posts = fieldData();

      posts.push(item as IPosts);

      dispatch(posts);
    },
    removePost: id => {
      const posts = fieldData();

      dispatch(posts.filter(p => p.id !== id));
    }
  })
});

export const { addNewPosts, removePost } = actionsPost();

```

Depois da criação das actions temos que fazer a importação para nosso componente.

```tsx
import React from 'react';
import { useSelect } from 'turp';
import { addNewPosts, removePost } from '../../store/actions/posts';
import { IGlobal, IPosts } from '../../store/createStore';

const Home: React.FC = () => {
  const posts = useSelect<IGlobal, IPosts[]>(item => item.posts);

  const handleAddPost = () => {
    const id = Math.random();
    addNewPosts<IPosts>({
      id,
      title: `Nova Postagem ${id.toFixed(2)}`
    });
  };

  const handleRemovePost = (id: number) => removePost(id);

  return (
    <div>
      <button type="button" onClick={handleAddPost}>
        newPost
      </button>
      {posts.map(item => (
        <div key={item.id}>
          <p>
            {item.title}{' '}
            <button type="button" onClick={() => handleRemovePost(item.id)}>
              Remover
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Home;

```

### Exemplo

<iframe src="https://stackblitz.com/edit/react-ts-fmv7qg?embed=1&file=src/store/actions/posts.ts"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="useSelect"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
