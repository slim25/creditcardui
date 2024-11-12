import React, { useState } from 'react';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import InputMask from 'react-input-mask';

function AddCard({ accessToken, onCardAdded }) {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const isValidCardNumber = (number) => {
        // Basic Luhn algorithm for credit card validation
        let sum = 0;
        let shouldDouble = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number[i]);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    };

    const isValidExpiryDate = (date) => {
        const [month, year] = date.split('/');
        if (!month || !year || month < 1 || month > 12) return false;

        const now = new Date();
        const expiry = new Date(`20${year}`, month - 1);
        return expiry > now;
    };

    const handleAddCard = async (e) => {
        e.preventDefault();

        const formattedCardNumber = cardNumber.replace(/\s/g, '');
        if (!isValidCardNumber(formattedCardNumber)) {
            alert("Invalid card number.");
            return;
        }
        if (!isValidExpiryDate(expiryDate)) {
            alert("Invalid expiry date.");
            return;
        }
        if (cvv.length < 3 || cvv.length > 4) {
            alert("Invalid CVV.");
            return;
        }

        // Simulate tokenization by hashing the card number (ideally we would need to use paymetric service to tokinize)
        const cardToken = sha256(formattedCardNumber).toString();

        try {
            const response = await axios.post(
                'http://localhost:8080/api/credit-cards',
                {
                    cardHolderName,
                    expiryDate,
                    cardToken,
                    last4Digits: formattedCardNumber.slice(-4),
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );

            onCardAdded(response.data);
            alert("Card added successfully!");


            setCardNumber('');
            setCardHolderName('');
            setExpiryDate('');
            setCvv('');
        } catch (error) {
            console.error("Error adding card", error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={handleAddCard}>
            <InputMask
                mask="9999 9999 9999 9999"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Card Holder Name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
            />
            <InputMask
                mask="99/99"
                placeholder="Expiry Date (MM/YY)"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
            />
            <InputMask
                mask="999"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
            />
            <button type="submit">Add Card</button>
        </form>
    );
}

export default AddCard;
