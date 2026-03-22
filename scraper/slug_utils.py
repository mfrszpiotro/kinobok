import re

def generate_slug(title: str, year: int) -> str:
    """
    Generates a Letterboxd-style slug from a movie title and year.
    If the title is known to be ambiguous (like 'The Flash'), it appends the year.
    """
    # Lowercase and remove special characters (except spaces)
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'\s+', '-', slug).strip('-')
    
    # Letterboxd specific: Some titles require year to be unique.
    # For the PoC, we handle known ambiguous titles.
    # In a full implementation, this might check a database or API.
    ambiguous_titles = {"The Flash"}
    
    if title in ambiguous_titles:
        return f"{slug}-{year}"
    
    return slug
