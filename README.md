# Credit Card Management Frontend

A React-based frontend for the `creditcardAPI`, providing a user interface for managing user profiles, credit cards, and activity logs. This frontend application enables user registration, profile management, and secure access to card and activity information with role-based controls.

## Features

* **User Authentication & Role-Based UI**:
  * **USER**: Register, update profile, add and view credit cards.
  * **ADMIN**: View all users, manage user credit cards, and view user activity logs.
* **Card Tokenization**: Implements card tokenization on the frontend using the Luhn algorithm for validation.

## Setup & Run

1. **Environment Requirements**:

    `Node.js (v14+ recommended)`
4. **Installation**: Navigate to `creditcardUI` and install dependencies:

    `npm install`
9. **Running in Development Mode**:

    `npm start`

    The application will be accessible at http://localhost:3000.


16. **Dockerized Deployment**: The frontend is also included in the `docker-compose` setup of the `creditcardAPI` backend repository. Running `docker-compose up --build` in the backend directory will start both the frontend and backend containers.

## Usage

#### User Actions

* **Registration**: Users can register by clicking the "Register" button. Duplicate usernames are not allowed.
* **Profile Management**: Upon registration and login, `USER` role users can populate profile details (name, email, phone) and add credit cards.
* **Card Management**: `USER` users can add cards, which are tokenized and validated using the Luhn algorithm. Card details are securely hashed before storage.

#### Admin Actions

* **Manage User Credit Cards**: `ADMIN` users can view and delete credit cards associated with any user.
* **View Activity Logs**: Admins can view a history of user activities, including credit card additions and profile updates.