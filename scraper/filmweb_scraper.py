import httpx
from bs4 import BeautifulSoup
from typing import List, Dict

class FilmwebScraper:
    BASE_URL = "https://www.filmweb.pl/showtimes/Warszawa"

    def get_warsaw_movies(self) -> List[Dict]:
        response = httpx.get(self.BASE_URL, follow_redirects=True)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        movies = []
        for movie_element in soup.select('.preview__title a'):
            title = movie_element.text.strip()
            movie_url = movie_element['href']
            
            # Navigate to individual movie showtime page
            showtimes_url = f"https://www.filmweb.pl{movie_url}/showtimes/Warszawa"
            showtimes_response = httpx.get(showtimes_url, follow_redirects=True)
            showtimes_response.raise_for_status()
            showtimes_soup = BeautifulSoup(showtimes_response.text, 'html.parser')
            
            cinemas = {}
            for cinema_element in showtimes_soup.select('.cinemaSection'):
                cinema_header = cinema_element.select_one('.cinemaSection__header h3')
                if not cinema_header:
                    continue
                cinema_name = cinema_header.text.strip()
                times = [time.text.strip() for time in cinema_element.select('.seanceTile__time')]
                cinemas[cinema_name] = times
                
            movies.append({
                "title": title,
                "cinemas": cinemas
            })
            
        return movies
