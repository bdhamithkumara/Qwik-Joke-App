import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' },
  });
  return (await response.json()) as {
    id : string;
    status : number;
    joke: string;
  };
});


export default component$(() => {
  //calling our 'useDadJoke' hook, will retun a reactive signal to the loaded data
  const dadJokeSignal = useDadJoke();
  return <div class=" text-white ">
    <section class="text-[50px] font-sans">{dadJokeSignal.value.joke}</section>
  </div>
});