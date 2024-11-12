import React from 'react';

function CardList({ cards }) {
    return (
        <div>
            <h2>Saved Cards</h2>
            <ul>
                {cards.map(card => (
                    <li key={card.cardToken}>
                        {card.cardHolderName} - **** **** **** {card.last4Digits}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CardList;
