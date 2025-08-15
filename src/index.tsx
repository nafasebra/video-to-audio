import { serve } from 'bun';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import index from './index.html';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    /**
     * POST /api/convert
     *
     * Converts uploaded video files to MP3 format
     *
     * Request: FormData with "video" field containing video file
     * Response: JSON with conversion status and download URL
     *
     * Process:
     * 1. Validates video file type and size
     * 2. Saves video to uploads/ directory
     * 3. Runs FFmpeg conversion using convert.sh script
     * 4. Saves MP3 to downloads/ directory
     * 5. Returns success response with download link
     */
    '/api/convert': {
      async POST(req) {
        try {
          const formData = await req.formData();
          const file = formData.get('video') as File;

          if (!file) {
            return Response.json({ error: 'No video file provided' }, { status: 400 });
          }

          // Validate file type
          if (!file.type.startsWith('video/')) {
            return Response.json({ error: 'File must be a video' }, { status: 400 });
          }

          // Validate file name
          if (!file.name || file.name.trim() === '') {
            return Response.json({ error: 'Invalid filename' }, { status: 400 });
          }

          console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size,
          });

          // Create uploads directory if it doesn't exist
          const uploadsDir = join(process.cwd(), 'uploads');
          if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
          }

          // Create downloads directory if it doesn't exist
          const downloadsDir = join(process.cwd(), 'downloads');
          if (!existsSync(downloadsDir)) {
            await mkdir(downloadsDir, { recursive: true });
          }

          // Save uploaded filej
          const timestamp = Date.now();
          const videoPath = join(uploadsDir, `${timestamp}_${file.name}`);
          const videoBuffer = await file.arrayBuffer();
          await writeFile(videoPath, new Uint8Array(videoBuffer));

          // Generate output MP3 filename
          const mp3Filename = `${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}.mp3`;
          const mp3Path = join(downloadsDir, mp3Filename);

          // Run conversion using convert.sh
          const convertScript = join(process.cwd(), 'convert.sh');
          const scriptContent = await Bun.file(convertScript).text();
          const modifiedScript = scriptContent.replace('{src}', videoPath).replace('{dest}', mp3Path);

          // Write temporary script
          const tempScriptPath = join(process.cwd(), `temp_convert_${timestamp}.sh`);
          await writeFile(tempScriptPath, modifiedScript);

          // Execute conversion
          const proc = Bun.spawn(['bash', tempScriptPath], {
            stdout: 'pipe',
            stderr: 'pipe',
          });

          // const output = await new Response(proc.stdout).text();
          const error = await new Response(proc.stderr).text();

          // Clean up temporary script
          await unlink(tempScriptPath);

          if (proc.exitCode !== 0) {
            console.error('Conversion error:', error);
            return Response.json(
              {
                error: 'Conversion failed',
                details: error,
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: 'Video converted successfully',
            mp3Filename,
            downloadUrl: `/api/download/${mp3Filename}`,
          });
        } catch (error) {
          console.error('Conversion error:', error);
          return Response.json(
            {
              error: 'Internal server error',
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
          );
        }
      },
    },

    /**
     * GET /api/download/:filename
     *
     * Downloads converted MP3 files from the downloads directory
     *
     * Request: GET with filename parameter in URL path
     * Response: MP3 file as downloadable attachment
     *
     * Process:
     * 1. Validates file exists in downloads/ directory
     * 2. Sets proper headers for MP3 download
     * 3. Streams file content as response
     */
    '/api/download/:filename': async req => {
      const filename = req.params.filename;
      const filePath = join(process.cwd(), 'downloads', filename);

      try {
        const file = Bun.file(filePath);
        const exists = await file.exists();

        if (!exists) {
          return Response.json({ error: 'File not found' }, { status: 404 });
        }

        return new Response(file, {
          headers: {
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Type': 'audio/mpeg',
          },
        });
      } catch (error) {
        return Response.json({ error: 'Download failed' }, { status: 500 });
      }
    },

    '/api/hello': {
      async GET(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: false, // Temporarily disabled to isolate URL error

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
console.log(`🔧 Development mode: ${process.env.NODE_ENV !== 'production' ? 'enabled' : 'disabled'}`);
console.log(`🌐 HMR enabled: ${process.env.NODE_ENV !== 'production'}`);
