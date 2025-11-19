import { useState, useEffect } from 'react';
import Card from '../../lib/components/CardProxy';

export default function TestPage() {
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch('/data/cards.json');
        const cards = await response.json();
        // Use the Pikachu card with effects (index 0)
        setCard(cards[0]);
      } catch (error) {
        console.error('Error loading card:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      backgroundColor: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    }}>
      {/* Tailwind CSS Test */}
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 shadow-lg">
        ✅ Tailwind CSS is working!
      </div>
      
      <h1 style={{ 
        color: 'white', 
        marginBottom: '40px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '2.5rem'
      }}>
        Pokemon Card Test
      </h1>
      
      {isLoading ? (
        <p style={{ color: 'white' }}>Loading card...</p>
      ) : card ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '300px',
          width: '100%'
        }}>
          <Card
            id={card.id}
            name={card.name}
            set={card.set}
            number={card.number}
            types={card.types}
            supertype={card.supertype}
            subtypes={card.subtypes}
            rarity={card.rarity}
            showcase={false}
          />
        </div>
      ) : (
        <p style={{ color: 'white' }}>Failed to load card</p>
      )}

      <p style={{ 
        color: '#aaa', 
        marginTop: '40px',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        Hover and move your mouse over the card to see the 3D rotation and holographic effects!
      </p>
    </div>
  );
}
