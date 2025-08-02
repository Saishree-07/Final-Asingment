import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    const filePath = join(process.cwd(), 'public', 'uploads', ...filename);
    
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = filename[filename.length - 1].split('.').pop().toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    } else if (ext === 'pdf') {
      contentType = 'application/pdf';
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
} 