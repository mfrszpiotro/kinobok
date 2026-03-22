import httpx
from bs4 import BeautifulSoup

def debug():
    url = "https://www.filmweb.pl/film/Anzu.+Kot-duch-2024-10052044/showtimes/Warszawa"
    response = httpx.get(url, follow_redirects=True)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    print(f"URL: {response.url}")
    print(f"Status: {response.status_code}")
    
    cinemas = soup.select('.showtimes__cinema')
    print(f"\nFound {len(cinemas)} .showtimes__cinema elements")
    
    for i, cinema in enumerate(cinemas[:3]):
        name = cinema.select_one('.showtimes__cinema-title')
        times = cinema.select('.showtimes__time')
        print(f"Cinema[{i}]: {name.text.strip() if name else 'N/A'}, Times: {[t.text.strip() for t in times]}")

debug()
