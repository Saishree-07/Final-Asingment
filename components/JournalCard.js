'use client';
import Link from 'next/link';

export default function JournalCard({ entry, onDelete }) {
  return (
    <div className="journal-card container">
      <h3>{entry.title}</h3>
      <p>{entry.content.substring(0, 150)}...</p>
      <footer>
        <div>{new Date(entry.createdAt).toLocaleDateString()}</div>
        <div className="actions">
          <Link href={`/journal/${entry._id}`}>Edit</Link>
          <button onClick={() => onDelete(entry._id)}>Delete</button>
        </div>
      </footer>
    </div>
  );
}
