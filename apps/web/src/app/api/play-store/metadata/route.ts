import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get('id') || '';
  const urlParam = searchParams.get('url') || '';

  if (!id && urlParam) {
    if (urlParam.includes('id=')) {
      id = urlParam.split('id=')[1].split('&')[0];
    } else if (urlParam.includes('/')) {
      id = urlParam.split('/').pop() || '';
    }
  }

  id = id.trim();

  if (!id) {
    return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
  }

  try {
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}&hl=en&gl=US`;
    const res = await fetch(playStoreUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      // Fallback if app is in private closed testing or not indexed publicly yet
      const readableName = id.replace('com.', '').replace('app.', '').split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      return NextResponse.json({
        success: true,
        packageId: id,
        name: readableName || 'Android Application',
        icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(id)}`,
        category: 'Tools & Utilities',
        description: `Verified closed test app for ${readableName}.`,
        isPrivateOrFallback: true
      });
    }

    const html = await res.text();

    // Extract OpenGraph tags
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                         html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:title["']/i);
    
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i) ||
                         html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:image["']/i);

    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                        html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:description["']/i);

    // Clean up title (Google Play titles often have " - Apps on Google Play")
    let title = ogTitleMatch ? ogTitleMatch[1] : '';
    title = title.replace(/\s*-\s*Apps on Google Play.*/i, '').trim();

    const icon = ogImageMatch ? ogImageMatch[1] : `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(id)}`;
    const description = ogDescMatch ? ogDescMatch[1] : `Play Store verified testing build for ${title || id}.`;

    // Guess category from html or genre tag
    const genreMatch = html.match(/itemprop=["']genre["'][^>]*content=["'](.*?)["']/i) ||
                       html.match(/itemprop=["']applicationCategory["'][^>]*content=["'](.*?)["']/i);
    const category = genreMatch ? genreMatch[1] : 'Applications';

    return NextResponse.json({
      success: true,
      packageId: id,
      name: title || id,
      icon: icon,
      category: category,
      description: description,
      playStoreUrl: `https://play.google.com/store/apps/details?id=${id}`
    });
  } catch (error: any) {
    const readableName = id.replace('com.', '').split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    return NextResponse.json({
      success: true,
      packageId: id,
      name: readableName || 'Android App',
      icon: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(id)}`,
      category: 'Tools',
      description: `Testing package for ${readableName}.`,
      isFallback: true
    });
  }
}
