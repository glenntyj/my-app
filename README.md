# My App

A full-stack application with a React frontend and Node.js/Express backend, featuring authentication and real-time chat functionality.

## Project Structure

```
my-app/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
│       ├── modules/       # Feature modules
│       │   ├── auth/      # Authentication features
│       │   └── chatbot/   # Chat functionality
│       ├── router/        # React Router setup
│       └── styles/        # CSS styles
│           ├── components/
│           ├── layout/
│           └── themes/
└── server/                # Node.js/Express backend
    ├── data/             # JSON data storage
    └── src/
        ├── config/       # Server configuration
        ├── controllers/  # Request handlers
        ├── middleware/   # Express middleware
        ├── models/       # Data models
        ├── routes/       # API routes
        ├── services/     # Business logic
        └── utils/        # Helper functions
```

## Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/glenntyj/my-app.git
cd my-app
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Configuration

1. Create `.env` file in the server directory:
```bash
# server/.env
PORT=5000
JWT_SECRET=your_jwt_secret
```

2. Create `.env` file in the client directory:
```bash
# client/.env
REACT_APP_API_URL=http://localhost:3000
PORT=3000
```

## Running the Application

1. Start the server (from the server directory):
```bash
npm start
```

2. In a new terminal, start the client (from the client directory):
```bash
npm start
```

The client will be available at `http://localhost:3001` and the server at `http://localhost:3000`.

## Features

- User Authentication (JWT)
- Real-time Chat using Socket.IO
- Responsive Design
- Theme Support

## Project Organization

### Client
- **Modules**: Feature-based organization (auth, chatbot)
- **Styles**: Structured CSS with themes, layouts, and component styles
- **Router**: Centralized routing with protected routes

### Server
- **Controllers**: Handle request/response logic
- **Services**: Implement business logic
- **Middleware**: Auth verification, error handling
- **Routes**: API endpoint definitions

## Development

- Run client in development mode: `cd client && npm start`
- Run server with nodemon: `cd server && npm run dev`
- Build client for production: `cd client && npm run build`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details
