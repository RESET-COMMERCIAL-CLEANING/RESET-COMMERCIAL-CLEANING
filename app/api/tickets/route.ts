import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: any = null;
let db: any = null;

function initializeFirebase() {
  if (!app) {
    try {
      app = initializeApp(firebaseConfig, { name: 'api-app' });
      db = getFirestore(app);
    } catch (error) {
      // App already initialized
      db = getFirestore();
    }
  }
  return db;
}

async function generateTicketNumber(): Promise<string> {
  const db = initializeFirebase();
  const ticketsRef = collection(db, 'tickets');
  const q = query(ticketsRef, orderBy('createdAt', 'desc'), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return 'TKT-001';
  }

  const lastDoc = snapshot.docs[0];
  const lastNumber = parseInt(lastDoc.id.split('-')[1] || '0');
  return `TKT-${String(lastNumber + 1).padStart(3, '0')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = initializeFirebase();

    const ticketNumber = await generateTicketNumber();

    const ticketData = {
      ticketNumber,
      userId: body.userId || `client-${Date.now()}`,
      userName: body.userName,
      userEmail: body.userEmail,
      userType: body.userType || 'client',
      category: body.category,
      subject: body.subject,
      message: body.message,
      status: 'assigned',
      priority: body.priority || 'medium',
      createdAt: Timestamp.now(),
      attachments: [],
    };

    const ticketsRef = collection(db, 'tickets');
    const docRef = await addDoc(ticketsRef, ticketData);

    return NextResponse.json({
      success: true,
      ticketId: docRef.id,
      ticketNumber,
      message: 'Ticket created successfully',
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create ticket',
      },
      { status: 500 }
    );
  }
}
