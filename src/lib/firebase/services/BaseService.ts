import { db } from "../config";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  DocumentData,
  QueryConstraint,
  query,
  QuerySnapshot,
  DocumentSnapshot
} from "firebase/firestore";

export abstract class BaseService<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get all documents
  async getAll(constraints: QueryConstraint[] = []): Promise<(T & { id: string })[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (T & { id: string })[];
    } catch (error) {
      console.error(`Error fetching from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document by ID
  async getById(id: string): Promise<(T & { id: string }) | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as (T & { id: string });
      }
      return null;
    } catch (error) {
      console.error(`Error fetching document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Add a new document
  async add(data: Omit<T, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), data as DocumentData);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding to ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, data as DocumentData);
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }
}
