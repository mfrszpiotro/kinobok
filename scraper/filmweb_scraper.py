import httpx
from bs4 import BeautifulSoup

class FilmwebScraper:
    BASE_URL = "https://www.filmweb.pl/showtimes/Warszawa"

    def get_warsaw_movies(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = httpx.get(self.BASE_URL, headers=headers, follow_redirects=True)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        movie_elements = soup.select(".showtimesFilmsItem")
        
        movies = []
        for element in movie_elements:
            title_element = element.select_one(".preview__title a")
            if title_element:
                title = title_element.get_text(strip=True)
                
                showtimes = []
                seance_elements = element.select(".seanceTile")
                for seance in seance_elements:
                    time_element = seance.select_one(".seanceTile__value")
                    if time_element:
                        showtimes.append(time_element.get_text(strip=True))
                
                movies.append({
                    "title": title,
                    "showtimes": showtimes
                })
        
        return movies
