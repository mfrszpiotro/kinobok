import httpx
from bs4 import BeautifulSoup

def main():
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = httpx.get("https://www.filmweb.pl/showtimes/Warszawa", headers=headers, follow_redirects=True, timeout=30)
    soup = BeautifulSoup(response.text, "html.parser")
    movie_elements = soup.select(".showtimesFilmsItem")
    
    for element in movie_elements:
        title_a = element.select_one(".preview__title a")
        if title_a:
            title = title_a.get_text(strip=True)
            footer = element.select_one(".showtimesFilmsItem__footer")
            footer_text = footer.get_text(strip=True) if footer else "No footer"
            print(f"Movie: {title}, Footer: {footer_text}")

if __name__ == "__main__":
    main()
