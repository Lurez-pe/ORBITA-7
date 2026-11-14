const NASA_IMAGES = 'https://images-api.nasa.gov/search';

export async function searchMarsMedia(query = 'Curiosity Mars surface') {
  const params = new URLSearchParams({ q: query, media_type: 'image', page_size: '6' });
  const response = await fetch(`${NASA_IMAGES}?${params}`);
  if (!response.ok) throw new Error(`NASA Images respondió ${response.status}`);
  const payload = await response.json();
  return (payload.collection?.items ?? []).slice(0, 6).map((item) => {
    const meta = item.data?.[0] ?? {};
    const image = item.links?.find((link) => link.rel === 'preview')?.href;
    return {
      id: meta.nasa_id,
      title: meta.title ?? 'Imagen de Marte',
      description: meta.description ?? '',
      center: meta.center ?? 'NASA',
      date: meta.date_created?.slice(0, 10) ?? '',
      image,
      page: `https://images.nasa.gov/details/${encodeURIComponent(meta.nasa_id ?? '')}`,
    };
  }).filter((item) => item.image);
}

export async function searchPdsMarsData() {
  const params = new URLSearchParams({ keywords: 'Mars Curiosity REMS weather', limit: '3' });
  const response = await fetch(`https://pds.nasa.gov/api/search/1/products?${params}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`PDS respondió ${response.status}`);
  return response.json();
}
