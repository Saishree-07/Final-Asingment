import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Use default database from connection string
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray();
    
    // Test insert with a simple document
    const testResult = await db.collection("test").insertOne({
      test: true,
      timestamp: new Date()
    });
    
    // Clean up test document
    await db.collection("test").deleteOne({ _id: testResult.insertedId });
    
    return Response.json({
      success: true,
      message: 'MongoDB connection successful',
      collections: collections.map(c => c.name),
      testInsert: testResult.insertedId ? 'success' : 'failed'
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    return Response.json({
      success: false,
      error: error.message,
      code: error.code,
      codeName: error.codeName
    }, { status: 500 });
  }
} 