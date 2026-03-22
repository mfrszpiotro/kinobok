from scraper.filmweb_scraper import FilmwebScraper

def test_scrape_warsaw_showtimes():
    scraper = FilmwebScraper()
    movies = scraper.get_warsaw_movies()
    assert len(movies) > 0
    assert "title" in movies[0]
    assert "cinemas" in movies[0]
    # Verify at least one cinema has showtimes
    assert any(len(movie['cinemas']) > 0 for movie in movies)
