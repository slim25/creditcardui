import React from 'react';

function CardList({ cards = [], isAdmin, onDeleteCard }) {

    return (
        <div>
            <h2>Saved Cards</h2>
            {isAdmin ? (
                cards.map(group => (
                    <div key={group.username}>
                        <h3>{group.username}</h3>
                        <ul>
                            {group.creditCards.map(card => (
                                <li key={card.cardToken}>
                                    {card.cardHolderName} - {card.maskedCardNumber}
                                    <button onClick={() => onDeleteCard(card.cardToken)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <ul>
                    {cards.map(card => (
                        <li key={card.cardToken}>
                            {card.cardHolderName} - {card.maskedCardNumber}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


export default CardList;
