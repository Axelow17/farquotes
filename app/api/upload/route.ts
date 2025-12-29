import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Remove data:image/png;base64, prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Upload to ImgBB
    const formData = new FormData();
    formData.append('image', base64Data);
    
    const apiKey = process.env.IMGBB_API_KEY || '8a4c4b9c8f8d3c8a8f8d3c8a8f8d3c8a';
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
      });
    } else {
      return NextResponse.json(
        { error: 'Upload failed', details: data },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
