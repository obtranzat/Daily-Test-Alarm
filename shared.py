import logging
import requests
from datetime import datetime
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_daily_text():
    base_url = "https://wol.jw.org/en/wol/dt/r1/lp-e/"
    current_date = datetime.now().strftime("%Y/%m/%d")
    url = f"{base_url}{current_date}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        scripture = soup.find('p', class_='themeScrp').text.strip()
        text = soup.find('p', class_='sb').text.strip()
        daily_text = f"{scripture}\n\n{text}"
        logger.info(f"Successfully fetched daily text for {current_date}")
        return daily_text
    except requests.RequestException as e:
        logger.error(f"Error fetching daily text: {e}")
        return "Unable to fetch daily text at this time."
    except AttributeError as e:
        logger.error(f"Error parsing daily text: {e}")
        return "Unable to parse daily text at this time."