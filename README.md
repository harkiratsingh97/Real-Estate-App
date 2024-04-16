# KiratEstate

KiratEstate is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. The app provides real estate functionalities such as user authentication, property listing, sorting, and filtering.

## Features

- **User Authentication**:
  - Sign up and sign in functionality.
  - Google OAuth for easy authentication.

- **Property Management**:
  - Authenticated users can list new properties with details such as title, description, price, location, etc.

- **Property Listings**:
  - Users can view a list of available properties.
  - Sort and filter properties based on various criteria like price range, location, property type, etc.

## Technologies Used

- **Frontend**:
  - React.js for building the user interface.
  - Tailwind CSS for styling and responsive design.

- **Backend**:
  - Node.js and Express.js for the server-side logic.
  - MongoDB as the database to store property and user data.

- **Authentication**:
  - Passport.js for user authentication strategies, including Google OAuth.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/harkiratsingh97/Real-.git

2. Navigate to the project directory:
   ```bash
  cd KiratEstate

3. Install dependencies for both frontend and backend:
   ```bash
  cd client
  npm install
  cd ..
  npm install

4. Set up environment variables:
- Create a .env file in the api directory.
- Add necessary environment variables like MongoDB URI, Google OAuth credentials, etc.

5. Start the development servers:
   ```bash
  cd ../client
  npm start
  cd ..
  npm start

6. Access the app:
- Open your browser and go to http://localhost:3000 to view the frontend.
- Backend API endpoints will be available at http://localhost:5000.

7. Folder Structure
- client/: Frontend React.js codebase.
- api/: Backend Node.js and Express.js codebase.
  - api/models/: MongoDB data models.
  - api/routes/: API routes for authentication, property listing, etc.
  - api/config/: Configuration files including database connection setup, Passport.js strategies, etc.

##Contributing
We welcome contributions to improve and expand the features of KiratEstate. Feel free to fork the repository, make changes, and submit pull requests.

##License
This project is licensed under the MIT License.




