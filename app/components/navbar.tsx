import Link from "next/link";

export default function AdminNavbar() {
    return (
        <div className="flex flex-row gap-6 text-xl items-center justify-center mt-6 mb-16">
            <Link className="text-primary font-medium hover:text-[#1286b4]" href="/admin/zones">Strefy</Link>
            <Link className="text-primary font-medium hover:text-[#1286b4]" href="/admin/users">Użytkowniki</Link>
            <Link className="text-primary font-medium hover:text-[#1286b4]" href="/">Mapa</Link>
        </div>
    )
}