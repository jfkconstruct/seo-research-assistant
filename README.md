# YouTube SEO Research Assistant

A React-based web application for YouTube keyword research and content optimization. This tool helps content creators and digital marketers analyze keywords on YouTube to optimize their video content and improve visibility.

## Features

- **YouTube Keyword Analysis**
  - Search volume metrics
  - Average views, likes, and comments
  - Engagement rate calculation
  - Competition score analysis
  - Top performing videos for each keyword

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- YouTube Data API v3 key

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

3. Create a `.env` file in the root directory with your YouTube API key:
```env
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Getting a YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API key)
5. Copy the API key to your `.env` file

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── Layout/        # Main layout component
├── pages/             # Page components
│   └── KeywordResearch/
├── services/          # API and business logic
│   └── keywordService.js
├── config.js          # Configuration settings
├── App.js            # Main application component
└── index.js          # Application entry point
```

## Environment Variables

- `REACT_APP_YOUTUBE_API_KEY`: YouTube Data API v3 key

## Features in Detail

### Keyword Analysis
- **Search Volume**: Total number of videos for the keyword
- **Average Views**: Mean view count across top videos
- **Engagement Rate**: Calculated from likes and comments relative to views
- **Competition Score**: Based on recent video uploads (last 3 months)

### Top Videos Analysis
- Title and channel information
- View count, likes, and comments
- Publication date
- Direct link to video

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Material-UI](https://mui.com/)
- YouTube Data API v3
