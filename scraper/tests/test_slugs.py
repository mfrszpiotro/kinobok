from scraper.slug_utils import generate_slug

def test_slug_generation():
    assert generate_slug("Project Hail Mary", 2026) == "project-hail-mary"
    assert generate_slug("The Flash", 2023) == "the-flash-2023"
