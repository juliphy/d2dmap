'use client'
import { SessionProvider } from "next-auth/react";
import MyMap from "./components/map";
import MyPage from "./map";

export default function MainPage() {
    return (
        <SessionProvider>
            <MyPage/>
        </SessionProvider>
    )
}