import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    if (!file || !folder) {
      return NextResponse.json(
        { error: 'File and folder are required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'images', 'before-after', folder);

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory may already exist, continue
    }

    const filename = file.name;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const publicPath = `/images/before-after/${folder}/${filename}`;

    return NextResponse.json(
      { success: true, path: publicPath, filename },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
