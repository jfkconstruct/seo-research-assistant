Windsurf File for Project

## Project Overview

**Project Name:** SEO Research Assistant

**Description:** The SEO Research Assistant is a comprehensive web-based application designed to automate and enhance the SEO research and optimization process. Its main purpose is to aid digital marketing professionals, SEO specialists, content creators, business owners, marketing agencies, and website developers in analyzing keywords, assessing competition, and crafting data-driven SEO strategies.

**Tech Stack:**

*   **Frontend**: React.js, Redux, Material-UI, D3.js/Chart.js
*   **Backend**: Node.js, Express, GraphQL, WebSocket
*   **Database**: PostgreSQL, Redis, MongoDB
*   **API Integrations**: Google Search Console, Google Analytics, Ahrefs, SEMrush, Moz
*   **Security**: End-to-end encryption, GDPR compliance, HTTPS
*   **Infrastructure**: Microservices architecture, Docker, Kubernetes

**Key Features:**

*   User Authentication (email, OAuth)
*   Project Management
*   Keyword Research
*   Competitor Analysis
*   Content Planning
*   Reporting System

## Project Structure

**Root Directory:** Contains the main configuration files and documentation.

**/frontend:** Contains all frontend-related code, including components, styles, and assets.

*   **/components:**

    *   Dashboard
    *   ProjectManager
    *   KeywordAnalyzer
    *   CompetitorAnalyzer
    *   ContentPlanner
    *   ReportGenerator

*   **/assets:**

    *   Logo
    *   Icons
    *   Fonts

*   **/styles:**

    *   theme.js
    *   globals.css

**/backend:** Contains all backend-related code, including API routes and database models.

*   **/controllers:**

    *   AuthController
    *   ProjectController
    *   KeywordController
    *   CompetitorController
    *   ContentController

*   **/models:**

    *   UserModel
    *   ProjectModel
    *   KeywordModel
    *   CompetitorModel
    *   ContentModel

*   **/routes:**

    *   auth.js
    *   projects.js
    *   keywords.js
    *   competitors.js

*   **/config:**

    *   env.js
    *   database.js

**/tests:** Contains unit and integration tests for both frontend and backend.

## Development Guidelines

**Coding Standards:** Follow the AirBnB JavaScript style guide. Use ESLint for code linting and Prettier for code formatting.

**Component Organization:** Organize React components by feature domain, with shared components placed in a common directory.

## Windsurf IDE Integration

**Setup Instructions:**

1.  Clone the repository.
2.  Install dependencies using `npm install` for both frontend and backend.
3.  Start the development server using `npm start`.

**Key Commands:**

*   `windsurf:run` - Runs the development server.
*   `windsurf:build` - Bundles the project for production.
*   `windsurf:test` - Runs all test suites.

## Additional Context

**User Roles:**

*   Administrator: Full access
*   SEO Specialist: Project and SEO tools access
*   Content Creator: Content planning features
*   Business Owner/Client: Read-only access
*   Marketing Analyst: View and export analytics

**Accessibility Considerations:** Ensure the application meets WCAG 2.1 standards for the components, especially for color contrast and keyboard navigation across all features.
