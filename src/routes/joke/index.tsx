import { component$, useSignal, useTask$  } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$ ,  server$} from '@builder.io/qwik-city';



export const useJokeVoteAction = routeAction$((props) => {
  console.log('VOTE', props)
})

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });
  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});


export default component$(() => {
  //calling our 'useDadJoke' hook, will retun a reactive signal to the loaded data
  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false);



  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);
    console.log('FAVORITE (isomorphic)', isFavoriteSignal.value);
    server$(() => {
      console.log('FAVORITE (server)', isFavoriteSignal.value);
    })();
  });

  return <div class=" text-white ">
    <section class="text-[50px] font-sans">{dadJokeSignal.value.joke}</section>
    <Form action={favoriteJokeAction}>
      <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
      <button name="vote" value="up">👍</button>
      <button name="vote" value="down">👎</button>
    </Form>
    <button class="float-right mr-10"
      onClick$={() => {
        isFavoriteSignal.value = !isFavoriteSignal.value;
      }}>
      {isFavoriteSignal.value ? '❤️' : '🤍'}
    </button>
  </div>
});