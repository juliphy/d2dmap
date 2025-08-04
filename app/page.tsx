'use client'
import { SessionProvider } from "next-auth/react";
import MyMap from "./components/map";
import MyPage from "./map";
import { Suspense } from "react";

export default function MainPage() {
    return (
        <SessionProvider>
            <Suspense><MyPage/></Suspense>
        </SessionProvider>
    )
}