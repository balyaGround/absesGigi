// File: app/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { User2Icon } from "lucide-react";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().nama);
          setUserRole(userSnap.data().role);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Dashboard {userRole}</h1>
      <div className="flex items-center space-x-4">
        <User2Icon className="w-6 h-6" />
        <span className="text-sm font-medium truncate max-w-[150px]">
          Halo {userName} (^___^)v
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 font-semibold px-3 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
