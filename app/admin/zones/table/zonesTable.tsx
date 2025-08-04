import Link from "next/link";

export default function ZonesTable() {
  return (
    <div className="p-6 items-center">
      <Link
        href="/admin/zones/"
        className="text-primary te hover:text-blue-800 font-medium mb-4 inline-block"
      >
        Przejdż do widoka reportów
      </Link>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Nazwa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Godziny
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                PZ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                PZ+35
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Efektywność
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Wysłane przez
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data utworzenia
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data żołtego stanu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Data zielonego stanu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition">
              <th scope="row" className="px-6 py-4 text-gray-900 font-medium">
                Jezioro
              </th>
              <td className="px-6 py-4 text-gray-700">10</td>
              <td className="px-6 py-4 text-gray-700">2</td>
              <td className="px-6 py-4 text-gray-700">2</td>
              <td className="px-6 py-4 text-gray-700">0.20</td>
              <td className="px-6 py-4 text-gray-700">Oleksandr Senchuk</td>
              <td className="px-6 py-4 text-gray-700">21.06.2020</td>
              <td className="px-6 py-4 text-gray-700">21.06.2020</td>
              <td className="px-6 py-4 text-gray-700">21.06.2020</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
