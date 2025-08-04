'use client'
import { SessionProvider } from "next-auth/react";
import MapPage from "./MapPage";
import { Suspense } from "react";

export default function MainPage() {
    return (
        <SessionProvider>
            <Suspense><MapPage/></Suspense>
        </SessionProvider>
    )
}