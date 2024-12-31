# SEO Research Assistant

A comprehensive web application designed to assist digital marketing professionals with YouTube keyword research, competitor analysis, and content planning.

## Features

### Keyword Research
- Search and analyze YouTube keywords
- Get search volume and competition metrics
- View related keywords and suggestions
- Track keyword trends over time

### Competitor Analysis
- Add YouTube channels by URL, handle (@username), or channel name
- Compare multiple channels side by side
- View key metrics:
  - Average views per video
  - Engagement rates
  - Upload frequency
  - Growth trends
- Track competitor content strategies

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- YouTube Data API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/seo-research-assistant.git
cd seo-research-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your YouTube API key:
```env
REACT_APP_YOUTUBE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| REACT_APP_YOUTUBE_API_KEY | YouTube Data API v3 key | Yes |

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Material-UI](https://mui.com/) - UI components
- [YouTube Data API v3](https://developers.google.com/youtube/v3) - YouTube data
- [Axios](https://axios-http.com/) - HTTP client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
