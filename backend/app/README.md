# CO-SIE-DZIEJE-W-POLSCE

This is a backend application for the CO-SIE-DZIEJE-W-POLSCE project. Below is an overview of the project structure and instructions for setting it up.

## Project Structure

- `app/`: Contains the main application files.
  - `api.py`: API endpoints and functions for fetching legal and voting data from external sources.
  - `config.py`: Configuration settings.
  - `database.py`: Database interactions.
  - `main.py`: Main application logic.
  - `openai_analyzer.py`: OpenAI analysis module.
  - `pdf_utils.py`: Utilities for handling PDF files.
  - `storage.py`: Storage management.
  - `votes_calculator.py`: Vote calculation logic.
- `act_analysis.json`: Analysis data.
- `act_content.txt`: Content data.
- `last_known.json`: Last known state data.
- `__pycache__`: Python cache files.
- `.env`: Environment variables (not tracked).
- `.env.example`: Example environment file.
- `requirements.txt`: Project dependencies.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd backend/app
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up the environment variables:

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your specific values.

## Usage

This application fetches the latest acts from the Polish Monitor and populates the database with specially prepared acts.

```bash
python main.py
```

## Additional Information

- The project includes a data structure definition in data_structure.json to guide the frontend on how to fetch and utilize the data.
