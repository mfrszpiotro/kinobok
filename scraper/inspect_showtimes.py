import httpx

url = "https://www.filmweb.pl/film/Anzu.+Kot-duch-2024-10052044/showtimes/Warszawa"
response = httpx.get(url, follow_redirects=True)
with open("showtimes.html", "w") as f:
    f.write(response.text)
