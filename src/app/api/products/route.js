import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 минут

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSw5APjLniZiW1W97l0ByzPFfy6zmy1hjP9b9s9VWtC8rZiU7QK0bap3IoYlFYn_RdFc2rJFlsER3QT/pub?output=csv';

async function fetchSheetData() {
  const csvResponse = await fetch(SHEET_URL);
  const csvText = await csvResponse.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      complete: (res) => resolve(res.data)
    });
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const cached = cache.get(category);
    if (cached) {
      return NextResponse.json(cached);
    }

    const rawData = await fetchSheetData();
    if (!rawData) {
      throw new Error('Данные не были получены');
    }

    const products = rawData.map((product, index) => ({
      id: product.id || `auto-${index}`,
      name: product.name,
      price: product.price.split(',').map(q => Number(q.trim())),
      image: product.image.trim(),
      category: product.category || '',
      description: product.description || '',
      images: product.sliders ? product.sliders.split(',').map(i => i.trim()) : [],
      options: {
        size: product.options_size ? product.options_size.split(',').map(s => s.trim()) : [],
        quantity: product.options_quantity ? product.options_quantity.split(',').map(q => Number(q.trim())) : []
      },
    }));

    console.log(products);

    cache.set(category, products);
    return NextResponse.json(products);
  } catch (err) {
    console.error('API ошибка:', err);
    return NextResponse.json({ error: 'Ошибка загрузки данных' }, { status: 500 });
  }
}