import { useState, useEffect, useRef } from 'react';
import pokemon from 'pokemontcgsdk';
import Cards from './Cards';
import Card from '../lib/components/CardProxy';

export default function Search({ query, setQuery }) {
  const [loadingQuery, setLoadingQuery] = useState(true);
  const [queryResult, setQueryResult] = useState([]);
  const [isError, setIsError] = useState(false);
  const queryTimer = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      pokemon.configure({ apiKey: process.env.NEXT_PUBLIC_API_KEY });
    }
  }, []);

  const usableQuery = query.length > 2;

  const loadQuery = async () => {
    if (!usableQuery) {
      return;
    }

    setLoadingQuery(true);
    clearTimeout(queryTimer.current);
    queryTimer.current = setTimeout(() => {
      pokemon.card
        .where({
          q: `( set.id:swsh* AND name:"*${query}*" )`,
          select: `id,name,number,supertype,subtypes,rarity,images,types,set`,
          orderBy: `-set.releaseDate,-number`,
          pageSize: 36,
        })
        .then((result) => {
          const cards = result.data || [];

          setQueryResult([]);
          setIsError(false);

          let cardsMap = cards.slice(0, 36).map((card) => {
            if (card.rarity === 'Common' || card.rarity === 'Uncommon') {
              card.isReverse = !!Math.round(Math.random());
            }
            card.set = card.set.id;
            return card;
          });

          setQueryResult([...cardsMap]);
          setLoadingQuery(false);
        })
        .catch((a, b, c) => {
          setQueryResult([]);
          setLoadingQuery(false);
          setIsError(true);
        });

      if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
        gtag('event', 'search', {
          search_term: query,
        });
      }
    }, 666);
  };

  useEffect(() => {
    if (query) {
      loadQuery();
    }
  }, [query]);

  return (
    <>
      <section className="search-area">
        <input
          type="search"
          name="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="eg: Morpeko or Marnie"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-search"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.25"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
          <path d="M21 21l-6 -6"></path>
        </svg>
      </section>

      {!query && <h3>Browse cards below, Or search for your favourite!</h3>}

      {usableQuery && loadingQuery && <h3>Fetching Cards...</h3>}

      {usableQuery && queryResult.length > 0 && (
        <Cards>
          {queryResult.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              set={card.set}
              number={card.number}
              types={card.types}
              supertype={card.supertype}
              subtypes={card.subtypes}
              rarity={card.rarity}
              isReverse={card.isReverse}
            />
          ))}
        </Cards>
      )}

      {(isError || (usableQuery && !loadingQuery && !queryResult.length)) && (
        <>
          <h3>Error: No cards found with that name.</h3>

          <Cards>
            <Card
              id="basep-16"
              name="Computer Error"
              set="basep"
              number="16"
              img="https://images.pokemontcg.io/basep/16_hires.png"
              supertype="Trainer"
              subtypes="Rocket's Secret Machine"
              rarity="Promo"
              isReverse={false}
            />
          </Cards>
        </>
      )}
    </>
  );
}

