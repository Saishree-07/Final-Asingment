import clientPromise from '@/lib/mongodb';
import upload from '@/lib/upload';

// Helper function to run multer middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Use default database from connection string
    const journals = await db.collection("entries").find().toArray();
    return Response.json(journals);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return Response.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Handle file uploads
    await runMiddleware(req, {}, upload.array('files', 5));
    
    const client = await clientPromise;
    const db = client.db(); // Use default database from connection string
    
    // Extract form data
    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const tags = formData.get('tags');
    
    // Get uploaded files
    const files = req.files || [];
    console.log('Uploaded files:', files); // Debug log
    
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    console.log('File URLs:', fileUrls); // Debug log
    
    // Add timestamp
    const entry = {
      title,
      content,
      tags,
      files: fileUrls,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Saving entry with files:', entry.files); // Debug log
    
    const result = await db.collection("entries").insertOne(entry);
    return Response.json(result);
  } catch (error) {
    console.error('Error creating entry:', error);
    return Response.json(
      { error: error.message || 'Failed to create entry' },
      { status: 500 }
    );
  }
}
