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
            for cinema_section in showtimes_soup.select('.seanceTiles'):
                name_element = cinema_section.select_one('.seanceTiles__title')
                if not name_element:
                    continue
                cinema_name = name_element.text.strip()
                
                # Extract lat/lng from data attributes
                lat = cinema_section.get('data-cinema-latitude')
                lng = cinema_section.get('data-cinema-longitude')
                
                times = [time.text.strip() for time in cinema_section.select('.seanceTile__value')]
                
                if times:
                    cinemas[cinema_name] = {
                        "times": times,
                        "coords": {"lat": lat, "lng": lng} if lat and lng else None
                    }
                
            movies.append({
                "title": title,
                "cinemas": cinemas
            })
            
        return movies
