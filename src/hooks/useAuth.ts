import { useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPersistence = async (email: string, pass: string, rememberMe: boolean) => {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistenceType);
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return { user, loading, logout, loginWithPersistence };
}
