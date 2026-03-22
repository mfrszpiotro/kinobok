import pytest
from scraper.filmweb_scraper import FilmwebScraper

def test_scrape_warsaw_showtimes():
    scraper = FilmwebScraper()
    movies = scraper.get_warsaw_movies()
    assert len(movies) > 0
    print(f"\nFound {len(movies)} movies")
    for movie in movies[:5]:
        print(f"Movie: {movie['title']}, Showtimes: {movie['showtimes']}")
    assert "title" in movies[0]
    assert "showtimes" in movies[0]
