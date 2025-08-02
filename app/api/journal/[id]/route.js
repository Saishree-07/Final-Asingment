import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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

export async function GET(_, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(); // Use default database from connection string
    const entry = await db.collection("entries").findOne({ _id: new ObjectId(id) });
    return Response.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    return Response.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
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
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    
    // Get existing entry to preserve existing files
    const existingEntry = await db.collection("entries").findOne({ _id: new ObjectId(id) });
    const existingFiles = existingEntry?.files || [];
    
    // Combine existing and new files
    const allFiles = [...existingFiles, ...fileUrls];
    
    await db.collection("entries").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          title,
          content,
          tags,
          files: allFiles,
          updatedAt: new Date()
        }
      }
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating entry:', error);
    return Response.json(
      { error: error.message || 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(); // Use default database from connection string
    await db.collection("entries").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return Response.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
} 